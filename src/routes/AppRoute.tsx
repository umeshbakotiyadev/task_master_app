import {
    AccountCreateScr, ChatRoomScr, CreateBroadcastScr, GalleryScr, EditProfileScr, FirstTimeProfileSetup2Scr,
    FirstTimeProfileSetupScr, HiddenSearchResultsScr, InviteFriendsScr, MakeChatGroupScr, OTPVerificationScr,
    OrderHistoryScr, PhoneNumberVerificationScr, PrivacySettingsScr, SearchResultsScr, SignInScr, SplaceScr,
    SubscriptionScr, SuggestionsScr, UserProfileScr, ViewBroadcastScr, ViewOwnBroadcastScr, WebViewScr,
    CreatePostScr, FollowersFollowingScr, PostCommentsScr, FullScrVideoPostScr, ManageMyPostsScr, SearchScr,
    NotificationScr, HasTagPostsScr, SinglePostDetailScr, PurchaseProductScr, ProductDetailsScr,
    OrderConfirmedScr, ManagePaymentsScr, LikesCountsScr,
    WelcomeToMoment1Scr,
    WelcomeToMoment2Scr,
} from 'screens'
import React, { Fragment, useRef, useState, } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { Stack } from 'utils'
import useAppStore from 'store'
import NativeDrawer from './NativeDrawer'
import { useAppInitCall, useCrashlytics, useForceUpdate, useGetStream, useThemeX } from 'hooks'
import { Chat, MessageActionListItem, OverlayProvider, } from 'stream-chat-react-native'
import MessageController from 'screens/MessageController'
import { AlertBox2 } from 'components'
import { LOG } from 'functions'

