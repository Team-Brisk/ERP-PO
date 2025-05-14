import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from 'next/navigation'
import { useStoreData } from "@/app/hooks/useStoreData";
import { Credential, Role, Users } from "@/models/users";
import { menuRoute, TopicRoute } from "../../config/menuRoute";
import Fade from '@mui/material/Fade';

interface AppMenuProps {
    isPageLoading?: (e: boolean) => void
}

export default function AppMenu(props: AppMenuProps) {
    const isDrawerOpen = useStoreData((state) => state.isDrawerOpen)
    const setLoadingPage = useStoreData((state) => state.setLoadingPage)
    const fromPage = useStoreData((state) => state.fromPage)
    const setFromPage = useStoreData((state) => state.setFromPage)

    const [role, setRole] = useState<Role | null>(null)
    const [userId, setUserId] = useState<number>()
    const [crrEmpId, setCrrEmpId] = useState<string>()
    const currentPath = usePathname()
    const [pathChecker, setPathChecker] = useState()
    const router = useRouter();

    useEffect(() => {
        const credential = JSON.parse(localStorage.getItem('Credential')!) as Credential
        if (!credential) {
            router.push('/login');
            return;
        }
        const role = credential.userData.role
        // const crrEmpId = credential.userData.employee_id
        setCrrEmpId(crrEmpId)
        setRole(role)
    }, [])

    const getEmpId = async () => {
        const credential = JSON.parse(localStorage.getItem('Credential')!) as Credential
        // console.log(credential.userData.employee_id);
        return credential.userData.user_id
    }


    const routePage = async (path: string) => {
        let userId = await getEmpId()
        setUserId(userId)

        if (path !== currentPath) {
            if (!currentPath.startsWith(`/user-details/${userId}`)) {
                setLoadingPage(true)
            }
        }

        if (path === '/user-details') {
            path = path + '/' + userId
        }
        setFromPage('')
        router.push(path);
    };

    const isActive = (menu: Array<TopicRoute>) => {
        // return menu.route === currentPath
        //     || (currentPath.includes('/userDetail')
        //         && menu.route.includes('/userDetail'))
        //     || currentPath.includes(menu.route)
    }


    return (
        
            <div className="flex flex-col">
                {
                    menuRoute.map(topic => (
                        <div key={topic.name} className='text-gray-700'>
                            <Divider></Divider>
                            <List >
                                {topic.menu
                                    .filter(menu => menu.role === role)
                                    .map((menu, index) => (
                                        <ListItem
                                            key={menu.name}
                                            className={`${(isDrawerOpen) && 'px-3'}  transition-all duration-200`}
                                            disablePadding sx={{ display: 'block' }}
                                        >
                                            {
                                                (isDrawerOpen) ? (
                                                    
                                                        <ListItemButton
                                                            selected={
                                                                (menu.route === currentPath
                                                                    || (currentPath.includes('/userDetail') && menu.route.includes('/userDetail'))
                                                                    || currentPath.includes(menu.route))
                                                                && fromPage === ''
                                                            }
                                                            className={`${(isDrawerOpen) && 'rounded-lg'}`}
                                                            onClick={() => { routePage(menu.route) }}
                                                        >
                                                            <ListItemIcon>
                                                                {React.createElement(menu.icon, { color: 'inherit' })}
                                                            </ListItemIcon>
                                                            <ListItemText className={`${(isDrawerOpen) ? '-ml-4' : '-ml-0'} transition-all duration-200 text-sm`}>
                                                                {menu.name_th}
                                                            </ListItemText>
                                                        </ListItemButton>
                                                    
                                                ) : (
                                                    
                                                        <Tooltip
                                                            arrow
                                                            title={menu.name_th}
                                                            placement="right"
                                                            slots={{ transition: Fade, }}
                                                        >
                                                            <ListItemButton
                                                                selected={
                                                                    menu.route === currentPath
                                                                    || (currentPath.includes('/userDetail')
                                                                        && menu.route.includes('/userDetail'))
                                                                    || currentPath.includes(menu.route)
                                                                }
                                                                className={`${(isDrawerOpen) && 'rounded-lg'}`}
                                                                onClick={() => { routePage(menu.route) }}
                                                            >
                                                                <ListItemIcon>
                                                                    {React.createElement(menu.icon, { color: 'inherit' })}
                                                                </ListItemIcon>
                                                                <ListItemText className={`${(isDrawerOpen) ? '-ml-4' : '-ml-0'} transition-all duration-200 text-sm`}>
                                                                    {menu.name_th}
                                                                </ListItemText>
                                                            </ListItemButton>
                                                        </Tooltip>
                                                    
                                                )
                                            }

                                        </ListItem>
                                    ))}
                            </List>
                        </div>
                    ))
                }
            </div>
        

    );
}