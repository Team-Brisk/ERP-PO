import { FormControl, InputLabel, MenuItem, Select, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";
export type TypeOrderSrm = 'Manual' | 'Barcode' | 'NoSelect'
interface Props {
    isClear?: boolean
    onUpdate: (v: TypeOrderSrm) => void
}
export default function OrderTypeSelect(props: Props) {

    const [sl, setSl] = useState<TypeOrderSrm>('NoSelect')
    useEffect(() => {
        if (props.isClear) {
            setSl('NoSelect')
        }
    }, [props.isClear])

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newValue: TypeOrderSrm,
    ) => {
        setSl(newValue);
        props.onUpdate(newValue)
    };

    return (
        <>
            <div className="w-full">
                <FormControl className='w-full'>
                    <InputLabel size='normal' id="selectLabel">ประเภท</InputLabel>
                    <Select
                        size="medium"
                        value={(sl === null) ? 'noSelect' : sl}
                        onChange={(e) => {
                            setSl(e.target.value! as TypeOrderSrm)
                            props.onUpdate(e.target.value! as TypeOrderSrm)
                        }}
                        labelId="selectLabel"
                        id="selectLabel"
                        label="ผลลัพธ์"
                        className="w-full bg-white"
                    >
                        <MenuItem value={'NoSelect'} key={'NoSelect'}>
                            ไม่เลือก
                        </MenuItem>
                        <MenuItem value={'Mannual'} key={'manual'}>
                            แมนนวล
                        </MenuItem>
                        <MenuItem value={'barcode'} key={'barcode'}>
                            บาร์โค้ด
                        </MenuItem>
                    </Select>
                </FormControl>
            </div>
        </>
    );
} 