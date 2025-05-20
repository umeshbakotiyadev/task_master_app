import React from 'react'
import { BottomTabStack } from 'utils'
import { useIsLoginCallFn, useOpenNotification, useThemeX } from 'hooks'
import { MomentsScr, MapScr, MessageScr, ProfileScr, SearchScr } from 'screens'
import { Size } from 'functions'
import CustomizeBottomTabBar from './CustomizeBottomTabBar'

/** Bottom Tab Navigator */
const BottomTab = () => {

    const { font, col, str } = useThemeX();
    const isFocused = (is: boolean): string => is ? col.PRIMARY : col.WHITE;

    /**
     * this call when init application then set some required states 
     * and calling some apis for **/
    useIsLoginCallFn();

    /** Firebase Push Notification */
    useOpenNotification();

    return (
        <BottomTabStack.Navigator
            tabBar={props => <CustomizeBottomTabBar {...props} />}
            // initialRouteName='SearchTab'
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    // height: 86,
                    // paddingVertical: 20,
                    borderTopWidth: undefined,
                    backgroundColor: col.DEEP_SEA_BLUE,
                },
                tabBarLabelStyle: {
                    fontSize: Size(10),
                    color: col.D_WHITE,
                    fontFamily: font.BOLD,
                },
            }}>
            <BottomTabStack.Screen
                name='MomentsTab'
                component={MomentsScr}
                initialParams={{ tabScr: true }} />
            <BottomTabStack.Screen
                name='MessageTab'
                component={MessageScr}
                initialParams={{ tabScr: true }} />
            <BottomTabStack.Screen
                name='SearchTab'
                component={SearchScr}
                initialParams={{ tabScr: true }} />
            <BottomTabStack.Screen
                name='MapTab'
                component={MapScr}
                initialParams={{ tabScr: true }} />
            <BottomTabStack.Screen
                name='ProfileTab'
                component={ProfileScr}
                initialParams={{ tabScr: true }} />
        </BottomTabStack.Navigator>)
}

export default BottomTab