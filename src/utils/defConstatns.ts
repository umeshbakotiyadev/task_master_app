import { setZuStandInitStoreType, zuStandInitStoreType, zuStandStoreOBJType } from "../types";

const zuStandInitStore: zuStandInitStoreType = {

};

const setZuStandInitStore: setZuStandInitStoreType = {
    // setProducts(by) { },
}

const zuStandStoreOBJ: zuStandStoreOBJType = { ...zuStandInitStore, ...setZuStandInitStore };

export { zuStandInitStore, setZuStandInitStore, zuStandStoreOBJ }