'use client'

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import axios from '@/app/config/axiosConfig';
import { useEffect, useState } from "react"
import { BASE_API } from "@/app/(main)/api"
import { Crane } from "@/models/crane"
import { SelectLoaderDot } from "./SelectLoaderDot";
import { errorMessage } from "@/utils/messageAlert";
import { Credential } from "@/models/users";
import { useRouter } from "next/navigation";

export interface SelectCraneEmit { craneId: number, pathOpc?: string, idWcs?: number | string }

interface SelectCraneMenuProps {
    selectSize?: 'small' | 'medium'
    siteId: number
    isDeleteStatusOn?: boolean
    isDisabled?: boolean
    isSrmp?: boolean
    isAutoSelected?: boolean
    onUpdate: (data: SelectCraneEmit) => void
}

/**
 * @param selectSize ปรับขนาดของ Select Menu มีค่าเป็น 'small' | 'medium'
 * @param siteId รับ siteId มาเพื่อ Filter Crane ของ site นั้นๆ
 * @param onUpdate จะ return crane id ออกมาให้ parent
 * @param isDeleteStatusOff สำหรับการเปลี่ยน path api เพื่อดึงเฉพาะ crane ที่ยังไม่ถูกลบ
 * @returns 
 */
export default function SelectCraneMenu(props: SelectCraneMenuProps) {

    const router = useRouter()

    const [craneData, setCraneData] = useState<Array<Crane>>([])
    const [selectCrane, setSelectCrane] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [credential, setCredential] = useState<Credential | null>(null)
    const [srmResp, setSrmResp] = useState<String>('') // Node OPC eg. LINE01-MP , LINE02-MP

    useEffect(() => {
        if (props.isSrmp === true) {
            const credential = JSON.parse(localStorage.getItem('Credential')!) as Credential
            if (!credential) {
                router.push('/login');
                return;
            } else {
                getSrmResp(credential.userData.user_id)
            }
        } else {
            getCrane()
        }
        setSelectCrane(0)
    }, [props.siteId])

    // ตรวจสอบผู้ใช้งานกับตัวเครนที่จะใช้
    const getSrmResp = async (userId: number) => {
        try {
            const res = await axios.post(`${BASE_API}/get_srm_resp`, { userId: userId })
            if (res.status === 200) {
                setSrmResp(res.data.srm_resp)
            } else {
                throw new Error('Error Occured!')
            }
        } catch (err: any) {
            errorMessage({ message: err })
        }
    }

    useEffect(() => {
        if (srmResp !== '') {
            getCrane()
        }
    }, [srmResp])

    useEffect(() => {
        if (props.isAutoSelected && craneData.length >= 1) {
            let firstDataId = craneData[0].crane_id
            let firstPath = craneData[0].path_opc
            setSelectCrane(Number(firstDataId))
            onUpdate(Number(firstDataId))
        }
    }, [craneData])

    const getCrane = async () => {
        try {
            setIsLoading(true)
            let apiPath = '/get_crane_by_site'
            if (props.isDeleteStatusOn === true) {
                apiPath = '/get_crane_operation'
            }
            const res = await axios.post(`${BASE_API}${apiPath}`, { siteId: props.siteId })
            if (res.status === 200) {
                if (srmResp !== '') {
                    const srmArr = res.data.craneData as Array<Crane>
                    const newSrmArr = srmArr.filter((v) => { return v.path_opc === srmResp })
                    setCraneData(newSrmArr)
                    setSrmResp('')
                } else {
                    setCraneData(res.data.craneData)
                }
            } else {
                throw new Error('Unknow Error Occured !!')
            }
            setIsLoading(false)
        } catch (err) {
            console.log(err);
        }
    }

    const onUpdate = (id: any) => {
        const index = craneData.findIndex((c) => {
            return c.crane_id === id
        })
        // กรณีใช้กับการสั่งการ crane จำเป็นต้อง return path OPC ออกไปเพื่อใช้สั่งการ
        if (index !== -1) {
            const pathOpc = craneData[index].path_opc
            const idWcs = craneData[index].id_wcs
            props.onUpdate({
                craneId: id,
                pathOpc: pathOpc,
                idWcs: idWcs
            })

            // กรณีใช้กับการ filter report path OPC ไม่จำเป็น
        } else {
            props.onUpdate({
                craneId: id,
                pathOpc: 'Unfound',
                idWcs: 'Unfound'
            })
        }
    }

    async function filterSrmNode() {
        return
    }

    return (
        <>
            <div className="w-full">
                <FormControl className='w-full'>
                    <InputLabel size='small' id="selectLabel">เครน</InputLabel>
                    <Select
                        value={selectCrane}
                        onChange={(e) => {
                            setSelectCrane(Number(e.target.value!))
                            console.log(e.target.value!);
                            onUpdate(e.target.value!)
                        }}
                        size={(props.selectSize === 'medium') ? 'medium' : 'small'}
                        labelId="selectLabel"
                        id="selectLabel"
                        label="เครน"
                        className="w-full bg-white"
                        // readOnly={props.isAutoSelected}
                        disabled={props.siteId === 0 || props.isDisabled}
                    >
                        {
                            isLoading
                                ? [<MenuItem value={0} key={0}> <SelectLoaderDot /> </MenuItem>]
                                : [<MenuItem value={0} key={0}> <span className="text-sm text-gray-600 font-extralight">ยังไม่เลือก</span></MenuItem>,
                                ...craneData.map((c) => (
                                    <MenuItem value={c.crane_id} key={c.crane_id}>
                                        <span className={`${(c.delete_status === true) ? 'text-red-500' : 'text-black'}`}>
                                            {c.crane_name}
                                        </span>
                                    </MenuItem>
                                ))]
                        }
                    </Select>
                </FormControl>
            </div>
        </>
    )
}