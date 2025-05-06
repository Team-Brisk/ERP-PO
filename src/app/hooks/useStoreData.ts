import { create } from 'zustand'

interface StoreData {
    isDrawerOpen: boolean,
    setDrawer: (v: boolean) => void
    pageTitle: string
    setPageTitle: (v: string) => void
    paginationPage: number
    setPaginationPage: (v: number) => void
    loadingPage: boolean
    setLoadingPage: (v: boolean) => void
    fromPage: string
    setFromPage: (v: string) => void
}

export const useStoreData = create<StoreData>((set) => ({
    isDrawerOpen: true, // layout drawer
    setDrawer: ((v: boolean) => set({ isDrawerOpen: v })),

    pageTitle: '', // page title
    setPageTitle: ((v: string) => set({ pageTitle: v })),

    paginationPage: 25, // pagination page/size
    setPaginationPage: ((v: number) => set({ paginationPage: v })),

    loadingPage: false,
    setLoadingPage: (v: boolean) => set({ loadingPage: v }),
 
    fromPage: '',
    setFromPage: (v: string) => set({ fromPage: v })
}))
