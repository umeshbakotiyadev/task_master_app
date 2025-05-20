import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { colorType, defStyObjType, } from "../types";
import { FONT } from "../assets";
import useString from "../language";
import { useMemo } from "react";
import { _COL } from "../colors";
import { CompoStyFN, HeaderStyFN } from "../styles";

const useThemeXSty = () => {

    const str = useString();
    const sAI: EdgeInsets = useSafeAreaInsets();

    const col: colorType = useMemo((): any => (_COL), [_COL]);
    const font = useMemo(() => FONT, [FONT]);

    const defStyOBJ: defStyObjType = useMemo(() => ({
        col, font, ...sAI
    }), [col, font, sAI]);

    // const compSty = compStyleFunc(defStyOBJ);
    const hdSty = HeaderStyFN(defStyOBJ);
    const cpSty = CompoStyFN(defStyOBJ);

    return {
        ...sAI, col, str, font, defStyOBJ,
        hdSty, cpSty
    };
};

export default useThemeXSty;