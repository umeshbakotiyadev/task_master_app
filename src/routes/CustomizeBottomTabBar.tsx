import { View, StyleSheet } from 'react-native'
import React, { ReactNode, useCallback } from 'react'
import { useThemeX } from 'hooks';
import { _WIDTH, bSpace } from 'utils';
import PressXCompo from 'components/XCompos/PressXCompo';
import { defStyType } from 'Types';
import ViewXCompo from 'components/XCompos/ViewXCompo';
import TextXCompo from 'components/XCompos/TextXCompo';
import { Size } from 'functions';
import { IMAGE_TAB_IC, MAP_TAB_IC, MESSAGE_TAB_IC, PROFILE_TAB_IC, SEARCH_TAB_IC } from 'assets';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS } from 'react-native-reanimated';
import { useStore } from 'zustand';
import useAppStore from 'store';

const CustomizeBottomTabBar = ({ state, descriptors, navigation }: any) => {

    const { setIsTopToScrollMomentsPost, isTopToScrollMomentsPost } = useAppStore();
    const { col, font, str, defStyObj, bottom } = useThemeX();
    const sty = styFN(defStyObj);

    const getTabs = useCallback(() => state?.routes?.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused: boolean = state.index === index;

        function getIcon(name: string): { svg: ReactNode, name: string } {
            switch (name) {
                case 'MomentsTab': return ({ name: str.MOMENTS, svg: <IMAGE_TAB_IC color={isFocused ? col.PRIMARY : col.WHITE} /> })
                case 'MessageTab': return ({ name: str.CHAT, svg: <MESSAGE_TAB_IC color={isFocused ? col.PRIMARY : col.WHITE} color2={col.PRIMARY} /> })
                case 'SearchTab': return ({ name: str.FINDPAL, svg: <SEARCH_TAB_IC color={isFocused ? col.PRIMARY : col.WHITE} /> })
                case 'MapTab': return ({ name: str.COURT_MAP, svg: <MAP_TAB_IC color={isFocused ? col.PRIMARY : col.WHITE} /> })
                case 'ProfileTab': return ({ name: str.YOU, svg: <PROFILE_TAB_IC color={isFocused ? col.PRIMARY : col.WHITE} /> })
                default:
                    return { name: "", svg: <></> };
            }
        }


        const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key });
            if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
            }
        };

        const singleTap = Gesture.Tap()
            .onEnd((_event, success) => {
                if (success) {
                    runOnJS(onPress)();
                    runOnJS(setIsTopToScrollMomentsPost)();
                }
            });
        const doubleTap = Gesture.Tap()
            .numberOfTaps(2)
            .onEnd((_event, success) => {
                if (success && route?.name == "MomentsTab") {
                    runOnJS(onPress)();
                    runOnJS(setIsTopToScrollMomentsPost)();
                }
                else if (success) {
                    runOnJS(onPress)();
                    runOnJS(setIsTopToScrollMomentsPost)();
                }
            });

        const exclusiveGesture = Gesture.Exclusive(doubleTap, singleTap);

        return (
            <GestureDetector gesture={exclusiveGesture} key={route?.name} >
                <Animated.View style={sty.btnMSty} >
                    <Animated.View style={sty.btnCSty} >
                        {getIcon(route?.name)?.svg}
                        <TextXCompo text={getIcon(route?.name)?.name} tSty={sty.titleText} />
                    </Animated.View>
                </Animated.View>
            </GestureDetector>)

    }), [state, navigation, descriptors, isTopToScrollMomentsPost]);

    return (
        <View style={[sty.mainContainer]} >
            <ViewXCompo style={sty.iconContainer} >
                {getTabs()}
            </ViewXCompo>
            <ViewXCompo h={bottom} bgCol={col.DEEP_SEA_BLUE} />
        </View>
    );
}

export default CustomizeBottomTabBar

const styFN = ({ col, font, bottom }: defStyType) => StyleSheet.create({

    mainContainer: {
        backgroundColor: col.DEEP_SEA_BLUE,
        height: 55 + bottom,
    },
    iconContainer: {
        flex: 1,
        flexDirection: 'row',
        height: 60,
    },
    btnMSty: {
        // flex: 1,
        height: "100%",
        flexGrow: 1,
        justifyContent: 'center',
    },
    btnCSty: {
        height: "100%",
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 7,
    },
    titleText: {
        fontFamily: font.REGULAR,
        fontSize: Size(11),
        color: col.WHITE,
        paddingHorizontal: 8
    },

})