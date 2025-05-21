import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zuStandStoreOBJType } from '../types';
import { zuStandStoreOBJ } from '../utils';
import zuStandStorage from './zustandStorage';

/**
* Local Storage,
* Store All Required Data On device Storage
**/
const useZuStore = create<zuStandStoreOBJType>()(
    persist((set) => ({
        ...zuStandStoreOBJ,
        setTaskListData: by => set((state) => ({ taskListData: { ...state?.taskListData, ...by } })),
        setResetTaskListData: by => set((state) => ({ taskListData: by })),
        setVideoListData: by => set((state) => ({ videoListData: { ...state?.videoListData, ...by } })),
    }), {
        "name": '@AppForStore',
        "storage": createJSONStorage(() => zuStandStorage),
        partialize: (state) => <zuStandStoreOBJType>({
            ...state,
            videoListData: {}
        }),
        onRehydrateStorage: (_/* state */) => {
            return async (state, error) => {
                if (error) { console.log('zustandError:: an error happened during hydration', error); }
                // await RNBootSplash.hide({ fade: true, duration: 500 });
                // console.log('hydration finished, BootSplash has been hidden successfully');
            };
        }
    })
);

export default useZuStore;