import { View, StyleSheet, RefreshControl, FlatList } from 'react-native'; // Removed unused Alert and Text imports
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAPIs, useThemeX } from '../../hooks'; // Custom hooks for API calls and theme
import useZuStore from '../../store/useZuStore'; // Zustand store for video data (and potentially task data, though not used here)
import { defStyObjType, videoItemType } from '../../types'; // Type definitions for styles and video items
import { MasterView, PressX, TextX, VideoItem } from '../../components'; // UI components
import { bSpace } from '../../utils'; // Utility constants (e.g., base spacing)
import { Size } from '../../functions'; // Utility function for sizing (e.g., font size)

/**
 * @description VideoListingController manages the display and fetching of video lists.
 * It integrates with a Zustand store to manage video data, handles API calls,
 * and provides UI for viewing videos, navigating to offline videos, and pull-to-refresh.
 *
 * @param {object} props - Component props.
 * @param {object} props.navigation - Navigation object from React Navigation.
 */
const VideoListingController = ({ navigation }: any) => {

    // Destructure API functions from custom hook
    const { getVideoListAPI } = useAPIs();
    // Destructure video list data from Zustand store.
    // Note: setTaskListData and taskListData are imported but not used in this component.
    const { videoListData } = useZuStore();
    // Destructure theme-related properties and internationalization strings from custom hook
    const { top, col, str, defStyOBJ, cpSty, setToast } = useThemeX();
    // Generate styles based on the default style object and theme colors
    const sty = styFN(defStyOBJ);

    // State for managing pull-to-refresh loading indicator
    const [topLoading, setTopLoading] = useState<boolean>(true);
    // State for managing load-more (pagination) loading indicator (though not fully implemented here)
    const [bottomLoading, setBottomLoading] = useState<boolean>(false);
    // State to hold the fetched video data
    const [videosData, setVideosData] = useState<Array<videoItemType>>([]);

    // Ref to track if there are more pages of data to load (for pagination)
    const hasNextPageRef = useRef<boolean>(true);

    /**
     * @description Fetches video list data from the API.
     * Manages loading states for pull-to-refresh (`topRefresh`) and load-more (`bottomRefresh`).
     * Updates the `videosData` state and handles API errors.
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
            hasNextPageRef.current = true; // Reset hasNextPageRef on top refresh to fetch from start
            setTopLoading(true);
        }
        // If there are no more pages to load, exit early
        if (!hasNextPageRef.current) return;

        try {
            // Await the API call to get video list
            const { res } = await getVideoListAPI();

            // Update hasNextPageRef based on the API response (assuming 'next' property indicates more data)
            hasNextPageRef.current = !!(res?.next);

            // Access the video files array from the specific structure of the response
            const vData = res?.videos?.[0]?.video_files;

            // If video data is an array, update the state
            if (Array.isArray(vData)) {
                setVideosData(vData);
            } else {
                // Show a toast message if the response structure is unexpected
                setToast({ show: true, msg: str.SOMETHING_ITS_WRONG });
            }
        } catch (error) {
            // Handle API errors by showing a toast message
            console.error("Failed to fetch video list:", error); // Log error for debugging
            setToast({ show: true, msg: str.SOMETHING_ITS_WRONG_PLZ_TRY_AGAIN });
        } finally {
            // Always reset loading states after the operation completes (success or failure)
            setBottomLoading(false);
            setTopLoading(false);
        }
    }

    /**
     * @description Memoized render function for each item in the FlatList.
     * Renders a `VideoItem` component for each video.
     * `useCallback` prevents unnecessary re-creation of this function on every render.
     */
    const renderItem = useCallback(({ item, index }:
        { item: videoItemType, index: number }) => (
        <VideoItem
            {...item} // Pass all properties of the video item as props
        // Add onPress prop here if VideoItem should navigate to PlayVideoScr
        // onPress={() => navigation.navigate("PlayVideoScr", { videoUrl: item.link })}
        />
    ), []); // No specific dependencies needed if VideoItem handles its own interactions

    /**
     * @description useEffect hook to fetch initial video data when the component mounts.
     * It triggers a `bottomRefresh` to ensure data is loaded.
     */
    useEffect(() => {
        getVideoList({ bottomRefresh: true });
    }, []); // Empty dependency array ensures this runs only once on mount

    return (
        <MasterView fixed hShow={false}>
            {/* FlatList component for rendering the scrollable list of videos */}
            <FlatList
                data={videosData} // Data source for the list
                renderItem={renderItem} // Function to render each item
                contentContainerStyle={{ padding: bSpace }} // Padding around the list content
                // Key extractor for list items. Using index as a fallback if item.id is not available or unique.
                keyExtractor={(_, index) => String(index)}
                // Component rendered between list items for spacing
                ItemSeparatorComponent={() => <View style={{ height: bSpace / 2 }} />}
                // Header component for the FlatList, containing the "Offline Videos" button
                ListHeaderComponent={
                    <>
                        {/* Only show "Offline Videos" button if there are downloaded videos in videoListData */}
                        {Object.values(videoListData).length > 0 && (
                            <PressX
                                onPress={() => navigation.navigate("OfflineVideosScr")} // Navigate to the offline videos screen
                                text={str.OFFLINE_VIDEOS} // Text for the button
                                cSty={sty.offlineVideoCSty} // Child style for the button's inner content/styling
                                tSty={sty.offlineVideoTSty} // Text style for the button
                                mSty={{ marginBottom: bSpace / 2 }} // Margin below the button
                            />
                        )}
                    </>
                }
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

export default VideoListingController;

/**
 * @description `styFN` is a function that returns a StyleSheet object.
 * It's defined outside the component to prevent re-creation on every render,
 * improving performance. It takes theme properties to create dynamic styles.
 *
 * @param {defStyObjType} defStyObj - Object containing default style properties from the theme.
 * @returns {object} A StyleSheet object containing various styles for the component.
 */
const styFN = ({ font, col, bottom }: defStyObjType) => StyleSheet.create({
    offlineVideoCSty: {
        paddingVertical: bSpace, // Vertical padding for the button
        width: "100%", // Full width button
        backgroundColor: col.PRIMARY, // Background color of the button
        paddingHorizontal: bSpace, // Horizontal padding
        borderRadius: bSpace, // Rounded corners for the button
    },
    offlineVideoTSty: {
        fontFamily: font.SEMI_BOLD, // Font family for the button text
        fontSize: Size(15), // Font size for the button text
        color: col.WHITE, // Text color
        textAlign: 'center', // Center the text horizontally
    },
});
