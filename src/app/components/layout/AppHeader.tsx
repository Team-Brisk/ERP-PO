'use client';

import { useStoreData } from "@/app/hooks/useStoreData";
import { AppBar as AppbarH, Box, styled, Toolbar } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ThemeBtn from '@/app/components/button/ThemBtn';
import LogoutBtn from '@/app/components/button/LogoutBtn';
import FullScreenBtn from '@/app/components/button/FullScreenBtn';

interface Props { }

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}
const drawerWidth = 240;
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

export default function AppHeader(props: Props) {
    const isDrawerOpen = useStoreData((state) => state.isDrawerOpen);
    const setIsDrawerOpen = useStoreData((state) => state.setDrawer);
    const pageTitle = useStoreData((state) => state.pageTitle);
    const loadingPage = useStoreData((state) => state.loadingPage)
    const setLoadingPage = useStoreData((state) => state.setLoadingPage)

    return (
        <AppBar color='inherit' position='fixed' open={isDrawerOpen} >
            <Toolbar className='flex flex-row justify-between items-center w-full'>
                <div className='flex-1 flex items-center justify-start'>
                    <div className='-ml-4 mr-2 cursor-pointer' onClick={() => { setIsDrawerOpen(!isDrawerOpen) }}>
                        <IconButton color='default' className={`duration-300 transition-all`}>
                            <MenuIcon fontSize={'large'} />
                        </IconButton>
                    </div>
                    <div className={`duration-300 transition-all`}>
                        <span className='text-xl font-extralight text-gray-600'>
                            {pageTitle}
                        </span>
                    </div>
                </div>
                <div className='flex-1 flex justify-end items-center gap-2'>
                    <ThemeBtn></ThemeBtn>
                    <FullScreenBtn></FullScreenBtn>
                    <LogoutBtn></LogoutBtn>
                </div>
            </Toolbar>
        </AppBar>
    );
}