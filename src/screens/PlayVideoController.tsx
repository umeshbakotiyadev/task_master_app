import { View, StyleSheet } from 'react-native'; // StyleSheet imported but not used, can be removed if no styles are defined
import React, { useMemo } from 'react';
import { videoItemType } from '../types'; // Type definition for video item data
import { VideoX } from '../components'; // Custom Video player component (likely wraps react-native-video)
import { useThemeX } from '../hooks'; // Custom hook to access theme-related properties (colors)
import useZuStore from '../store/useZuStore'; // Zustand store for video data (including offline links)
import { regex } from '../functions'; // Utility functions (e.g., regex for string manipulation)

/**
 * @description PlayVideoController is responsible for playing a selected video.
 * It determines whether to play an online video or a locally downloaded (offline) video
 * based on the availability of an offline source link in the Zustand store.
 *
 * @param {object} props - Component props.
 * @param {object} props.route - Route object from React Navigation, containing the selected video item.
 */
const PlayVideoController = ({ route }: any) => {

    // Extract the video item from route parameters. Default to an empty object if not provided.
    const item: videoItemType = route?.params?.item || {};
    // Destructure theme colors from the custom hook
    const { col } = useThemeX();
    // Destructure video list data from Zustand store (contains metadata for downloaded videos)
    const { videoListData } = useZuStore();

    /**
     * @description `isOfflineVideoAvailable` is a memoized boolean that checks if an offline
     * version of the current video is available in the `videoListData` store.
     * It uses `regex.seRMV` to trim whitespace and check if the `offlineSourceLink` is not empty.
     * `useMemo` ensures this calculation only re-runs if `item` or `videoListData` changes.
     */
    const isOfflineVideoAvailable = useMemo(() =>
        Boolean(regex.seRMV(videoListData[item?.id ?? ""]?.offlineSourceLink) !== ""),
        [item, videoListData]
    );

    /**
     * @description `videoURL` is a memoized string that determines the video source URL.
     * If an offline video is available, it uses the `offlineSourceLink` from the store;
     * otherwise, it falls back to the original online `item.link`.
     * `useMemo` ensures this calculation only re-runs if `item`, `isOfflineVideoAvailable`,
     * or `videoListData` changes.
     */
    const videoURL = useMemo(() =>
        (isOfflineVideoAvailable)
            ? videoListData[item?.id ?? ""]?.offlineSourceLink // Use offline link if available
            : item?.link, // Otherwise, use the original online link
        [item, isOfflineVideoAvailable, videoListData]
    );

    return (
        <View style={styles.container}> {/* Added a container style for better structure */}
            <VideoX
                uri={videoURL} // The URL of the video to play (online or offline)
                controls // Show default video player controls (play/pause, seek, etc.)
                resizeMode='contain' // Video will scale to fit the view, maintaining aspect ratio
                fullscreenOrientation='landscape' // Force landscape orientation when in fullscreen
                cSty={{ width: "100%", height: "100%", backgroundColor: col.BLACK }} // Styles for the video player container
            />
        </View>
    );
};

export default PlayVideoController;

/**
 * @description StyleSheet for the PlayVideoController component.
 * Defined outside the component to prevent re-creation on every render, improving performance.
 */
const styles = StyleSheet.create({
    container: {
        flex: 1, // Take up all available space
        backgroundColor: 'black', // Set background to black to blend with video player
        justifyContent: 'center', // Center the video player vertically
        alignItems: 'center', // Center the video player horizontally
    },
});
