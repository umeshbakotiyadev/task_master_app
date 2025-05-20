import { defStyFN } from 'functions';
import React, { memo } from 'react'
import Animated from 'react-native-reanimated';
import { ViewXType } from 'Types';

const ViewXCompo = (props: ViewXType) => {
    const { style, entering, exiting, children, onPress } = props;
    return (
        <Animated.View style={[defStyFN(props), style]}
            entering={entering}
            exiting={exiting}
        >{children}</Animated.View>
    )
}

export default memo(ViewXCompo);