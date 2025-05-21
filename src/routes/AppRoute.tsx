import React, { Fragment, useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppStack } from '../utils'; // Assuming AppStack is created using createStackNavigator
import BottomTab from './BottomTab'; // Bottom tab navigator component
import { ToastAlert } from '../components'; // Custom component for displaying toast messages
import { useDebounce, useMMKVStore } from '../hooks'; // Custom hooks for debouncing and MMKV storage
import {
    AddEditTaskScr,
    OfflineVideosScr,
    PlayVideoScr,
    TaskDetailsScr
} from '../screens'; // Screen components for different functionalities
import { useNetInfoInstance } from "@react-native-community/netinfo"; // Hook for network connectivity information
import useString from '../language'; // Custom hook for internationalization strings

/**
 * @description AppRoute component sets up the main navigation structure of the application.
 * It handles network connectivity status, displays toast messages for offline status,
 * and integrates various screens into a stack navigator.
 */
const AppRoute = () => {

    // Initialize internationalization strings
    const str = useString();
    // Access and manage toast state from MMKV storage (for persistence across app sessions)
    const { toast, setToast } = useMMKVStore();
    // Get network connectivity information and a refresh function from @react-native-community/netinfo
    const { refresh, netInfo: { isConnected } } = useNetInfoInstance();
    // Ref to track if it's the first render to prevent initial useEffect execution
    const isFirstRender = useRef(true);

    /**
     * @description State to control the visibility of a splash screen.
     * (Note: The actual splash screen logic is not fully present in this snippet,
     * but this state variable is typically used for that purpose.)
     */
    const [isSplashScreenVisible, setIsSplashScreenVisible] = useState(true);

    // Debounce the network connection status to prevent rapid state changes and toast flickering
    const isConnectedDebounced = useDebounce(isConnected, 1000);

    /**
     * @description useEffect hook to display a toast message when the internet connection is lost.
     * It uses a debounced connection status to avoid showing the message too frequently.
     * The `isFirstRender` ref ensures the toast doesn't show on initial app load if offline.
     */
    useEffect(() => {
        // Skip the effect on the very first render
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // If debounced connection status is false (offline), show a toast message
        if (!isConnectedDebounced) {
            setToast({ show: true, msg: str.YOUR_INTERNET_CONNCTIONS_IS_NOT_CONNECTED });
        }
    }, [isConnectedDebounced, setToast, str.YOUR_INTERNET_CONNCTIONS_IS_NOT_CONNECTED]); // Dependencies for the effect

    return (
        <Fragment>
            {/* Main navigation container for the application */}
            <NavigationContainer
                /**
                 * @description Callback fired when the navigation state changes.
                 * This provides an additional check for network connectivity during navigation events.
                 * If offline, it immediately shows a toast message.
                 * (Consider consolidating this with the debounced effect if only one toast timing is desired.)
                 */
                onStateChange={() => {
                    if (!isConnected) {
                        setToast({ show: true, msg: str.YOUR_INTERNET_CONNCTIONS_IS_NOT_CONNECTED });
                    }
                }}
            >
                {/* Stack Navigator for handling screen transitions */}
                <AppStack.Navigator>
                    {/* BottomTab Navigator as the initial screen */}
                    <AppStack.Screen
                        name={"BottomTab"}
                        component={BottomTab}
                        options={{ headerShown: false }} // Hide header for this screen
                    />
                    {/* Task Details Screen */}
                    <AppStack.Screen
                        name={"TaskDetailsScr"}
                        component={TaskDetailsScr}
                        options={{ headerShown: false }}
                    />
                    {/* Add/Edit Task Screen */}
                    <AppStack.Screen
                        name={"AddEditTaskScr"}
                        component={AddEditTaskScr}
                        options={{ headerShown: false }}
                    />
                    {/* Offline Videos Screen */}
                    <AppStack.Screen
                        name={"OfflineVideosScr"}
                        component={OfflineVideosScr}
                        options={{ headerShown: false }}
                    />
                    {/* Play Video Screen */}
                    <AppStack.Screen
                        name={"PlayVideoScr"}
                        component={PlayVideoScr}
                        options={{ headerShown: false }}
                    />
                </AppStack.Navigator>
            </NavigationContainer>
            {/* Toast Alert component to display messages based on the 'toast' state */}
            <ToastAlert {...toast} setToast={setToast} />
        </Fragment>
    );
};

export default AppRoute;
