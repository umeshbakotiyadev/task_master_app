import { View, StyleSheet } from 'react-native';
import React, { Fragment, ReactNode, useCallback } from 'react';
import { useThemeX } from '../hooks'; // Custom hook to access theme-related properties (colors, default styles)
import { PressX } from '../components'; // Custom Pressable component (likely for consistent touch feedback)
import { defStyObjType } from '../types'; // Type definition for default style object
import { LIST_IC } from '../assets'; // SVG icon component for list (assuming it's a generic list icon)

/**
 * @description CustomizeBottomTabBar is a custom component for rendering the bottom tab bar.
 * It replaces the default tab bar provided by React Navigation to allow for custom styling
 * and interactive elements for each tab.
 *
 * @param {object} props - Props passed from the React Navigation tab navigator.
 * @param {object} props.state - The navigation state object, containing routes and the current index.
 * @param {object} props.descriptors - An object containing options and metadata for each route.
 * @param {object} props.navigation - The navigation object used to navigate between screens.
 */
const CustomizeBottomTabBar = ({ state, descriptors, navigation }: any) => {

    // Destructure theme-related properties from the custom hook
    const { col, defStyOBJ, bottom } = useThemeX();
    // Generate styles based on the default style object and theme colors
    const sty = styFN(defStyOBJ);

    /**
     * @description `getTabs` is a memoized callback function that renders the individual tab buttons.
     * It iterates through the navigation state's routes and creates a `PressX` component for each tab.
     * `useCallback` is used to prevent unnecessary re-renders of this function.
     *
     * @returns {ReactNode[]} An array of React Native components representing the tab buttons.
     */
    const getTabs = useCallback(() => {
        // Map over the routes in the navigation state to create a tab button for each route
        return state?.routes?.map((route: any, index: number) => {
            // Get screen options and metadata for the current route
            const { options } = descriptors[route.key];
            // Determine if the current tab is focused (active)
            const isFocused: boolean = state.index === index;

            /**
             * @description `getIcon` returns the appropriate SVG icon component based on the screen name.
             * The icon's color changes based on whether the tab is focused or not.
             *
             * @param {string} name - The name of the screen (route.name).
             * @returns {{ svg: ReactNode }} An object containing the SVG icon component.
             */
            function getIcon(name: string): { svg: ReactNode } {
                switch (name) {
                    case 'FriendsListingScr':
                        // Assuming LIST_IC is a generic list icon. If different icons are needed for
                        // FriendsListingScr and VideoListingScr, distinct SVG components should be imported.
                        return ({ svg: <LIST_IC color={isFocused ? col.WHITE : col.BLACK} /> });
                    case 'VideoListingScr':
                        return ({ svg: <LIST_IC color={isFocused ? col.WHITE : col.BLACK} /> });
                    default:
                        // Return an empty fragment if no matching icon is found
                        return { svg: <></> };
                }
            }

            /**
             * @description `onPress` handles the tab press event.
             * It emits a 'tabPress' event and navigates to the pressed tab's screen
             * if it's not already focused and the default navigation is not prevented.
             */
            const onPress = () => {
                const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true, // Allows other listeners to prevent default navigation
                });

                // If the tab is not focused and default navigation is not prevented, navigate to the screen
                if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                }
            };

            // Render a custom pressable component for each tab
            return (
                <PressX
                    key={index.toString()} // Unique key for list rendering
                    onPress={onPress} // Attach the press handler
                    mSty={sty.btnMSty} // Main style for the PressX component
                    cSty={sty.btnCSty} // Child style for the PressX component (e.g., inner container)
                // Optional: You can uncomment and use `bgCol` to change background color based on focus
                // bgCol={isFocused ? col.PRIMARY : col.SECONDARY}
                >
                    {getIcon(route?.name)?.svg} {/* Render the icon for the current tab */}
                </PressX>
            );
        });
    }, [state, navigation, descriptors, col.WHITE, col.BLACK]); // Dependencies for useCallback

    return (
        <View style={[sty.mainContainer]}>
            <View style={sty.iconContainer}>
                {getTabs()} {/* Render the generated tab buttons */}
            </View>
            {/* This View creates a safe area at the bottom, accounting for device notches/bezels */}
            <View style={{ height: bottom, backgroundColor: col.BOOTOM_TAB_BG }} />
        </View>
    );
};

export default CustomizeBottomTabBar;

/**
 * @description `styFN` is a function that returns a StyleSheet object.
 * It's defined outside the component to prevent re-creation on every render,
 * improving performance. It takes theme properties to create dynamic styles.
 *
 * @param {defStyObjType} defStyObj - Object containing default style properties from the theme.
 * @returns {object} A StyleSheet object containing various styles for the tab bar.
 */
const styFN = ({ col, font, bottom }: defStyObjType) => StyleSheet.create({
    mainContainer: {
        height: 55 + bottom, // Total height of the tab bar, including safe area
        justifyContent: 'center', // Center content vertically
        backgroundColor: col.BOOTOM_TAB_BG, // Background color of the tab bar
        // Add shadow properties for a lifted effect (example)
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    iconContainer: {
        flexDirection: 'row', // Arrange icons horizontally
        justifyContent: 'space-evenly', // Distribute space evenly between icons
        alignItems: 'center', // Align icons vertically in the center
        paddingHorizontal: 10, // Add some horizontal padding
    },
    btnMSty: {
        justifyContent: 'center', // Center content within the button (main style)
    },
    btnCSty: {
        alignItems: 'center', // Center icon horizontally within the button (child style)
        padding: 2, // Inner padding for the button
        paddingHorizontal: 30, // Horizontal padding for touch target size
        borderRadius: 100, // Make the button circular (or highly rounded)
    },
});
