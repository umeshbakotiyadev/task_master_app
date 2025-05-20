import { View, Text, Alert, StyleSheet } from 'react-native'
import React from 'react'
import { defStyObjType, taskListDataType } from '../types';
import { ButtonX, MasterView, TextX } from '../components';
import { useThemeX } from '../hooks';
import { bSpace } from '../utils';
import { _HEIGHT, Size } from '../functions';
import useZuStore from '../store/useZuStore';

const TaskDetailsController = ({ route, navigation }: any) => {

    const _edit = Boolean(route?.params?._edit);
    const _item: taskListDataType = route?.params || {};

    const { setResetTaskListData, taskListData } = useZuStore();
    const { top, col, str, defStyOBJ } = useThemeX();
    const sty = styFN(defStyOBJ);

    async function deleteTask() {
        let temp = { ...taskListData };
        _item?.id && delete temp[_item?.id];
        setResetTaskListData(temp);
        navigation.goBack();
    }

    return (<MasterView title={str?.TASK_DETAILS} style={{ padding: bSpace }} >
        <View style={sty.mC}>
            <TextX text={_item?.title} tSty={sty.titleTSty} />
            {_item?.description && <View style={sty.descriptionCSty} >
                <TextX text={_item?.description} tSty={sty.descriptionTSty} />
            </View>}
        </View>
        <ButtonX
            onPress={() => navigation.navigate("AddEditTaskScr", { _edit: true, _item })}
            text={str.EDITE} transparent
            mSty={{ flex: undefined, marginVertical: bSpace }}
        />
        <ButtonX
            text={str.DELETE}
            mSty={{ flex: undefined }}
            onPress={() => {
                Alert.alert(str.DELETE, str.ARE_YOU_SURE_REMOVE_TASK, [
                    { onPress: deleteTask, style: 'destructive', text: str.DELETE },
                    { style: 'cancel', text: str.CANCEL },
                ])
            }}
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
        minHeight: _HEIGHT * .3
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
        marginTop: 5,
        flex: 1
    },
    descriptionTSty: {
        fontFamily: font.REGULAR,
        fontSize: Size(13),
        color: col.BLACK,
        textTransform: 'capitalize',
    },


});