const AppRoute = () => {

    const { str } = useThemeX();
    const { chatClient } = useGetStream();
    const { _setCrashLog } = useCrashlytics();
    const { isAppUpdateRequired, updateNowApp } = useForceUpdate();
    const { bottom, top, getStreamSty, } = useThemeX();
    const { isLogin, isVerifySignIn, currentLocation, unReadMessageCount } = useAppStore();
    const store = useAppStore();

    /** show or hide splace screen */
    const [isSp, setIsSp] = useState<boolean>(true);

    const routeNameRef = useRef<string>("");
    const navigationRef = useRef<any>(null);

    useAppInitCall();

    // LOG(store.userData, "userData::");
    // console.log("store::", JSON.stringify(store, null, 1));
    // console.log("currentLocation::", JSON.stringify(currentLocation, null, 5));
    // console.log("currentLocation::", JSON.stringify(store.currentLocation, null, 5));
    // console.log("BASE_API::", JSON.stringify(BASE_API, null, 5));
    // console.log("unReadMessageCount::", Platform.OS, JSON.stringify(unReadMessageCount, null, 5));
    // useInAppPurchase();

    return (
        <OverlayProvider bottomInset={bottom} topInset={top}
            MessageActionListItem={(props) => {
                if (props?.actionType === 'pinMessage') return <></>;
                return <MessageActionListItem {...props} />;
            }}>
            <Chat style={getStreamSty} client={chatClient}>
                <Fragment>
                    {isSp && <SplaceScr onAnimationEnd={() => setIsSp(false)} />}
                    <NavigationContainer
                        ref={navigationRef}
                        onReady={() => {
                            routeNameRef.current = navigationRef?.current?.getCurrentRoute()?.name;
                        }}
                        onStateChange={async () => {
                            const previousRouteName = routeNameRef?.current;
                            const currentRouteName = navigationRef?.current?.getCurrentRoute()?.name;
                            if (previousRouteName !== currentRouteName) { _setCrashLog(currentRouteName); }
                            routeNameRef.current = currentRouteName;
                        }} >
                        {!isLogin
                            ? (!isVerifySignIn
                                ? (<Stack.Navigator
                                    screenOptions={{ headerShown: false, animation: 'slide_from_right' }} >
                                    <Stack.Screen name='SignInScr' component={SignInScr} />
                                    <Stack.Screen name='AccountCreateScr' component={AccountCreateScr} />
                                    <Stack.Screen name='PhoneNumberVerificationScr' component={PhoneNumberVerificationScr} />
                                    <Stack.Screen name='OTPVerificationScr' component={OTPVerificationScr} />
                                    <Stack.Screen name='WebViewScr' component={WebViewScr} />
                                </Stack.Navigator>)
                                : (<Stack.Navigator
                                    screenOptions={{ headerShown: false, animation: 'slide_from_right' }} >
                                    <Stack.Screen name='FirstTimeProfileSetupScr' component={FirstTimeProfileSetupScr} />
                                    <Stack.Screen name='FirstTimeProfileSetup2Scr' component={FirstTimeProfileSetup2Scr} />
                                    <Stack.Screen name='WebViewScr' component={WebViewScr} />
                                </Stack.Navigator>))
                            : (<Stack.Navigator
                                // initialRouteName='WelcomeToMoment1Scr'
                                screenOptions={{ headerShown: false, animation: 'slide_from_right' }} >
                                <Stack.Screen name='NativeDrawer' component={NativeDrawer} />
                                <Stack.Screen name='SearchScr' component={SearchScr} />
                                <Stack.Screen name='SearchResultsScr' component={SearchResultsScr} />
                                <Stack.Screen name='UserProfileScr' component={UserProfileScr} />
                                <Stack.Screen name='CreateBroadcastScr' component={CreateBroadcastScr} />
                                <Stack.Screen name='EditProfileScr' component={EditProfileScr} />
                                <Stack.Screen name='SubscriptionScr' component={SubscriptionScr} />
                                <Stack.Screen name='HiddenSearchResultsScr' component={HiddenSearchResultsScr} />
                                <Stack.Screen name='InviteFriendsScr' component={InviteFriendsScr} />
                                <Stack.Screen name='ViewBroadcastScr' component={ViewBroadcastScr} />
                                <Stack.Screen name='ViewOwnBroadcastScr' component={ViewOwnBroadcastScr} options={{ animation: 'fade_from_bottom' }} />
                                <Stack.Screen name='ChatRoomScr' component={ChatRoomScr} />
                                <Stack.Screen name='MessageScr' component={MessageController} />
                                <Stack.Screen name='MakeChatGroupScr' component={MakeChatGroupScr} />
                                <Stack.Screen name='PrivacySettingsScr' component={PrivacySettingsScr} />
                                <Stack.Screen name='OrderHistoryScr' component={OrderHistoryScr} />
                                <Stack.Screen name='SuggestionsScr' component={SuggestionsScr} />
                                <Stack.Screen name='GalleryScr' component={GalleryScr} options={{ animation: 'fade_from_bottom' }} />
                                <Stack.Screen name='CreatePostScr' component={CreatePostScr} />
                                <Stack.Screen name='FollowersFollowingScr' component={FollowersFollowingScr} />
                                <Stack.Screen name='PostCommentsScr' component={PostCommentsScr} options={{ animation: 'slide_from_bottom', presentation: 'transparentModal' }} />
                                <Stack.Screen name='FullScrVideoPostScr' component={FullScrVideoPostScr} options={{ animation: 'slide_from_bottom', }} />
                                <Stack.Screen name='ManageMyPosts' component={ManageMyPostsScr} />
                                <Stack.Screen name='NotificationScr' component={NotificationScr} />
                                <Stack.Screen name='HasTagPostsScr' component={HasTagPostsScr} />
                                <Stack.Screen name='SinglePostDetailScr' component={SinglePostDetailScr} />
                                <Stack.Screen name='ProductDetailsScr' component={ProductDetailsScr} />
                                <Stack.Screen name='PurchaseProductScr' component={PurchaseProductScr} />
                                <Stack.Screen name='OrderConfirmedScr' component={OrderConfirmedScr} />
                                <Stack.Screen name='ManagePaymentsScr' component={ManagePaymentsScr} />
                                <Stack.Screen name='LikesCountsScr' component={LikesCountsScr} />
                                <Stack.Screen name='WebViewScr' component={WebViewScr} />
                                <Stack.Screen name='WelcomeToMoment1Scr' component={WelcomeToMoment1Scr}
                                    options={{ animation: 'fade', presentation: 'transparentModal' }} />
                                <Stack.Screen name='WelcomeToMoment2Scr' component={WelcomeToMoment2Scr}
                                    options={{ animation: 'fade', presentation: 'transparentModal' }} />
                            </Stack.Navigator>)}
                    </NavigationContainer>
                    <AlertBox2
                        show={isAppUpdateRequired && !isSp}
                        title={str.NEW_UPDATE_NOW_AVAILABLE}
                        btnName={str.UPDATE_APP}
                        description={str.NEW_UPDATE_NOW_AVAILABLE_MSG}
                        onPress={updateNowApp} onClose={() => { }}
                    />
                </Fragment>
            </Chat>
        </OverlayProvider>)
}

export default AppRoute