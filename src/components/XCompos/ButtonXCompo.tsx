import React, { memo } from 'react'
import { PressXType } from 'Types'
import { useThemeX } from 'hooks'
import { Size } from 'functions'
import PressXCompo from './PressXCompo'
import { BtnHeight } from 'utils'

/**
 * Custom Button Component
 */
const ButtonXCompo = (porps: PressXType & { transparent?: boolean }) => {
    const { transparent } = porps;
    const { col, font } = useThemeX();
    return (<PressXCompo
        h={BtnHeight}
        f={1}
        bR={10}
        pStyIdx={1}
        jfy='center'
        aItem='center'
        bCol={col.PRIMARY}
        bgCol={transparent ? col?.TRANSPARENT : col.PRIMARY}
        {...porps}
        tSty={{
            color: transparent ? col.WHITE : col.WHITE,
            fontFamily: font.BOLD,
            textTransform: 'uppercase',
            fontSize: Size(20),
            ...porps?.tSty
        }}
        cSty={{ borderWidth: 1 }}
        // mSty={{ height: 56, ...porps?.mSty }}
        mSty={{ height: porps?.h || BtnHeight, ...porps?.mSty }}
    />)
}

export default memo(ButtonXCompo)