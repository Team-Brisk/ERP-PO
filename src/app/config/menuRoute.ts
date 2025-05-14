import { OverridableComponent } from "@mui/material/OverridableComponent";
import { Credential, Role } from "@/models/users";
import { SvgIconTypeMap } from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import DescriptionIcon from '@mui/icons-material/Description';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import PersonIcon from '@mui/icons-material/Person';
import QrCodeIcon from '@mui/icons-material/QrCode';
import CameraRearIcon from '@mui/icons-material/CameraRear';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';

interface MenuRoute {
    name: string
    name_th: string
    route: string
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string; }
    role: Role
}

export interface TopicRoute {
    name: string
    name_th: string
    menu: Array<MenuRoute>
}



export const menuRoute: Array<TopicRoute> = [
    {
        name: 'User',
        name_th: 'ผู้ใช้งาน',
        menu: [
            {
                name: 'UserDetails',
                name_th: 'บัญชีผู้ใช้งาน',
                route: `/user-details`,
                icon: PersonIcon,
                role: 0
            },
            {
                name: 'Users Management',
                name_th: 'จัดการผู้ใช้งาน',
                route: '/users',
                icon: GroupIcon,
                role: 1
            },
            {
                name: 'dashboards',
                name_th: 'หน้าหลัก',
                route: '/dashboards',
                icon: QrCodeIcon,
                role: '1'
            },
        ]
        
    },
    {
        name: 'SRM',
        name_th: 'เครน',
        menu: [
            {
                name: 'SRM Status',
                name_th: 'ใบสั่งซื้อ',
                route: '/srm-status',
                icon: DescriptionIcon,
                role: '1'
            },
            {
                name: 'order-manual',
                name_th: 'สั่งการเครนแมนนวล',
                route: '/order-manual',
                icon: PrecisionManufacturingIcon,
                role: 0
            },
           
            {
                name: 'order-product-count',
                name_th: 'นับจำนวนสินค้า',
                route: '/order-product-count',
                icon: CenterFocusStrongIcon,
                role: 0
            },
        ]
    },
    // {
    //     name: 'WCS',
    //     name_th: 'ฐานข้อมูลใหญ่',
    //     menu: [
    //         {
    //             name: 'Products Inbound',
    //             name_th: 'รายการสินค้า',
    //             route: '/productsInbound',
    //             icon: PrecisionManufacturingIcon,
    //             role: 0
    //         },
    //         {
    //             name: 'ASRS',
    //             name_th: 'รหัสของเครน',
    //             route: '/asrs',
    //             icon: PrecisionManufacturingIcon,
    //             role: 0
    //         },
    //     ]
    // },
    {
        name: 'Reports',
        name_th: 'รายงาน',
        menu: [
            {
                name: 'Order Reports',
                name_th: 'รายงานการตรวจสอบ',
                route: '/reports',
                icon: DescriptionIcon,
                role: 0
            },
            // {
            //     name: 'Queue Reports',
            //     name_th: 'รายงานสั่งการคิว',
            //     route: '/queue_reports',
            //     icon: DescriptionIcon,
            //     role: 0
            // },
        ]
    },
    {
        name: 'Data-table',
        name_th: 'ข้อมูลสถานะเครื่องจักร',
        menu: [
            {
                name: 'srm-status',
                name_th: 'ข้อมูลสถานะ',
                route: '/machine-data-table',
                icon: StickyNote2Icon,
                role: 0
            },
            // {
            //     name: 'srm-alarm',
            //     name_th: 'ข้อมูลสถานะผิดปกติ',
            //     route: '/machine-data-table',
            //     icon: StickyNote2Icon,
            //     role: 0
            // }
        ]
    },
    {
        name: 'Setting',
        name_th: 'ตั้งค่า',
        menu: [
            {
                name: 'Site Setting',
                name_th: 'ตั้งค่าไซต์งาน',
                route: '/site-configuration',
                icon: SettingsIcon,
                role: 1
            },
        ]
    }
]