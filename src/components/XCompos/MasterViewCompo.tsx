import { KeyboardAvoidingView, SafeAreaView, View, } from 'react-native'
import React, { memo } from 'react'
import { ScrollView as ScrollViewG } from 'react-native-gesture-handler';
import HeaderXCompo from './HeaderXCompo';
import { useThemeX } from 'hooks';
import { MasterViewType } from 'Types';
import ViewXCompo from './ViewXCompo';
import { defStyFN } from 'functions';
import { kAvoidSty } from 'utils';
import Animated from 'react-native-reanimated';
import AlertBoxCompo from 'components/AlertBoxCompo';
import ScrLoaderCompo from 'components/ScrLoaderCompo';

/**
 * Master View
 * its can handle default view of device like 
 * top navigation bar, bottom tab navigation bar, header
 * its can handle screen default view is scrollable or fixed.
 * screen contents
 * any many more...
 */
const MasterViewCompo = ({
    fixed = false, gScroll = false,
    style, bgCol, bgCol2, scrollViewRef,
    header, bottomBarColor,
    autoAdujKeyInsets, bounces, onScroll, keyboardShouldPersistTaps = 'always',
    modals, bSvg, tSvg, bgImgUri, bgImgSource, scrollEnabled,

    /** header props */
    title, titleCompo, bPress, backBtn = true, lSvg, rSvg, tSty, hHeight, hBgColor,
    alignText = 'center', lHeight, rHeight, hShow = true, hMSty,
    barStyle, sbColor, sbShow = true, sbTransition, hShadow,
    backBtnType, hBtnColor, appIcon, abScrLoader, abLoader, toast, setToast,
    scrLoader,

    alert, setAlert,
    children, w = "100%", f, ...defStyObj

}: MasterViewType) => {

    const { col, bottom } = useThemeX();

    const headerProps = {
        title, bPress, backBtn, lSvg, rSvg, tSty, hHeight, hBgColor, alignText, lHeight, rHeight, hShow,
        barStyle, sbColor, sbShow, sbTransition, hShadow, backBtnType, hMSty, hBtnColor, appIcon, titleCompo
    }

    return (
        <View style={{ backgroundColor: bgCol ? bgCol : col.D_WHITE, flex: 1 }}>
            {(header ? header : <HeaderXCompo {...headerProps} />)}
            <KeyboardAvoidingView behavior={kAvoidSty}
                style={{ flex: 1, backgroundColor: bgCol2 ? bgCol2 : bgCol, overflow: 'hidden' }}>
                {scrLoader ? <ScrLoaderCompo loading={scrLoader} />
                    : (<>
                        {tSvg && tSvg}
                        {fixed ? (<ViewXCompo {...defStyObj} w={w} f={1} children={children} />)
                            : gScroll ? (
                                <ScrollViewG
                                    ref={scrollViewRef}
                                    bounces={bounces}
                                    onScroll={onScroll}
                                    nestedScrollEnabled={true}
                                    showsVerticalScrollIndicator={false}
                                    scrollEnabled={scrollEnabled}
                                    automaticallyAdjustKeyboardInsets={autoAdujKeyInsets}
                                    style={{ flex: 1, backgroundColor: bgCol, }}
                                    keyboardShouldPersistTaps={keyboardShouldPersistTaps}
                                    contentContainerStyle={[
                                        defStyFN(defStyObj),
                                        { width: w },
                                        style]}>{children}</ScrollViewG>)
                                : (<Animated.ScrollView
                                    ref={scrollViewRef}
                                    bounces={bounces}
                                    onScroll={onScroll}
                                    scrollEnabled={scrollEnabled}
                                    nestedScrollEnabled={true}
                                    showsVerticalScrollIndicator={false}
                                    automaticallyAdjustKeyboardInsets={autoAdujKeyInsets}
                                    style={{ flex: 1, backgroundColor: bgCol, }}
                                    keyboardShouldPersistTaps={keyboardShouldPersistTaps}
                                    contentContainerStyle={[
                                        defStyFN(defStyObj),
                                        { width: w, flexGrow: 1, overflow: 'hidden' },
                                        style]}>{children}</Animated.ScrollView>)}
                        {bSvg && bSvg}
                        <ScrLoaderCompo loading={abLoader} absolute />
                    </>)
                }
            </KeyboardAvoidingView>
            {
                (bottomBarColor) && <SafeAreaView
                    style={{ backgroundColor: bottomBarColor ? bottomBarColor : 'black', height: bottom }}
                />
            }
            {modals && modals}
            <ScrLoaderCompo loading={abScrLoader} absolute />
            <AlertBoxCompo {...toast} setToast={setToast} />
        </View >
    );
}

export default memo(MasterViewCompo)