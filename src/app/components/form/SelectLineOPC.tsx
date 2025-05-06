'use client'

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import axios from '@/app/config/axiosConfig';
import { useEffect, useState } from "react"
import { BASE_API } from "@/app/(main)/api"
import { Crane } from "@/models/crane"

interface SelectCraneMenuProps {
    selected: string
    selectSize?: 'small' | 'medium'
    onUpdate: (pathOpc: string) => void
}

/**
 * @param selectSize ปรับขนาดของ Select Menu มีค่าเป็น 'small' | 'medium'
 * @param onUpdate จะ return crane id ออกมาให้ parent
 * @returns 
 */
export default function SelectLineOPC(props: SelectCraneMenuProps) {
    const [selectPathOPC, setselectPathOPC] = useState<string>('')
    useEffect(() => {
        setselectPathOPC(props.selected)
    }, [props])

    return (
        <>
            <div className="w-full">
                <FormControl className='w-full'>
                    <InputLabel size='small' id="selectLabel">SRM Resonpnsibility</InputLabel>
                    <Select
                        value={selectPathOPC}
                        onChange={(e) => {
                            setselectPathOPC(e.target.value!)
                            props.onUpdate(e.target.value!)
                        }}
                        size={(props.selectSize === 'medium') ? 'medium' : 'small'}
                        labelId="selectLabel"
                        id="selectLabel"
                        label="SRM Resonpnsibility"
                        className="w-full bg-white"
                    >
                        <MenuItem value={'LINE01-MP'} key={'LINE01-MP'}>
                            LINE01-MP
                        </MenuItem>
                        <MenuItem value={'LINE02-MP'} key={'LINE02-MP'}>
                            LINE02-MP
                        </MenuItem>
                        <MenuItem value={'LINE03-MP'} key={'LINE03-MP'}>
                            LINE03-MP
                        </MenuItem>
                        <MenuItem value={'LINE04-MP'} key={'LINE04-MP'}>
                            LINE04-MP
                        </MenuItem>
                        <MenuItem value={'LINE05-MP'} key={'LINE05-MP'}>
                            LINE05-MP
                        </MenuItem>
                        <MenuItem value={'LINE06-MP'} key={'LINE06-MP'}>
                            LINE06-MP
                        </MenuItem>
                        <MenuItem value={'LINE07-MP'} key={'LINE07-MP'}>
                            LINE07-MP
                        </MenuItem>
                        <MenuItem value={'LINE08-MP'} key={'LINE08-MP'}>
                            LINE08-MP
                        </MenuItem>

                    </Select>
                </FormControl>
            </div>
        </>
    )
}