import { ImageBackground, ImageSourcePropType, ActivityIndicator, } from 'react-native'
import React, { useState } from 'react'
import FastImage, { ResizeMode, Source } from 'react-native-fast-image'
import Animated from 'react-native-reanimated';
import { isUrl } from 'functions';
import { ViewXType } from 'Types';
import ViewXCompo from './ViewXCompo';
import { useThemeX } from 'hooks';

interface P {
    source?: Source;
    defImgSrc?: ImageSourcePropType;
    defImgUri?: string;
    uri?: string | undefined;
    isLoader?: boolean;
    resizeMode?: ResizeMode;
}

//! NOTE : padding not allowed in style,
const ImageXCompo = ({ source = undefined, uri, defImgSrc, defImgUri, resizeMode = 'cover', isLoader = false, ...defStyObj }: P & ViewXType) => {

    const { col } = useThemeX();

    const [isLoading, setIsLoading] = useState<boolean>(true);

    return (
        <ViewXCompo {...defStyObj} oFlow='hidden'>
            {(defImgSrc || defImgUri) ? (<ImageBackground
                source={defImgUri ? { uri: defImgUri } : defImgSrc ?? { uri: "" }}
                resizeMode='contain' >
                <FastImage
                    source={source ? source : { uri: isUrl(uri ?? "") ? uri : "" }}
                    onLoadEnd={() => { isLoader && setIsLoading(false) }}
                    onError={() => { isLoader && setIsLoading(false) }}
                    style={{ height: "100%", width: "100%" }}
                    resizeMode={resizeMode}
                />
                {(isLoader && isLoading) &&
                    <Animated.View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', height: "100%", width: "100%" }}>
                        <ActivityIndicator size={'small'} color={col.PRIMARY} />
                    </Animated.View>
                }
            </ImageBackground>)
                : (<>
                    <FastImage
                        source={source ? source : { uri: isUrl(uri ?? "") ? uri : "" }}
                        onLoadEnd={() => { isLoader && setIsLoading(false) }}
                        onError={() => { isLoader && setIsLoading(false) }}
                        style={{ height: "100%", width: "100%" }}
                        resizeMode={resizeMode}
                    />
                    {(isLoader && isLoading) && (<Animated.View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', height: "100%", width: "100%" }}>
                        <ActivityIndicator size={'small'} color={col.PRIMARY} />
                    </Animated.View>)}
                </>)}
        </ViewXCompo>)
}

export default ImageXCompo