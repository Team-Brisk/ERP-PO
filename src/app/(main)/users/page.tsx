'use client'

import * as React from 'react';
import { useStoreData } from '@/app/hooks/useStoreData';
import { useEffect } from 'react';
import MuiUserTable from '@/app/components/dataTable/MuiUserTable';

export default function UsersPage() {
    const setPageTitle = useStoreData((state) => state.setPageTitle)

    // data table 
    useEffect(() => {
        setPageTitle('จัดการผู้ใช้งาน')
        document.title = 'จัดการผู้ใช้งาน'
    }, [])

    return (

        <div className="w-full overflow-x-hidden p-4 flex flex-row gap-4">
            <MuiUserTable />
        </div>

    )
}
