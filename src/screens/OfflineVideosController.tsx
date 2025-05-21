import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAPIs, useThemeX } from '../hooks';
import useZuStore from '../store/useZuStore';
import { defStyObjType, videoItemType } from '../types';
import { MasterView, PressX, TextX, VideoItem } from '../components';
import { bSpace } from '../utils';
import { Size } from '../functions';

/**
 * @description OfflineVideosController displays a list of videos that have been downloaded
 * and are available for offline playback. It retrieves video data from the Zustand store.
 * It also includes a pull-to-refresh mechanism, though the primary data source for *this*
 * screen is expected to be locally stored videos.
 */
const OfflineVideosController = () => {

    // Destructure API functions from custom hook (Note: getVideoListAPI fetches online list)
    const { getVideoListAPI } = useAPIs();
    // Destructure video list data from Zustand store (expected to contain downloaded videos)
    const { videoListData } = useZuStore();
    // Destructure theme-related properties and internationalization strings from custom hook
    const { top, col, str, defStyOBJ, cpSty, setToast } = useThemeX(); // Added setToast
    // Generate styles based on the default style object and theme colors
    const sty = styFN(defStyOBJ);

    // State for managing pull-to-refresh loading indicator
    const [topLoading, setTopLoading] = useState<boolean>(false);
    // State for managing load-more (pagination) loading indicator (not fully utilized here)
    const [bottomLoading, setBottomLoading] = useState<boolean>(false);
    // State to hold fetched video data (NOTE: This state is currently unused by the FlatList in this component)
    const [videosData, setVideosData] = useState<Array<videoItemType>>([]);

    // Ref to track if there are more pages of data to load (for pagination, not fully utilized here)
    const hasNextPageRef = useRef<boolean>(true);

    /**
     * @description Fetches video list data from an API.
     * This function currently fetches the *online* video list, but the FlatList in this
     * component displays *offline* (downloaded) videos from `videoListData` in the Zustand store.
     * The fetched `videosData` state is not used to populate the list on this screen.
     * This function might be a remnant from a previous design or intended for a different purpose.
     *
     * @param {object} options - Options for the fetch operation.
     * @param {boolean} [options.topRefresh=false] - True if triggered by pull-to-refresh.
     * @param {boolean} [options.bottomRefresh=false] - True if triggered by load-more.
     */
    async function getVideoList({ topRefresh = false, bottomRefresh = false }:
        { topRefresh?: boolean, bottomRefresh?: boolean; }) {

        // Set loading states based on the refresh type
        if (bottomRefresh) setBottomLoading(true);
        if (topRefresh) {
            hasNextPageRef.current = true; // Reset hasNextPageRef on top refresh
            setTopLoading(true);
        }
        // If there are no more pages to load, exit early (based on online pagination logic)
        if (!hasNextPageRef.current) return;

        try {
            // Await the API call to get video list (this fetches the online list)
            const { res } = await getVideoListAPI();

            // Update hasNextPageRef based on the API response (for online pagination)
            hasNextPageRef.current = !!(res?.next);

            // Access the video files array from the specific structure of the response
            const vData = res?.videos?.[0]?.video_files;

            // If video data is an array, update the local state.
            // NOTE: This `videosData` state is NOT used by the FlatList in this component.
            if (Array.isArray(vData)) {
                setVideosData(vData);
            } else {
                // Show a toast message if the response structure is unexpected
                setToast({ show: true, msg: str.SOMETHING_ITS_WRONG });
            }
        } catch (error) {
            // Handle API errors by showing a toast message
            console.error("Failed to fetch video list for offline screen:", error); // Log error for debugging
            setToast({ show: true, msg: str.SOMETHING_ITS_WRONG_PLZ_TRY_AGAIN });
        } finally {
            // Always reset loading states after the operation completes (success or failure)
            setBottomLoading(false);
            setTopLoading(false);
        }
    }

    /**
     * @description Memoized render function for each item in the FlatList.
     * Renders a `VideoItem` component for each video, explicitly passing `offline` prop.
     * `useCallback` prevents unnecessary re-creation of this function on every render.
     */
    const renderItem = useCallback(({ item, index }:
        { item: videoItemType, index: number }) => (
        <VideoItem
            {...item} // Pass all properties of the video item as props
        />
    ), []); // No specific dependencies needed if VideoItem handles its own interactions

    /**
     * @description useEffect hook to trigger initial data fetch when the component mounts.
     * Currently calls `getVideoList`, which fetches online data, but the FlatList uses `videoListData`.
     * Consider if this `useEffect` and `getVideoList` are truly necessary for an *offline* screen.
     */
    useEffect(() => {
        // Calling getVideoList here, but the FlatList uses videoListData from Zustand.
        // This might be redundant if the screen's sole purpose is to display already downloaded videos.
        getVideoList({ topRefresh: true }); // Changed to topRefresh for initial loading indicator
    }, []); // Empty dependency array ensures this runs only once on mount

    return (
        <MasterView fixed title={str.OFFLINE_VIDEOS}>
            {/* FlatList component for rendering the scrollable list of offline videos */}
            <FlatList
                data={Object.values(videoListData).reverse()} // Data source: values from Zustand's videoListData, reversed
                renderItem={renderItem} // Function to render each item
                contentContainerStyle={{ padding: bSpace }} // Padding around the list content
                // Key extractor for list items. Using index as a fallback if item.id is not available or unique.
                keyExtractor={(_, index) => String(index)}
                // Component rendered between list items for spacing
                ItemSeparatorComponent={() => <View style={{ height: bSpace / 2 }} />}
                // Pull-to-refresh functionality
                refreshControl={
                    <RefreshControl
                        colors={[col.PRIMARY, col.PRIMARY, col.PRIMARY]} // Color of the refreshing indicator
                        tintColor={col.PRIMARY} // Color of the loading spinner on iOS
                        progressBackgroundColor={col.SECONDARY} // Background color of the loading spinner on Android
                        refreshing={topLoading} // Boolean to control refresh indicator visibility
                        onRefresh={() => getVideoList({ topRefresh: true })} // Callback on pull-to-refresh
                    />
                }
                // Component rendered when the list is empty
                ListEmptyComponent={() => {
                    // Only show "Records Not Found" if not currently loading
                    if (topLoading) return null;
                    return (
                        <View style={cpSty.emptyListMSG_cSty}>
                            <TextX text={str.RECORDS_NOT_FOUND} tSty={cpSty.emptyListMSG_tSty} />
                        </View>
                    );
                }}
            />
        </MasterView>
    );
};

export default OfflineVideosController;

/**
 * @description `styFN` is a function that returns a StyleSheet object.
 * It's defined outside the component to prevent re-creation on every render,
 * improving performance. It takes theme properties to create dynamic styles.
 *
 * @param {defStyObjType} defStyObj - Object containing default style properties from the theme.
 * @returns {object} A StyleSheet object containing various styles for the component.
 */
const styFN = ({ font, col, bottom }: defStyObjType) => StyleSheet.create({
    // These styles appear to be for the "Offline Videos" button in VideoListingController,
    // and are not directly used within OfflineVideosController itself.
    offlineVideoCSty: {
        paddingVertical: bSpace,
        width: "100%",
        backgroundColor: col.PRIMARY,
        paddingHorizontal: bSpace,
        borderRadius: bSpace,
    },
    offlineVideoTSty: {
        fontFamily: font.SEMI_BOLD,
        fontSize: Size(15),
        color: col.WHITE
    }
});
