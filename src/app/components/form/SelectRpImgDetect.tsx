'use client'

import { RpResult } from "@/models/srmReport"
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { useState } from "react"

interface Props {
    onUpdate: (v: RpResult | string) => void
}

export default function SelectRpResult(props: Props) {

    const [slResult, setSlResult] = useState<string>('ยังไม่เลือก')

    return (
        <>
            <div className="w-full">
                <FormControl className='w-full'>
                    <InputLabel size='small' id="selectLabel">ผลลัพธ์</InputLabel>
                    <Select
                        size="small"
                        value={slResult}
                        onChange={(e) => {
                            setSlResult(e.target.value!)
                            props.onUpdate(e.target.value!)
                        }}
                        labelId="selectLabel"
                        id="selectLabel"
                        label="ผลลัพธ์"
                        className="w-full bg-white"
                    >
                        <MenuItem value={'ยังไม่เลือก'} key={'noSelect'}>
                            ไม่เลือก
                        </MenuItem>
                        <MenuItem value={'สำเร็จ'} key={'Success'}>
                            สำเร็จ
                        </MenuItem>
                        <MenuItem value={'ไม่สำเร็จ'} key={'Failed'}>
                            ไม่สำเร็จ
                        </MenuItem>
                    </Select>
                </FormControl>
            </div>
        </>
    )
}