import { StyleSheet, TextInput, View } from 'react-native'
import React, { useRef, useState } from 'react'
import useZuStore from '../store/useZuStore';
import { useThemeX } from '../hooks';
import { defStyObjType, taskListDataType } from '../types';
import { bSpace } from '../utils';
import { ButtonX, MasterView, SwitchX, TextInputX, TextX } from '../components';
import { _HEIGHT, generateUniqueID, regex, Size } from '../functions';
import DatePicker from 'react-native-date-picker';

const AddEditTaskController = ({ route, navigation }: any) => {

    const _edit = Boolean(route?.params?._edit);
    const _item: taskListDataType = route?.params?._item || {};

    const { setResetTaskListData, taskListData } = useZuStore();
    const { top, col, str, defStyOBJ, setToast, font } = useThemeX();
    const sty = styFN(defStyOBJ);

    const [taskTitle, setTaskTitle] = useState<string>(_item?.title || "");
    const [desc, setDesc] = useState<string>(_item?.description || "");
    const [slDateMdl, setSlDateMdl] = useState<boolean>(false); // store selected birthday date
    const [dueDate, setDueDate] = useState<Date | null>(_item?.dueDate ? new Date(_item?.dueDate) : null); // store birthday date
    const [completed, setCompleted] = useState<boolean>(_item?.completed || false);

    const descRef = useRef<TextInput>(null);

    async function saveTaskDetails() {
        const temp = { ...taskListData };
        let itM: taskListDataType = {};
        if (regex.seRMV(taskTitle) == "") { setToast({ show: true, msg: str.TASK_TITLE_REQUIRED }); return; }
        if (!dueDate) { setToast({ show: true, msg: str.DUE_DATE_REQUIRED }); return; }
        if (_edit) {
            if (_item?.id) itM = temp[_item?.id];
            itM['title'] = taskTitle;
            itM['description'] = desc;
            itM['completed'] = completed;
            if (dueDate) itM['dueDate'] = dueDate;
            if (_item?.id) temp[_item?.id] = itM;
        } else {
            const tempID = generateUniqueID();
            temp[tempID] = {
                userId: 1, id: tempID,
                title: taskTitle, description: desc,
                dueDate: dueDate ? dueDate : new Date(),
                completed: completed,
            }
        }
        setResetTaskListData(temp);
        navigation.goBack();
    }

    return (<MasterView title={_edit ? str.UPDATE_TASK : str?.CREATE_NEW_TASK}
        style={{ padding: bSpace }}
        modals={<>
            <DatePicker
                modal
                mode='date'
                open={slDateMdl}
                date={dueDate ? dueDate : new Date()}
                onCancel={() => { setSlDateMdl(false); }}
                onConfirm={(date: Date) => {
                    setDueDate(date);
                    setSlDateMdl(false);
                }}
            /></>}>
        <TextInputX
            phNm={str.TASK_TITLE}
            text={taskTitle}
            onChangeT={setTaskTitle}
            kbType='default'
            rKeyType='next'
            onSubEdit={() => descRef.current?.focus()}
        />
        <TextInputX
            reff={descRef}
            phNm={str.DESCRIPTION}
            text={desc}
            onChangeT={setDesc}
            kbType='default'
            rKeyType='default'
            mSty={{ maxHeight: undefined, height: undefined }}
            inputSty={{ height: _HEIGHT * .3 }}
            multiline
        />
        <TextInputX
            readOnly
            onPressIn={() => { setSlDateMdl(true); }}
            phNm={str.DUE_DATE}
            text={dueDate?.toLocaleDateString()}
        />
        <View style={{
            flexDirection: 'row',
            marginBottom: bSpace / 2,
            justifyContent: 'space-between',
        }} >
            <TextX
                text={str.COMPLETED}
                fFamily={font.MEDIUM}
                fSize={Size(15)} />
            <SwitchX
                value={completed} size={30}
                onValueChange={() => setCompleted(!completed)}
                bgCol={[col.WHITE, col.PRIMARY]}
                col={[col.PRIMARY, col.WHITE]} />
        </View>
        <ButtonX
            text={str.SAVE}
            mSty={{ flex: undefined }}
            onPress={saveTaskDetails}
        />
    </MasterView>)
}

export default AddEditTaskController

const styFN = ({ font, col, bottom }: defStyObjType) => StyleSheet.create({

});