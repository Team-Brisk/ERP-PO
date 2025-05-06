'use client'

import { useStoreData } from "@/app/hooks/useStoreData";
import { Divider, styled, Theme } from "@mui/material";
import MuiDrawer from '@mui/material/Drawer';
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import AppMenu from "./AppMenu";
import Image from "next/image";
import { CSSObject } from "@emotion/react";

interface Props { }
const drawerWidth = 240;
const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

export const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
        {
            props: ({ open }) => open,
            style: {
                ...openedMixin(theme),
                '& .MuiDrawer-paper': openedMixin(theme),
            },
        },
        {
            props: ({ open }) => !open,
            style: {
                ...closedMixin(theme),
                '& .MuiDrawer-paper': closedMixin(theme),
            },
        },
    ],
}));

export default function AppSideBar() {

    // hook
    const isDrawerOpen = useStoreData((state) => state.isDrawerOpen);
    const setLoadingPage = useStoreData((state) => state.setLoadingPage)

    // router
    const pathName = usePathname()

    useEffect(() => {
        setLoadingPage(false)
    }, [pathName])

    return (
        <Drawer variant='permanent' open={isDrawerOpen}>
            <DrawerHeader className='shadow-md flex justify-between'>
                <Image
                    src="/logo/logo.svg"
                    width={500}
                    height={48}
                    alt="AMW Logo"
                />
            </DrawerHeader>
            <Divider />
            <AppMenu />
        </Drawer>
    );
}