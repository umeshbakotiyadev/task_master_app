import React, { Fragment, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { AppStack } from '../utils';
import BottomTab from './BottomTab';
import { ToastAlert } from '../components';
import { useMMKVStore } from '../hooks';
import { View } from 'react-native';
import { TaskDetailsScr } from '../screens';

const AppRoute = () => {

    const { toast, setToast } = useMMKVStore();

    /** SHOW/HIDE SPLACE SCREEN */
    const [isSp, setIsSp] = useState<boolean>(true);

    return <Fragment>
        <NavigationContainer>
            <AppStack.Navigator>
                <AppStack.Screen name={"BottomTab"} component={BottomTab} options={{ headerShown: false }} />
                <AppStack.Screen name={"TaskDetailsScr"} component={TaskDetailsScr} options={{ headerShown: false }} />
            </AppStack.Navigator>
        </NavigationContainer>
        <ToastAlert {...toast} setToast={setToast} />
    </Fragment>
}

export default AppRoute