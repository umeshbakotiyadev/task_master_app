import { Keyboard } from 'react-native'
import React, { memo, useCallback } from 'react'
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet'
import { BottomSheetXType } from 'types';

const BottomSheetXCompo = ({ handleIndicatorStyle, android_keyboardInputMode, onClose,
    keyboardBehavior, handleComponent, mSty, bgSty, bRef, children, snapPoints = ["100%"],
    enablePanDownToClose = true, index = -1, modal, style, enableDynamicSizing, maxDynamicContentSize }: BottomSheetXType) => {

    // renders
    const renderBackdrop = useCallback((props: any) => <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
    />, []);

    return <BottomSheet
        ref={bRef}
        index={index}
        $modal={modal}
        enablePanDownToClose={enablePanDownToClose}
        onChange={() => { Keyboard.dismiss(); }}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        handleComponent={handleComponent}
        keyboardBehavior={keyboardBehavior}
        onClose={onClose}
        android_keyboardInputMode={android_keyboardInputMode}
        backgroundStyle={bgSty}
        handleIndicatorStyle={handleIndicatorStyle}
        style={style}
        enableDynamicSizing={enableDynamicSizing}
        maxDynamicContentSize={maxDynamicContentSize}
    >
        <BottomSheetView style={[{ flex: 1 }, mSty]}>
            {children}
        </BottomSheetView>
    </BottomSheet>
}

export default memo(BottomSheetXCompo);