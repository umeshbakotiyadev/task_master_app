import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { defStyObjType, taskListDataType } from '../types';
import { useThemeX } from '../hooks';
import { bSpace } from '../utils';
import TextXCompo from './XCompos/TextXCompo';
import { Size } from '../functions';
import PressXCompo from './XCompos/PressXCompo';

const TaskDetailsCardItemCompo = ({ completed, id, title, userId, onPress, description }: taskListDataType & { onPress: () => void }) => {

    const { defStyOBJ } = useThemeX();
    const sty = styFN(defStyOBJ);

    return (
        <PressXCompo
            onPress={onPress}
            cSty={sty.mC} >
            <TextXCompo text={title} tSty={sty.titleTSty} />
            {description && <View style={sty.descriptionCSty} >
                <TextXCompo text={description} tSty={sty.descriptionTSty} />
            </View>}
        </PressXCompo>
    )
}

export default React.memo(TaskDetailsCardItemCompo);

const styFN = ({ col, font }: defStyObjType) => StyleSheet.create({

    mC: {
        padding: bSpace,
        width: "100%",
        backgroundColor: col.WHITE02,
        borderWidth: 1,
        borderRadius: bSpace,
        borderColor: col.BLACK02,
    },
    titleTSty: {
        fontFamily: font.SEMI_BOLD,
        fontSize: Size(15),
        color: col.BLACK,
        textTransform: 'capitalize'
    },
    descriptionCSty: {
        paddingVertical: bSpace / 2,
        paddingHorizontal: bSpace,
        backgroundColor: col.BLACK005,
        borderRadius: bSpace,
        marginTop: 5
    },
    descriptionTSty: {
        fontFamily: font.REGULAR,
        fontSize: Size(13),
        color: col.BLACK,
        textTransform: 'capitalize',
    },

});