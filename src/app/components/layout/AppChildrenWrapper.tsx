'use client';

import { Box, LinearProgress } from "@mui/material";
import { DrawerHeader } from "./AppSidebar";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import AppLoading from "./AppLoading";
import { useStoreData } from "@/app/hooks/useStoreData";

const LazyLoadChildren = dynamic(() => import('../layout/DynamicChildren'), {
    loading: () => <AppLoading></AppLoading>,
    ssr: false,
});

export default function AppChildrenWrapper({ children }: { children: React.ReactNode }) {
    const pathName = usePathname();

    const loadingPage = useStoreData((state) => state.loadingPage)
    return (
        <Box component='main' sx={{ flexGrow: 1 }}>
            <DrawerHeader />
            <LinearProgress color='primary'
                className={`${loadingPage ? 'visible' : 'invisible'} mt-[1.4px]`}
            />
            <LazyLoadChildren
                key={pathName}>
                {children}
            </LazyLoadChildren>
        </Box>
    );
}