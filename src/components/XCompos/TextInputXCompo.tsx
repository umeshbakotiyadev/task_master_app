import { StyleSheet, TextInput } from 'react-native'
import React from 'react'
import { useThemeX } from 'hooks';
import { TextInputXType, defStyType } from 'Types';
import { Size, defStyFN } from 'functions';
import ViewXCompo from './ViewXCompo';
import PressXCompo from './PressXCompo';
import TextXCompo from './TextXCompo';
import Animated from 'react-native-reanimated';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

const TextInputXCompo = ({
    onBlur, reff, phNm, text, lines, onChangeT, onSubEdit, rKeyType, kbType,
    autoComplete, autoCorrect, sTxtEntry, multiline, BSInput = false, inputSty = {},
    textContentType, pointerEvents, readOnly, onLayout,
    mSty, onFocus, onPressIn, labelNM, editable,
    lbl_LChild, lbl_RChild, lbl_LSvg, lbl_RSvg, lbl_cSty,
    ip_LSvg, ip_RSvg,
    topSvg, bottomSvg, maxLength,
    lBtn, lBtn_text, lBtn_tSty, lBtn_mSty, lBtn_cSty, lBtnDis, lBtnPress, lBtn_loader,
    rBtn, rBtn_text, rBtn_tSty, rBtn_mSty, rBtn_cSty, rBtnDis, rBtnPress, rBtn_loader,
    inputBox, autoCapitalize = 'none', lBtnNode, rBtnNode, onBoxLayout,
    ...defStyObj
}: TextInputXType) => {

    const { col, font, cpSty } = useThemeX();
    const sty = styFN(useThemeX()?.defStyObj);

    const textSty: any = inputSty;

    return (
        <Animated.View style={[defStyFN(defStyObj), sty.container, defStyObj?.style]} onLayout={onBoxLayout} >
            {topSvg && topSvg}
            <ViewXCompo f={1} fD='row' >

                <ViewXCompo f={1} >

                    {labelNM && <Animated.View style={[sty.lable_Container, lbl_cSty]} >
                        {lbl_LSvg && lbl_LSvg}
                        <TextXCompo
                            text={labelNM}
                            lChild={lbl_LChild}
                            rChild={lbl_RChild}
                            tSty={sty.lable_tSty} />
                        {lbl_RSvg && lbl_RSvg}
                    </Animated.View>}

                    <ViewXCompo style={[sty.mSty, mSty]}>
                        {lBtnNode && lBtnNode}
                        {/* {lBtn && <ViewXCompo children={lBtn} style={sty.lBtn} />} */}
                        {(lBtn || lBtn_text || lBtn_loader) && <PressXCompo
                            children={lBtn}
                            disabled={lBtnDis}
                            onPress={lBtnPress}
                            loading={lBtn_loader}
                            mSty={{ ...sty.lBtn_mSty, ...lBtn_mSty }}
                            cSty={{ ...sty.lBtn_cSty, ...lBtn_cSty }}
                            tSty={lBtn_tSty}
                            text={lBtn_text}
                            pStyIdx={2}
                        />}

                        {readOnly
                            ? (<TextXCompo
                                lines={1} onLayout={onLayout}
                                text={(!text || text?.length === 0) ? phNm : text}
                                tSty={{
                                    ...cpSty.inputSty1,
                                    color: (!text || text?.length === 0) ? col.BLACK02 : cpSty.inputSty1?.color,
                                    ...textSty,
                                }}
                            />)
                            : inputBox ? inputBox : (
                                BSInput
                                    ? (<BottomSheetTextInput
                                        onLayout={onLayout}
                                        ref={reff}
                                        value={text}
                                        onChangeText={onChangeT}
                                        placeholderTextColor={col.BLACK02}
                                        placeholder={phNm}
                                        allowFontScaling={false}
                                        blurOnSubmit={rKeyType === 'done' ? true : false}
                                        numberOfLines={lines}
                                        onSubmitEditing={onSubEdit}
                                        returnKeyType={rKeyType}
                                        onBlur={onBlur}
                                        keyboardType={kbType}
                                        autoCorrect={autoCorrect}
                                        autoCapitalize={autoCapitalize}
                                        autoComplete={autoComplete}
                                        textContentType={textContentType}
                                        onFocus={onFocus}
                                        onPressIn={onPressIn}
                                        secureTextEntry={sTxtEntry}
                                        multiline={multiline}
                                        pointerEvents={pointerEvents}
                                        readOnly={readOnly}
                                        maxLength={maxLength}
                                        style={[
                                            // sty.inputSty,
                                            cpSty.inputSty1,
                                            {
                                                // textAlignVertical: multiline ? 'top' : undefined,
                                                verticalAlign: multiline ? 'top' : undefined,
                                                // textAlignVertical: multiline ? 'bottom' : undefined,
                                                // verticalAlign: multiline ? 'bottom' : undefined,
                                            },
                                            inputSty]}
                                        editable={editable} />)
                                    : (<TextInput
                                        onLayout={onLayout}
                                        ref={reff}
                                        value={text}
                                        onChangeText={onChangeT}
                                        placeholderTextColor={col.BLACK02}
                                        placeholder={phNm}
                                        allowFontScaling={false}
                                        blurOnSubmit={rKeyType === 'done' ? true : false}
                                        numberOfLines={lines}
                                        onSubmitEditing={onSubEdit}
                                        returnKeyType={rKeyType}
                                        onBlur={onBlur}
                                        keyboardType={kbType}
                                        autoCorrect={autoCorrect}
                                        autoCapitalize={autoCapitalize}
                                        autoComplete={autoComplete}
                                        textContentType={textContentType}
                                        onFocus={onFocus}
                                        onPressIn={onPressIn}
                                        secureTextEntry={sTxtEntry}
                                        multiline={multiline}
                                        pointerEvents={pointerEvents}
                                        readOnly={readOnly}
                                        maxLength={maxLength}
                                        style={[
                                            // sty.inputSty,
                                            cpSty.inputSty1,
                                            {
                                                // textAlignVertical: multiline ? 'top' : undefined,
                                                verticalAlign: multiline ? 'top' : undefined,
                                                // textAlignVertical: multiline ? 'bottom' : undefined,
                                                // verticalAlign: multiline ? 'bottom' : undefined,
                                            },
                                            inputSty]}
                                        editable={editable}
                                    />))}
                        {/* {ip_LSvg && <ViewXCompo style={sty.rBtn} >{rBtn}</ViewXCompo>} */}
                        {ip_LSvg && <PressXCompo
                            children={ip_LSvg}
                            disabled={rBtnDis}
                            onPress={rBtnPress}
                            cSty={sty.rBtn_cSty} />}
                        {rBtnNode && rBtnNode}
                    </ViewXCompo>
                </ViewXCompo>
                {(rBtn || rBtn_text || rBtn_loader) && <PressXCompo
                    children={rBtn}
                    disabled={rBtnDis}
                    dStyIdx={0}
                    onPress={rBtnPress}
                    loading={rBtn_loader}
                    mSty={{ ...sty.rBtn_mSty, ...rBtn_mSty }}
                    cSty={{ ...sty.rBtn_cSty, ...rBtn_cSty }}
                    tSty={rBtn_tSty}
                    text={rBtn_text}
                    pStyIdx={2}
                />}
            </ViewXCompo>
            {bottomSvg && bottomSvg}
        </Animated.View>)
}

