import React from 'react';
import CustomizeBottomTabBar from './CustomizeBottomTabBar'; // Custom component for the bottom tab bar UI
import { BottomTabStack } from '../utils'; // Assuming BottomTabStack is created using createBottomTabNavigator
import { ListAllTaskScr, VideoListingScr } from '../screens'; // Screen components for the tabs
import { StackProps } from '../types'; // Type definition for navigation props (though not directly used in this component's props destructuring)

/**
 * @description BottomTab component sets up the bottom tab navigator for the application.
 * It defines the main navigation tabs, including the task list and video listing screens,
 * and uses a custom component for the tab bar's appearance.
 *
 * @param {StackProps<'BottomTab'>} props - The navigation props for this component.
 * Although not destructured here, it typically
 * includes 'navigation' and 'route' objects.
 */
const BottomTab = ({ }: StackProps<'BottomTab'>) => {

    return (
        /**
         * @description BottomTabStack.Navigator is the core component for tab-based navigation.
         * It manages multiple screens, each accessible via a tab button at the bottom of the screen.
         */
        <BottomTabStack.Navigator
            /**
             * @description `tabBar` prop allows for complete customization of the bottom tab bar.
             * Instead of the default tab bar, it renders the `CustomizeBottomTabBar` component,
             * passing all necessary props from the navigator.
             */
            tabBar={props => <CustomizeBottomTabBar {...props} />}
            /**
             * @description `screenOptions` apply default options to all screens within this navigator.
             * `headerShown: false` ensures that no header is displayed by default for any of the tab screens,
             * allowing individual screens or parent navigators to manage their headers.
             */
            screenOptions={{ headerShown: false }}
        >
            {/* Screen for displaying the list of all tasks (Dashboard Screen) */}
            <BottomTabStack.Screen
                name='FriendsListingScr' // Name of the screen, used for navigation
                component={ListAllTaskScr} // The component to render for this tab
                /**
                 * @description `initialParams` are parameters passed to the screen when it is first mounted.
                 * `tabScr: true` might be used by `ListAllTaskScr` to identify that it's rendered within a tab
                 * and adjust its layout or behavior accordingly (e.g., hiding a back button).
                 */
                initialParams={{ tabScr: true }}
            />
            {/* Screen for displaying the list of videos (Offline Video Screen) */}
            <BottomTabStack.Screen
                name='VideoListingScr' // Name of the screen, used for navigation
                component={VideoListingScr} // The component to render for this tab
                /**
                 * @description Similar to `ListAllTaskScr`, `tabScr: true` is passed to `VideoListingScr`
                 * to indicate its context within the tab navigator.
                 */
                initialParams={{ tabScr: true }}
            />
        </BottomTabStack.Navigator>
    );
};

export default BottomTab;
