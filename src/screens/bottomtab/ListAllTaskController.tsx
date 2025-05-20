import { View, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ButtonX, MasterView, PressX, TaskDetailsCardItem } from '../../components'
import { FlatList } from 'react-native-gesture-handler'
import { useAPIs, useThemeX } from '../../hooks'
import { defStyObjType, taskListDataType } from '../../types'
import { makeTaskListDataForLocalStoreFN, pLOG } from '../../functions'
import useZuStore from '../../store/useZuStore'
import { bSpace, btnHeight } from '../../utils'
import { PLUSH_IC } from '../../assets'

const ListAllTaskController = ({ navigation }: any) => {

    const { getUserDetailsAPI } = useAPIs();
    const { setTaskListData, taskListData } = useZuStore();
    const { top, col, str, defStyOBJ } = useThemeX();
    const sty = styFN(defStyOBJ);

    const [topLoading, setTopLoading] = useState<boolean>(false);
    const [bottomLoading, setBottomLoading] = useState<boolean>(false);
    const [scrLoading, setScrLoading] = useState<boolean>(true);
    const [abLoader, setABLoader] = useState<boolean>(false);
    const [status, setStatus] = useState<boolean | null>(null);

    const hasNextPageRef = useRef<boolean>(true);

    const usersDataArr = useMemo((): Array<taskListDataType> => {
        return Object.values(taskListData).filter((item) => status == null ? item : (item?.completed === status));
    }, [taskListData, status]);


    async function getUserDetails({ topRefresh = false, bottomRefresh = false }
        : { topRefresh?: boolean, bottomRefresh?: boolean; }) {

        if (bottomRefresh) setBottomLoading(true);
        if (topRefresh) {
            hasNextPageRef.current = true;
            setTopLoading(true);
        }
        if (!hasNextPageRef.current) return;

        getUserDetailsAPI().then(({ res }) => {
            hasNextPageRef.current = !!(res?.next);
            if (Array.isArray(res)) {
                setTaskListData(makeTaskListDataForLocalStoreFN(res));
            }
            setBottomLoading(false); setTopLoading(false); setScrLoading(false);
        }).finally(() => {
            setBottomLoading(false); setTopLoading(false); setScrLoading(false);
        });
    }

    const renderItem = useCallback(({ item, index }:
        { item: taskListDataType, index: number }) => <TaskDetailsCardItem
            {...item}
            description="kafjkdshfjlkas"
            onPress={() => navigation.navigate("TaskDetailsScr", item)}
        />, [usersDataArr]);

    useEffect(() => {
        getUserDetails({ topRefresh: true });
    }, []);

    return (<MasterView fixed header={<></>} >
        <FlatList
            data={usersDataArr}
            ListHeaderComponent={<>
                <View style={{ height: top, backgroundColor: col.TRANSPARENT }} />
                <View style={{ flexDirection: 'row', height: 20 + btnHeight, paddingBottom: 10 }} >
                    <ButtonX
                        text={str.ALL}
                        onPress={() => { setStatus(null); }}
                        cSty={{
                            backgroundColor: status === null ? col.BTN_BGCOL : col.TRANSPARENT,
                            borderWidth: undefined,
                        }}
                        tSty={{ color: status === null ? col.BTN_TEXT_COL : col.BLACK }} />
                    <ButtonX
                        text={str.COMPLETED}
                        onPress={() => { setStatus(true); }}
                        cSty={{
                            backgroundColor: status === true ? col.BTN_BGCOL : col.TRANSPARENT,
                            borderWidth: undefined,
                        }}
                        tSty={{ color: status === true ? col.BTN_TEXT_COL : col.BLACK }} />
                    <ButtonX
                        text={str.INCOMPLETED}
                        onPress={() => { setStatus(false); }}
                        cSty={{
                            backgroundColor: status === false ? col.BTN_BGCOL : col.TRANSPARENT,
                            borderWidth: undefined,
                        }}
                        tSty={{ color: status === false ? col.BTN_TEXT_COL : col.BLACK }} />

                </View>
            </>
            }
            contentContainerStyle={{ padding: bSpace }}
            ItemSeparatorComponent={() => <View style={{ height: bSpace / 2 }} />}
            keyExtractor={(_, index) => String(index)}
            renderItem={renderItem}
        />
        <PressX
            onPress={() => navigation.navigate("AddFriendScr")}
            children={<PLUSH_IC color={col.WHITE} />}
            mSty={sty.addExpenseBtn_mSty}
            cSty={sty.addExpenseBtn_cSty} />
    </MasterView>)
}

export default ListAllTaskController

const styFN = ({ font, col, bottom }: defStyObjType) => StyleSheet.create({
    addExpenseBtn_mSty: {
        flex: undefined,
        marginVertical: bSpace / 2,
        marginHorizontal: bSpace,
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
    addExpenseBtn_cSty: {
        padding: 8,
        backgroundColor: col.PRIMARY,
        borderRadius: 10
    },

});