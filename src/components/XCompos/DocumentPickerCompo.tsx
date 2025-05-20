import React, { useEffect, useState } from 'react'
import { defStyType, DocumentPickerType } from 'Types';
import * as ImagePicker from 'react-native-image-crop-picker';
import { Keyboard, Modal, Platform, StyleSheet } from 'react-native';
import { CAMERA_IMGPICK_IC, GALLARY_IMGPICK_IC } from 'assets';
import { _HEIGHT, _WIDTH, bSpace } from 'utils';
import { usePermission, useThemeX } from 'hooks';
import PressXCompo from './PressXCompo';
import ViewXCompo from './ViewXCompo';

const DocumentPickerCompo = ({
    mediaType = 'photo', mSty, cSty, setAlert = () => { }, children, setDocObj = () => { },
    height = 500, width = 500, cropping, cropperCircleOverlay, quantity = 0.8, multiple = false,
    selectVia = 'bottomSheetType', pStyIdx, disableCHILD, checkDENIED, checkLIMITED, checkUNAVAILABLE, freeStyleCropEnabled
}: DocumentPickerType) => {

    const sty = styFN(useThemeX().defStyObj);
    const [open, setOpen] = useState(false);

    const { sRequest } = usePermission({ setAlert });

    const pickDocument = async () => {
        setOpen(false);
        const wait = new Promise((resolve, reject) => { setTimeout(() => resolve(true), 700) });
        wait.then(async () => {
            if (await sRequest({ i: 'ios.permission.PHOTO_LIBRARY', a: 'android.permission.READ_MEDIA_IMAGES', checkDENIED, checkLIMITED, checkUNAVAILABLE })) {
                ImagePicker.openPicker({
                    // width, height,
                    cropping, multiple,
                    mediaType: mediaType,
                    cropperCircleOverlay,
                    freeStyleCropEnabled,
                    compressImageQuality: quantity,
                }).then(onSelectDocument).catch((e) => {
                    console.log("E_PICKER_CANCELLED::", e);
                    setOpen(false);
                })
            }
        });
    }

    const openCamera = async () => {
        setOpen(false);
        const wait = new Promise((resolve, reject) => { setTimeout(() => resolve(true), 700) });
        wait.then(async () => {
            if (await sRequest({ i: 'ios.permission.CAMERA', a: 'android.permission.CAMERA', checkDENIED, checkLIMITED, checkUNAVAILABLE })) {
                await ImagePicker.openCamera({
                    width, height,
                    cropping, multiple,
                    mediaType: mediaType,
                    cropperCircleOverlay,
                    freeStyleCropEnabled,
                    compressImageQuality: quantity,
                }).then(onSelectDocument).catch((e) => {
                    console.log("E_PICKER_CANCELLED::", e);
                    setOpen(false);
                });
            }
            setOpen(false);
        });
    }

    function onSelectDocument(document: ImagePicker.Image) {
        console.log("onSelectDocument::", mediaType, Platform.OS, JSON.stringify(document, null, 2));
        // let uri = ""
        // if (Platform.OS === 'android') uri = document.path;
        // // if (Platform.OS === 'android') uri = document?.path?.includes('file:///') ? document.path.replace('file:///', 'file://') : "";
        // else document.path;
        if (!multiple) {
            setDocObj({
                "src": document?.path || "", cropRect: document?.cropRect,
                "obj": {
                    "uri": document.path || "",  /** for document location */
                    "type": document?.mime || 'image/jpeg',
                    "name": document?.path?.split('/')?.pop() || 'document.png',
                },
            });
        }
    }

    const onPressed = async () => {
        if (selectVia === 'bottomSheetType') setOpen(true);
        else if (selectVia === 'directToCamera') openCamera();
        else if (selectVia === 'directToGallery') pickDocument();
        else pickDocument();
    }

    useEffect(() => { open && Keyboard.dismiss() }, [open]);
    useEffect(() => { () => ImagePicker.clean(); }, []);

    return (<>
        <PressXCompo onPress={() => { onPressed(); }}
            mSty={mSty} cSty={cSty} children={children}
            pStyIdx={pStyIdx} disabled={disableCHILD} />
        <Modal visible={open} onRequestClose={() => setOpen(false)}
            transparent statusBarTranslucent animationType='fade'
            style={{ backgroundColor:/*  _COL.TRANSPARENT */ 'red', }} >
            <PressXCompo mSty={{ flex: 1, }} cSty={sty.container} pStyIdx={0} onPress={() => { setOpen(false) }} >
                <ViewXCompo style={sty.containerView} >
                    <PressXCompo onPress={openCamera}
                        mSty={sty.btnMSty} cSty={sty.btnCSty} >
                        <CAMERA_IMGPICK_IC style={sty.svgSty} />
                    </PressXCompo>
                    <PressXCompo onPress={pickDocument}
                        mSty={sty.btnMSty} cSty={sty.btnCSty} >
                        <GALLARY_IMGPICK_IC style={sty.svgSty} />
                    </PressXCompo>
                </ViewXCompo>
            </PressXCompo>
        </Modal >
    </>)
}

export default DocumentPickerCompo

const styFN = ({ col, bottom, }: defStyType) => StyleSheet.create({

    container: {
        backgroundColor: col.BLACK05,
        flex: 1,
        justifyContent: 'flex-end',
    },
    containerView: {
        overflow: 'hidden',
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        backgroundColor: col.WHITE,
        flexDirection: 'row',
        width: "100%",
        height: 135,
        paddingBottom: bottom,
        paddingHorizontal: bSpace / 2
    },
    svgSty: {
        height: "70%",
        width: "70%",
    },
    btnMSty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnCSty: {
        flex: undefined,
        padding: 20,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: col.BLACK005,
    },


})