import { create } from 'zustand'
export const useStore = create((set , get) => ({
    userInfo : undefined ,
    setUserInfo : (data) => set((state) => ({
        ...state , userInfo : data
    }))
}))

