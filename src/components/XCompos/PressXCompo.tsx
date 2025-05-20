import { Pressable, Platform, PressableAndroidRippleConfig, ActivityIndicator, View, ViewStyle } from 'react-native'
import React, { memo, useCallback, useState } from 'react'
import { PressXType, } from 'Types'
import { _HEIGHT, _WIDTH, defStyObj } from 'utils';
import { useThemeX } from 'hooks';
import Animated, { Easing, interpolate, interpolateColor, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';
import TextXCompo from './TextXCompo';
import { defStyFN } from 'functions';

/** This is for custom animated press view */
const PressXCompo = ({
    cSty, mSty, children, lCol,
    type = 'p', cProps, mProps, tProps,
    disabled, hitSlop, text, tSty, lProps, loading = false, lSize,
    onPress, onPressIn = () => { }, onPressOut = () => { }, onLongPress = () => { },
    rStyIdx = 0, pStyIdx = 1, dStyIdx = 1, entering, exiting,
    pSty = () => ({}), rSty,
    ...defStyObj
}: PressXType) => {
    const { col } = useThemeX();
    const [_onP, setOnP] = useState<boolean>(false);

    const bgCol_V = useDerivedValue<number>(() => withTiming(_onP ? 0 : 1), [_onP]);
    const opacity_V = useDerivedValue<number | undefined>(() => withTiming(_onP ? .2 : 1, { duration: 300, }), [_onP]);
    const scale_V = useDerivedValue<number>(() => withTiming(_onP ? .975 : 1, { duration: 100, easing: Easing.ease }), [_onP]);
    const disbaled_V = useDerivedValue<number>(() => withTiming(disabled ? .3 : 1, { duration: 200, easing: Easing.ease }), [disabled]);

    const pressedStyX = useAnimatedStyle((): ViewStyle => {
        `worklet`
        if (disabled) return {};

        if (Platform.OS === 'android') switch (pStyIdx) {
            case 0: return ({});
            case 1: return ({ transform: [{ scale: scale_V.value }] });
            case 2: return ({ opacity: opacity_V.value });
            case 3: return ({ opacity: opacity_V.value, transform: [{ scale: scale_V.value }] });
            case 4: return ({ backgroundColor: interpolateColor(bgCol_V.value, [0, 1], [col.PRIMARY, col.TRANSPARENT]) })
        }
        if (Platform.OS === 'ios') switch (pStyIdx) {
            case 0: return ({});
            case 1: return ({ transform: [{ scale: scale_V.value }] });
            case 2: return ({ opacity: opacity_V.value });
            case 3: return ({ opacity: opacity_V.value, transform: [{ scale: scale_V.value }] });
            case 4: return ({ backgroundColor: interpolateColor(bgCol_V.value, [0, 1], [col.PRIMARY, col.TRANSPARENT]) })
        }
        return [{}][0];
    });

    const rippleStyX = useCallback((): PressableAndroidRippleConfig => {
        if (rSty) return rSty;
        return ([
            { color: col.TRANSPARENT, },
            { color: col.BLACK01, },
            { color: col.GREENISH, },
            { color: col.WHITE02, },
        ][rStyIdx])
    }, [rSty, rStyIdx]);

    const disableStyX = useAnimatedStyle(() => {
        if (dStyIdx == 0) return {};
        return { opacity: disbaled_V.value };
    });

    const textView = useCallback(() => <TextXCompo tSty={tSty} {...tProps} >{String(text)}</TextXCompo>, [text, tProps, tSty])
    const loadingView = <ActivityIndicator color={lCol ?? 'white'} size={lSize ?? 'small'} {...lProps} />

    return <Pressable
        onPress={onPress}
        onPressIn={() => { onPressIn(); setOnP(true); }}
        onPressOut={() => { onPressOut(); setOnP(false); }}
        onLongPress={onLongPress}
        hitSlop={hitSlop ?? 5}
        disabled={disabled || loading}
        android_ripple={{ borderless: false, foreground: true, radius: _WIDTH / 2, ...rippleStyX() }}
        style={({ pressed }) => {
            return [{ overflow: 'hidden' }, mSty,];
        }} {...mProps} >
        <Animated.View
            entering={entering}
            exiting={exiting}
            style={[
                pressedStyX,
                pSty({ p: _onP }),
                { flex: 1 },
                defStyFN(defStyObj),
                cSty,
                disableStyX,
            ]} {...cProps} >
            {loading ? loadingView : (children ? children : text !== undefined ? textView() : null)}
            {/* {loading ? loadingView : children ? children : text ? textView : <></>} */}
        </Animated.View>
    </Pressable>
}

export default memo(PressXCompo);