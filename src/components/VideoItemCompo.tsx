import { View, StyleSheet } from 'react-native'
import React, { useMemo, useState } from 'react'
import VideoXCompo from './XCompos/VideoXCompo'
import { defStyObjType, videoItemType } from '../types'
import { bSpace } from '../utils'
import { download } from 'react-native-compressor';
import ButtonXCompo from './XCompos/ButtonXCompo'
import { useThemeX } from '../hooks'
import useZuStore from '../store/useZuStore'
import { useNavigation } from '@react-navigation/native'
import { regex } from '../functions'

const VideoItemCompo = (item: videoItemType) => {

    const navigation: any = useNavigation();
    const { setVideoListData, videoListData } = useZuStore();
    const { str, col, defStyOBJ, setToast } = useThemeX();
    const sty = styFN(defStyOBJ);

    const [downloadStatus, setDownloadStatus] = useState<boolean | null>(null);
    const [progress, setProgress] = useState<number>(0);

    const isOfflineVideoAvailable = useMemo(() => Boolean(regex.seRMV(videoListData[item?.id ?? ""]?.offlineSourceLink) !== ""), [item, videoListData]);
    const videoURL = useMemo(() => (isOfflineVideoAvailable) ? videoListData[item?.id ?? ""]?.offlineSourceLink : item?.link, [item, isOfflineVideoAvailable, videoListData]);

    if (isOfflineVideoAvailable) console.log("videoURLvideoURL:::", videoURL);

    async function downloadVideo() {
        if (!videoURL || isOfflineVideoAvailable || downloadStatus !== null) return;
        setToast({ show: true, msg: str.DOWNLOADING });
        setDownloadStatus(true);
        await download(videoURL, (progress) => {
            setProgress(progress);
        }).then(async (soruceUrl) => {
            const temp = { ...item };
            temp['offlineSourceLink'] = soruceUrl;
            if (temp?.id) setVideoListData({ [temp?.id]: temp });
        });
    }

    return (
        <View style={sty.mainContainer} >
            <VideoXCompo showDuration
                uri={videoURL} paused resizeMode='cover'
                cSty={{ flex: 1, backgroundColor: col.BLACK }}
            />
            <View style={[StyleSheet.absoluteFill]} >
                <View style={sty.downCSty} >
                    <ButtonXCompo
                        onPress={() => navigation.navigate("PlayVideoScr", { item, offline: isOfflineVideoAvailable })}
                        transparent text={str.PLAY}
                        mSty={sty.btnMSty} cSty={sty.btnCSty}
                    />
                    {(!isOfflineVideoAvailable && !isOfflineVideoAvailable) && <View style={{ width: bSpace / 2 }} />}
                    {(!isOfflineVideoAvailable && !isOfflineVideoAvailable) && <ButtonXCompo
                        onPress={downloadVideo} mSty={sty.btnMSty} cSty={sty.btnCSty}
                        text={String(downloadStatus == null ? str.DOWNLOAD : Math.round(progress * 100))}
                    />}
                </View>
            </View>
        </View>
    )
}

export default React.memo(VideoItemCompo);

const styFN = ({ font, col, bottom }: defStyObjType) => StyleSheet.create({

    mainContainer: {
        height: 200,
        width: "100%",
        borderRadius: bSpace,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: col.BLACK02
    },
    downCSty: {
        bottom: 0, right: 0,
        position: 'absolute',
        width: "100%",
        padding: bSpace / 2,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    btnMSty: {
        height: 40,
        flex: undefined,
    },
    btnCSty: {
        paddingHorizontal: bSpace
    }

});