'use client'

import * as React from 'react';
import { useStoreData } from '@/app/hooks/useStoreData';
import { useEffect } from 'react';

import OrderPage from '@/app/components/DataTable/OrderPage';

export default function UsersPage() {
    const setPageTitle = useStoreData((state) => state.setPageTitle)

    // data table 
    useEffect(() => {
        setPageTitle('Purchase Order')
        document.title = 'Purchase Order'
    }, [])

    return (

        <div className="w-full overflow-x-hidden p-4 flex flex-row gap-4">
            <OrderPage />
        </div>

    )
}
