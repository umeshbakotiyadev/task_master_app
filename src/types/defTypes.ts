

type zuStandInitStoreType = {
}

type setZuStandInitStoreType = {
    // setProducts: (by: productsDyOBJType) => void;
}

type zuStandStoreOBJType = zuStandInitStoreType & setZuStandInitStoreType;


export type {
    setZuStandInitStoreType, zuStandInitStoreType, zuStandStoreOBJType,
}