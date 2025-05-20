import { StatusBar, SafeAreaView } from 'react-native'
import React, { Fragment, memo } from 'react'
import { useThemeX } from 'hooks';
import { StatusBarType } from 'Types';

const StatusBarXCompo = ({ sbShow = true, sbColor, barStyle = 'light-content', sbTransition }: StatusBarType) => {
    const { top, col } = useThemeX();
    return (
        <Fragment>
            <StatusBar
                animated
                translucent={true} // ANDROID::: when its true then us can use top Insets value, if false then u can not use its value. 
                barStyle={barStyle}
                backgroundColor={col.TRANSPARENT}
                showHideTransition={sbTransition ?? 'fade'} />
            {sbShow && <SafeAreaView style={{ height: top, backgroundColor: sbColor ?? col.TRANSPARENT, zIndex: 10 }} />}
        </Fragment>
    )
}

export default memo(StatusBarXCompo)