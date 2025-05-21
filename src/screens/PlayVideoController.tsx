import { View } from 'react-native'
import React, { useMemo } from 'react'
import { videoItemType } from '../types'
import { VideoX } from '../components';
import { useThemeX } from '../hooks';
import useZuStore from '../store/useZuStore';
import { regex } from '../functions';

const PlayVideoController = ({ route }: any) => {

    const item: videoItemType = route?.params?.item || {};
    const { col } = useThemeX();
    const { videoListData } = useZuStore();

    const isOfflineVideoAvailable = useMemo(() => Boolean(regex.seRMV(videoListData[item?.id ?? ""]?.offlineSourceLink) !== ""), [item, videoListData]);
    const videoURL = useMemo(() => (isOfflineVideoAvailable) ? videoListData[item?.id ?? ""]?.offlineSourceLink : item?.link, [item, isOfflineVideoAvailable, videoListData]);

    return (
        <View>
            <VideoX
                uri={videoURL}
                controls
                resizeMode='contain'
                fullscreenOrientation='landscape'
                cSty={{ width: "100%", height: "100%", backgroundColor: col.BLACK }}
            />
        </View>
    )
}

export default PlayVideoController