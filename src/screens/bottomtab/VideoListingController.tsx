import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAPIs, useThemeX } from '../../hooks';
import useZuStore from '../../store/useZuStore';
import { defStyObjType, videoItemType } from '../../types';
import { MasterView, PressX, TextX, VideoItem, VideoX } from '../../components';
import { bSpace } from '../../utils';
import { Size } from '../../functions';

const VideoListingController = ({ navigation }: any) => {

    const { getVideoListAPI } = useAPIs();
    const { setTaskListData, taskListData, videoListData } = useZuStore();
    const { top, col, str, defStyOBJ, cpSty, setToast } = useThemeX();
    const sty = styFN(defStyOBJ);

    const [topLoading, setTopLoading] = useState<boolean>(true);
    const [bottomLoading, setBottomLoading] = useState<boolean>(false);
    const [videosData, setVideosData] = useState<Array<videoItemType>>([]);

    const hasNextPageRef = useRef<boolean>(true);

    async function getVideoList({ topRefresh = false, bottomRefresh = false }
        : { topRefresh?: boolean, bottomRefresh?: boolean; }) {

        if (bottomRefresh) setBottomLoading(true);
        if (topRefresh) {
            hasNextPageRef.current = true;
            setTopLoading(true);
        }
        if (!hasNextPageRef.current) return;

        getVideoListAPI().then(({ res }) => {
            hasNextPageRef.current = !!(res?.next);
            const vData = res?.videos[0]?.video_files;
            if (Array.isArray(vData)) setVideosData(vData);
            else setToast({ show: true, msg: str.SOMETHING_ITS_WRONG });
            setBottomLoading(false); setTopLoading(false);
        }).catch(() => {
            setToast({ show: true, msg: str.SOMETHING_ITS_WRONG_PLZ_TRY_AGAIN });
            setBottomLoading(false); setTopLoading(false);
        });
    }

    const renderItem = useCallback(({ item, index }:
        { item: videoItemType, index: number }) => <VideoItem
            {...item}
        />, [videosData]);

    useEffect(() => {
        getVideoList({ bottomRefresh: true });
    }, []);

    return (<MasterView fixed hShow={false} >
        <FlatList
            data={videosData}
            renderItem={renderItem}
            contentContainerStyle={{ padding: bSpace }}
            keyExtractor={(_, index) => String(index)}
            ItemSeparatorComponent={() => <View style={{ height: bSpace / 2 }} />}
            ListHeaderComponent={<>
                {Object.values(videoListData).length > 0 && <PressX
                    onPress={() => navigation.navigate("OfflineVideosScr")}
                    text={str.OFFLINE_VIDEOS}
                    cSty={sty.offlineVideoCSty}
                    tSty={sty.offlineVideoTSty}
                    mSty={{ marginBottom: bSpace / 2 }}
                />}
            </>}
            refreshControl={<RefreshControl
                colors={[col.PRIMARY, col.PRIMARY, col.PRIMARY]}
                tintColor={col.PRIMARY}
                progressBackgroundColor={col.SECONDARY}
                refreshing={topLoading}
                onRefresh={() => getVideoList({ topRefresh: true })}
            />}
            ListEmptyComponent={() => {
                if (topLoading) return;
                return <View style={cpSty.emptyListMSG_cSty} >
                    <TextX text={str.RECORDS_NOT_FOUND} tSty={cpSty.emptyListMSG_tSty} />
                </View>
            }}
        />
    </MasterView>)
}

export default VideoListingController

const styFN = ({ font, col, bottom }: defStyObjType) => StyleSheet.create({

    offlineVideoCSty: {
        paddingVertical: bSpace,
        width: "100%",
        backgroundColor: col.PRIMARY,
        paddingHorizontal: bSpace,
        borderRadius: bSpace,
    },
    offlineVideoTSty: {
        fontFamily: font.SEMI_BOLD,
        fontSize: Size(15),
        color: col.WHITE
    }

});