export default React.memo(TextInputXCompo);

const styFN = ({ col, font }: defStyType) => StyleSheet.create({

    container: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: col.BLACK02,
        paddingHorizontal: 15,
        paddingVertical: 7,
        backgroundColor: col.D_WHITE,
        // paddingTop: 10,
        marginBottom: 10,
        // flexDirection: 'column'
    },
    lable_Container: {
        flexDirection: 'row',
        width: "100%",
        alignItems: 'center'
    },
    lable_tSty: {
        fontFamily: font.REGULAR,
        fontSize: Size(14),
        color: col.PLATINUM_GREY,
        fontWeight: '400',
    },
    inputSty: {
        flex: 1,
        fontSize: Size(18),
        color: col.D_BLACK,
        fontFamily: font.REGULAR,
        // dont increase padding,
        // if you remove then padding is incrase i android
        padding: 0
        // fontWeight: '500',
        // textAlignVertical: 'bottom',
        // verticalAlign: 'bottom',
        // backgroundColor: 'red'
    },

    mSty: {
        width: "100%",
        flexDirection: 'row',
    },

    lBtn: {
        flex: 1,
        marginRight: 10,
        justifyContent: 'center',
        alignContent: 'center',
    },
    rBtn_cSty: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    rBtn_mSty: {
        height: 25,
        aspectRatio: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        marginLeft: 5,
        borderRadius: 100,
        overflow: 'hidden',
    },

    lBtn_mSty: {},
    lBtn_cSty: {
        flex: 1,
        marginRight: 10,
        justifyContent: 'center',
        alignContent: 'center',
    },
});