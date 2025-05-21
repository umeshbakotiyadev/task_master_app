import React, { Fragment, useEffect, useRef, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { AppStack } from '../utils';
import BottomTab from './BottomTab';
import { ToastAlert } from '../components';
import { useDebounce, useMMKVStore } from '../hooks';
import { AddEditTaskScr, OfflineVideosScr, PlayVideoScr, TaskDetailsScr } from '../screens';
import { useNetInfoInstance } from "@react-native-community/netinfo";
import useString from '../language';

const AppRoute = () => {

    const str = useString();
    const { toast, setToast } = useMMKVStore();
    const { refresh, netInfo: { isConnected } } = useNetInfoInstance();
    const isFirst = useRef<boolean>(true);

    /** SHOW/HIDE SPLACE SCREEN */
    const [isSp, setIsSp] = useState<boolean>(true);

    const isDebounce = useDebounce(isConnected, 1000);
    useEffect(() => {
        if (isFirst.current) { isFirst.current = false; return }
        if (!isDebounce) setToast({ show: true, msg: str.YOUR_INTERNET_CONNCTIONS_IS_NOT_CONNECTED })
    }, [isDebounce]);

    return <Fragment>
        <NavigationContainer onStateChange={() => {
            if (!isConnected) setToast({ show: true, msg: str.YOUR_INTERNET_CONNCTIONS_IS_NOT_CONNECTED })
        }} >
            <AppStack.Navigator>
                <AppStack.Screen name={"BottomTab"} component={BottomTab} options={{ headerShown: false }} />
                <AppStack.Screen name={"TaskDetailsScr"} component={TaskDetailsScr} options={{ headerShown: false }} />
                <AppStack.Screen name={"AddEditTaskScr"} component={AddEditTaskScr} options={{ headerShown: false }} />
                <AppStack.Screen name={"OfflineVideosScr"} component={OfflineVideosScr} options={{ headerShown: false }} />
                <AppStack.Screen name={"PlayVideoScr"} component={PlayVideoScr} options={{ headerShown: false }} />
            </AppStack.Navigator>
        </NavigationContainer>
        <ToastAlert {...toast} setToast={setToast} />
    </Fragment>
}

export default AppRoute