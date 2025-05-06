'use client'

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import axios from '@/app/config/axiosConfig';
import { useEffect, useState } from "react"
import { BASE_API } from "@/app/(main)/api"
import { Crane } from "@/models/crane"
import { Bank } from "@/models/bank"

interface SelectCraneMenuProps {
    selectSize?: 'small' | 'medium'
    craneId: number
    isDisabled?: boolean
    isClear?: boolean
    onUpdate: (craneId: number) => void
    onMaxBay: (maxBay: number) => void
    onLevel: (levels: number) => void
}

interface BankOrder extends Bank {
    camera_active: 0 | 1
}

/**
 * @param selectSize ปรับขนาดของ Select Menu มีค่าเป็น 'small' | 'medium'
 * @param craneId รับ craneId มาเพื่อ Filter Bank ของ Crane นั้นๆ
 * @param onUpdate จะ return crane id ออกมาให้ parent
 * @param onMaxBay คืนค่าสูงสุดของ max bay ที่เลือก 
 * @returns 
 */
export default function SelectBankMenu(props: SelectCraneMenuProps) {
    const [bankData, setBankData] = useState<Array<BankOrder>>([])
    const [selectBank, setSelectBank] = useState<number>(0)

    useEffect(() => {
        getCrane()
        setSelectBank(0)
    }, [props.craneId])

    useEffect(() => {
        if (props.isClear === true) {
            setSelectBank(0)
            // props.isClear = false
        }
    }, [props.isClear])

    const getCrane = async () => {
        try {
            const res = await axios.post(`${BASE_API}/get_bank_operation`, { craneId: props.craneId })

            if (res.status === 200) {
                // console.log(res.data.bankData);
                setBankData(res.data.bankData)
            } else {
                throw new Error('Unknow Error Occured !!')
            }
        } catch (err) {
            console.log(err);
        }
    }

    const getMaxBay = (bank: number): void => {
        const index = bankData.findIndex((b) => b.bank === bank)
        if (index !== -1) {
            const maxBay = bankData[index].bay
            const levels = bankData[index].level
            if (maxBay) {
                props.onMaxBay(maxBay)
                props.onLevel(levels)
            }
        }
    }



    return (
        <>
            <div className="w-full">
                <FormControl className='w-full'>
                    <InputLabel size='small' id="selectLabel">แบงค์</InputLabel>
                    <Select
                        value={selectBank}
                        onChange={(e) => {
                            setSelectBank(Number(e.target.value!))
                            props.onUpdate(Number(e.target.value!))
                            getMaxBay(Number(e.target.value!))
                        }}
                        size={(props.selectSize === 'medium') ? 'medium' : 'small'}
                        labelId="selectLabel"
                        id="selectLabel"
                        label="แบงค์"
                        className="w-full bg-white"
                        disabled={props.craneId === 0 || props.isDisabled}
                    >
                        <MenuItem value={0} key={0}>
                            {(bankData.length > 0) ? (<>ยังไม่เลือก</>) : (<>ไม่มี Bank ให้เลือก</>)}
                        </MenuItem>
                        {(bankData !== undefined) && (
                            bankData.map((bank) => (
                                <MenuItem value={bank.bank} key={bank.bank_id} disabled={bank.camera_active === 0 || bank.camera_active === null }>
                                    {(bank.bank % 2 === 0) ? (
                                        <>
                                            {(bank.camera_active === 0 || bank.camera_active === null) ? (
                                                <span className="">
                                                    {bank.bank} (กล้องไม่พร้อม)
                                                </span>
                                            ) : (
                                                <span className="">
                                                    {bank.bank} (กล้องพร้อม)
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {(bank.camera_active === 0 || bank.camera_active === null ) ? (
                                                <span className="">
                                                    {bank.bank} (กล้องไม่พร้อม)
                                                </span>
                                            ) : (
                                                <span className="">
                                                    {bank.bank} (กล้องพร้อม)
                                                </span>
                                            )}
                                        </>
                                    )}
                                </MenuItem>
                            ))
                        )
                        }
                    </Select>
                </FormControl>
            </div>
        </>
    )
}