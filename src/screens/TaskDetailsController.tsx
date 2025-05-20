import { View, Text, Alert, StyleSheet } from 'react-native'
import React from 'react'
import { defStyObjType, taskListDataType } from '../types';
import { ButtonX, MasterView, TextX } from '../components';
import { useThemeX } from '../hooks';
import { bSpace } from '../utils';
import { Size } from '../functions';
import PressXCompo from '../components/XCompos/PressXCompo';

const TaskDetailsController = ({ route, navigation }: any) => {

    const _edit = Boolean(route?.params?._edit);
    const { completed, description, id, title, userId }: taskListDataType = route?.params || {};

    const { top, col, str, defStyOBJ } = useThemeX();
    const sty = styFN(defStyOBJ);

    return (<MasterView title={str?.TASK_DETAILS} style={{ padding: bSpace }} >
        <View style={sty.mC}>
            <TextX text={title} tSty={sty.titleTSty} />
            {description && <View style={sty.descriptionCSty} >
                <TextX text={description} tSty={sty.descriptionTSty} />
            </View>}
        </View>
        <ButtonX
            text={str.EDITE} transparent
            mSty={{ flex: undefined, marginVertical: bSpace }}
        />
        <ButtonX
            text={str.DELETE}
            mSty={{ flex: undefined }}
        />
    </MasterView>);
}

export default TaskDetailsController

const styFN = ({ font, col, bottom }: defStyObjType) => StyleSheet.create({

    mC: {
        padding: bSpace,
        width: "100%",
        backgroundColor: col.WHITE02,
        borderWidth: 1,
        borderRadius: bSpace,
        borderColor: col.BLACK02,
        minHeight: 100
    },
    titleTSty: {
        fontFamily: font.BOLD,
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
        fontFamily: font.BOLD,
        fontSize: Size(18),
        color: col.BLACK,
        textTransform: 'capitalize',
    },


});