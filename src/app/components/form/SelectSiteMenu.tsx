'use client'

import axios from '@/app/config/axiosConfig';
import { useEffect, useState } from 'react'
import { BASE_API } from "@/app/(main)/api"
import { Site } from '@/models/site';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { SelectLoaderDot } from './SelectLoaderDot';

interface SelectSiteMenuProps {
    selectSize?: 'small' | 'medium'
    companyId: number
    isClear?: boolean
    isDeleteStatusOn?: boolean
    isDisabled?: boolean
    onUpdate: (siteId: number) => void
}

/**
 * @param selectSize ปรับขนาดของ Select Menu มีค่าเป็น 'small' | 'medium'
 * @param userId รับ UserId มาเพื่อ Filter Site ของ user นั้นๆ
 * @param onUpdate จะ return site id ออกมาให้ parent
 * @param isDeleteStatusOff สำหรับการเปลี่ยน path api เพื่อดึงเฉพาะ site ที่ยังไม่ถูกลบ
 * @returns 
 */
export default function SelectSiteMenu(props: SelectSiteMenuProps) {

    const [siteData, setSiteData] = useState<Array<Site>>([])
    const [selectSite, setSelectSite] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        getSiteSelect()
    }, [])

    useEffect(() => {
        if (props.isClear === true) {
            setSelectSite(0)
            // props.isClear = false
        }
    }, [props.isClear])

    const getSiteSelect = async () => {
        try {
            setIsLoading(true)
            let apiPath = '/get_site_report'
            if (props.isDeleteStatusOn === true) {
                apiPath = '/get_site_operation'
            }
            const res = await axios.post(`${BASE_API}${apiPath}`, { companyId: props.companyId })
            if (res.status === 200) {
                setSiteData(res.data.siteData)
            } else {
                throw new Error('Unknow Error Occured !!')
            }
            setIsLoading(false)
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <>
            <div className='w-full'>
                <FormControl className='w-full'>
                    <InputLabel size='small' id='selectLabel'>Site</InputLabel>
                    <Select
                        value={selectSite}
                        onChange={(e) => {
                            setSelectSite(Number(e.target.value!))
                            props.onUpdate(Number(e.target.value!))
                        }}
                        size={(props.selectSize === 'medium') ? 'medium' : 'small'}
                        labelId='selectLabel'
                        id='selectLabel'
                        label='Site'
                        disabled={props.isDisabled}
                        className='w-full bg-white'
                    >
                        {isLoading
                            ? [<MenuItem value={0} key={0}><SelectLoaderDot /></MenuItem>]
                            : [
                                <MenuItem value={0} key={0}>No Select</MenuItem>,
                                ...siteData.map((site) => (
                                    <MenuItem value={site.site_id} key={site.site_id}>
                                        <p className={site.delete_status ? 'text-red-500' : 'text-black'}>
                                            {site.site_name}
                                        </p>
                                    </MenuItem>
                                ))
                            ]
                        }

                    </Select>
                </FormControl>
            </div>
        </>
    )
}