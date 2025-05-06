'use client'

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import axios from '@/app/config/axiosConfig';
import { useEffect, useState } from "react"
import { BASE_API } from "@/app/(main)/api"
import { Crane } from "@/models/crane"
import { Bank } from "@/models/bank"

interface SelectCraneMenuProps {
    selectSize?: 'small' | 'medium'
    isDisabled?: boolean
    levels: number
    selectLevel: number
    onUpdate: (level: number) => void
}

/**
 * @param selectSize ปรับขนาดของ Select Menu มีค่าเป็น 'small' | 'medium'
 * @param LevelNo จำนวน level ทั้งหมดของ bank นั้นๆ
 * @param onUpdate จะ return level ออกมาให้ parent
 * @returns 
 */
export default function SelectLevelMenu(props: SelectCraneMenuProps) {
    const [levels, setLevels] = useState<Array<number>>([])
    const [selectLevel, setSelectLevel] = useState<number>(0)

    useEffect(() => {
        setSelectLevel(props.selectLevel)
        if (props.levels !== 0) {
            let levelsArray = []
            for (let i = 1; i <= props.levels; i++) {
                levelsArray.push(i)
            }
            if (levelsArray.length === props.levels) {
                setLevels(levelsArray)
            }
        } else if (props.levels === 0) {
            setLevels([])
        }
    }, [props])

    return (
        <>
            <div className="w-full">
                <FormControl className='w-full'>
                    <InputLabel size='small' id="selectLabel">{`ชั้น (${levels.length} lv.)`}</InputLabel>
                    <Select
                        value={selectLevel}
                        onChange={(e) => {
                            setSelectLevel(Number(e.target.value!))
                            props.onUpdate(Number(e.target.value!))
                        }}
                        size={(props.selectSize === 'medium') ? 'medium' : 'small'}
                        labelId="selectLabel"
                        disabled={props.isDisabled}
                        id="selectLabel"
                        label={`ชั้น (${levels.length} lv.)`}
                        className="w-full bg-white"
                    >
                        <MenuItem value={0} key={0}>
                            {(props.levels > 0 && selectLevel === 0) && (<> ยังไม่เลือก </>)}
                            {(props.levels === 0 && selectLevel === 0) && (<> ไม่มี Level ที่ตั้งค่า</>)}
                        </MenuItem>
                        {(levels !== undefined) && (
                            levels.map((lv) => (
                                <MenuItem value={lv} key={lv}>
                                    {lv}
                                </MenuItem>
                            ))
                        )}

                    </Select>
                </FormControl>
            </div>
        </>
    )
}