import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { defStyObjType, userDataType } from '../types';
import { useThemeX } from '../hooks';
import { bSpace } from '../utils';
import TextXCompo from './XCompos/TextXCompo';
import { Size } from '../functions';

const UserDetailesCardItemCompo = ({ completed, id, title, userId }: userDataType) => {

    const { defStyOBJ } = useThemeX();
    const sty = styFN(defStyOBJ);

    return (
        <View style={sty.mC} >
            <TextXCompo
                text={title}
            />
        </View>
    )
}

export default React.memo(UserDetailesCardItemCompo);

const styFN = ({ col, font }: defStyObjType) => StyleSheet.create({

    mC: {
        padding: bSpace,
        width: "100%",
        backgroundColor: col.WHITE02,
        borderWidth: 3,
        borderRadius: bSpace,
        borderColor: col.BLACK02,
        minHeight: 100
    },
    tSty: {
        fontFamily: font.BOLD,
        fontSize: Size(30),
    },

});