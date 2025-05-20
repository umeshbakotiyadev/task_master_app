import { View, Text, Alert } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ButtonX, MasterView, UserDetailesCardItem } from '../../components'
import { FlatList } from 'react-native-gesture-handler'
import { useAPIs, useThemeX } from '../../hooks'
import { userDataType } from '../../types'
import { makeUserDataForLocalStoreFN, pLOG } from '../../functions'
import useZuStore from '../../store/useZuStore'
import { bSpace, btnHeight } from '../../utils'

const ListAllTaskController = () => {

    const { top, col, str } = useThemeX();
    const { getUserDetailsAPI } = useAPIs();
    const { setUsersData, usersData } = useZuStore();

    const [topLoading, setTopLoading] = useState<boolean>(false);
    const [bottomLoading, setBottomLoading] = useState<boolean>(false);
    const [scrLoading, setScrLoading] = useState<boolean>(true);
    const [abLoader, setABLoader] = useState<boolean>(false);
    const [status, setStatus] = useState<boolean | null>(null);

    const usersDataArr = useMemo((): Array<userDataType> => {
        return Object.values(usersData).filter((item) => status == null ? item : (item?.completed === status));
    }, [usersData, status]);

    const flatListRef = useRef<FlatList<any>>(null);
    const hasNextPageRef = useRef<boolean>(true);

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
                setUsersData(makeUserDataForLocalStoreFN(res));
            }
            setBottomLoading(false); setTopLoading(false); setScrLoading(false);
        }).finally(() => {
            setBottomLoading(false); setTopLoading(false); setScrLoading(false);
        });
    }

    const renderItem = useCallback(({ item, index }:
        { item: userDataType, index: number }) => <UserDetailesCardItem
            {...item} />, [usersDataArr]);

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
    </MasterView>)
}

export default ListAllTaskController