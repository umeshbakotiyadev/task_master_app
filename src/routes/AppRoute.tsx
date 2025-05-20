import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { AppStack } from '../utils';
import BottomTab from './BottomTab';

const AppRoute = () => {

    /** SHOW/HIDE SPLACE SCREEN */
    const [isSp, setIsSp] = useState<boolean>(true);

    return <NavigationContainer>
        <AppStack.Navigator>
            <AppStack.Screen name={"BottomTab"} component={BottomTab} options={{ headerShown: false }} />
        </AppStack.Navigator>
    </NavigationContainer>
}

export default AppRoute