import { View, StyleSheet, Image, } from 'react-native'
import React, { memo, useMemo, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { defStyType, HeaderType } from 'Types';
import PressXCompo from './PressXCompo';
import StatusBarXCompo from './StatusBarXCompo';
import TextXCompo from './TextXCompo';
import { Size } from 'functions';
import { bSpace, headerHeight } from 'utils';
import { useThemeX } from 'hooks';
import ViewXCompo from './ViewXCompo';
import { BACK_IC } from 'assets/svgs';
import { APP_LOGO_IMG } from 'assets';

/**
 * Custom Header Component
 */
const HeaderXCompo = ({
    title, bPress, backBtn = true, lSvg, rSvg, tSty, hHeight, hBgColor,
    alignText = 'center', lHeight, rHeight, hShow, hMSty, hBtnColor,
    barStyle = 'light-content', sbColor, sbShow, sbTransition, appIcon,
    titleCompo,
}: HeaderType) => {

    const navigation = useNavigation();
    const sty = styleFN(useThemeX().defStyObj);
    const { col, cpSty } = useThemeX();

    const [lH, setLH] = useState<number>(lHeight ?? 0);
    const [rH, setRH] = useState<number>(rHeight ?? 0);

    const lM = useMemo((): number => {
        if (alignText === 'center') {
            if (rH > lH) return rH - lH;
        }
        return 0;
    }, [lH, rH]);
    const rM = useMemo((): number => {
        if (alignText === 'center') {
            if (lH > rH) return lH - rH;
            return 0;
        }
        return 0;
    }, [lH, rH]);
    // var { x, y, width, height } = event.nativeEvent.layout;

    return (
        <ViewXCompo style={hMSty} >
            <StatusBarXCompo barStyle={barStyle} sbColor={sbColor ?? col.HEADER_BG} sbShow={sbShow} sbTransition={sbTransition} />
            {hShow && (<View style={[sty.mainSty, {
                backgroundColor: hBgColor ?? col.HEADER_BG, height: hHeight ?? headerHeight, width: "100%"
            }]}>
                <View onLayout={(event) => { setLH(event.nativeEvent.layout.width) }} style={{ justifyContent: 'center', }} >
                    {backBtn && (<PressXCompo
                        cSty={cpSty.headerBtn_cSty}
                        mSty={cpSty.headerBtn_mSty}
                        children={<BACK_IC color={hBtnColor} />}
                        onPress={bPress ? bPress : () => navigation.goBack()}
                    />)}
                    {lSvg}</View>
                <View style={[sty.textView, { marginLeft: lM, marginRight: rM, alignItems: alignText, }]} >
                    {appIcon && <Image
                        source={APP_LOGO_IMG}
                        style={{ height: "100%", aspectRatio: 1, }}
                        resizeMode='contain' />}
                    {titleCompo ? titleCompo : (title ? <TextXCompo tSty={{ ...tSty, ...cpSty.header_title_tSty }} >{title ?? ""}</TextXCompo> : "")}
                </View>
                <View onLayout={(event) => { setRH(event.nativeEvent.layout.width) }}>{rSvg}</View>
            </View>)}
        </ViewXCompo>)
}

export default memo(HeaderXCompo);

const styleFN = ({ col, font }: defStyType) => StyleSheet.create({
    mainSty: {
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: bSpace / 2,
        alignItems: 'center',
    },
    textView: {
        flex: 1,
        justifyContent: 'center',
    },
})