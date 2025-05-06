'use client'
import { Bank } from "@/models/bank"
import { Button, TextField } from "@mui/material"
import { useState } from "react"
import CancelIcon from '@mui/icons-material/Cancel';
import MsgAlert from "@/utils/sweetAlert";
import axios from '@/app/config/axiosConfig';
import { BASE_API } from "../../api";
import { errorMessage, successMessage } from "@/utils/messageAlert";
import { error } from "console";
import '../../../styles/inputCustom.css'

interface RenderBankProps {
    craneId: number
    banks: Array<Bank>
    onUpdate: () => void
}

/**
 * component สำหรับการจัดการ bank ของ crane นั้นๆ ใน drawer หน้า site configuration
 * @param craneId ส่ง crane id มาเพื่อระบุในการแก้ไขข้อมูลของ camera 
 * @param banks ข้อมูลของ bank 
 * @returns 
 */

export default function RenderCamera(props: RenderBankProps) {

    const _msg = new MsgAlert()

    const [bankName, setBankName] =  useState<string>('')
    const [level, setLevel] =useState<string>('')
    const [bay, setBay] = useState<string>('')
    const [updateBankName, setUpdateBankName] = useState<string>('')
    const [updateLevel, setUpdateLevel] = useState<string>('')
    const [updateBay, setUpdateBay] = useState<string>('')
    const [updateBankState, setUpdateBankState] = useState<boolean>(false)
    const [bankId, setBankId] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [delLoading, setDelLoading] = useState(false)

    const addBank = async () => {
        try {
            setLoading(true);
            
            if (!!!bankName || !!!level) {
                return _msg.default_msg({
                    title: `Data Can't be Empty`,
                    icon: 'warning',
                    msg: `Bank and Level can't be zero or empty`,
                    cancelBtn: true,
                    cancelText: 'Close',
                });
            }
    
            // ตรวจสอบว่า bankName และ level มีอยู่แล้วหรือไม่
            const isDuplicate = props.banks.some(
                (bank) => bank.bank === Number(bankName) 
            );
    
            if (isDuplicate) {
                return _msg.default_msg({
                    title: `Bank ไม่ถูกต้อง`,
                    icon: 'error',
                    msg: `Bank " ${bankName}"   มีข้อมูลอยู่เเล้ว  กรุณาเลือก Bank อื่น `,
                    cancelBtn: true,
                    cancelText: 'Close',
                });
            }
    
            const data = {
                bank: bankName,
                level: level,
                bay: bay,
                crane_id: props.craneId
            };
    
            const res = await axios.post(`${BASE_API}/add_bank`, data);
            if (res.status === 201) {
                successMessage(res.data.msg);
                props.onUpdate();
                setBankName('');
                setLevel('');
                setBay('');
            } else {
                throw new Error(res.data.msg);
            }
    
        } catch (err: any) {
            console.log(err);
            errorMessage({ message: err });
        } finally {
            setLoading(false);
        }
    };
    

    const deleteBank = async (id: number) => {
        _msg.confirm('ต้องการจะลบ Bank ใช่ไหม').then(async (isConfirmed) => {
            if (isConfirmed) {
                try {
                    setDelLoading(true)
                    const res = await axios.delete(`${BASE_API}/delete_bank/${id}`)
                    if (res.status === 200) {
                        successMessage(res.data.msg)
                        setBankId("")
                        props.onUpdate()
                    } else {
                        throw new Error(res.data.msg)
                    }
                } catch (err: any) {
                    console.log(err);
                    errorMessage({ message: err })
                } finally {
                    setDelLoading(false)
                }
            }
        })
    }

    const updateBank = async () => {
        try {
            setLoading(true)
            if (!!!updateBankName || !!!updateLevel) {
                _msg.default_msg({
                    title: `Data Can't be Empty`,
                    icon: 'warning',
                    msg: `Bank and Level can't be zero or emty`,
                    cancelBtn: true,
                    cancelText: 'Close',
                })
                return
            }

            const data = {
                bank_id: bankId,
                bank: updateBankName,
                level: updateLevel,
                bay: updateBay
            }
               // ตรวจสอบว่า bank มีอยู่แล้วหรือไม่ ยกเว่น bank ตัวเอง
               const isDuplicate = props.banks.some(
                (bank) => bank.bank === Number(updateBankName)  && bank.bank_id !== Number(bankId)
            );

            if (isDuplicate) {
                return _msg.default_msg({
                    title: `Bank ไม่ถูกต้อง`,
                    icon: 'error',
                    msg: `Bank " ${updateBankName}"   มีข้อมูลอยู่เเล้ว  กรุณาเลือก Bank อื่น `,
                    cancelBtn: true,
                    cancelText: 'Close',
                });
            }
    
            const res = await axios.post(`${BASE_API}/update_bank`, data)

            if (res.status === 200) {
                successMessage(res.data.msg)
                setUpdateBankState(false)
                setUpdateLevel("")
                setUpdateBankName("")
                setUpdateBay("")
                setBankId("")
                props.onUpdate()
            } else {
                throw new Error(res.data.msg)
            }
        } catch (err: any) {
            console.log(err);
            errorMessage({ message: err })
        } finally {
            setLoading(false)
        }
    }

    return (
        
            <div className='w-full flex flex-col justify-start items-start px-6 gap-3 mt-4'>
                <p className='text-orange text-2xl font-extralight '>
                    Bank
                </p>
                {(updateBankState === false) ? (
                    <div className='flex flex-row w-full justify-around gap-2'>
                        <TextField
                            size="small"
                            value={bankName}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    setBankName((value));
                                }
                            }}
                            className='w-auto'
                            label="Bank Name"
                            variant="outlined"
                            placeholder='e.g. 1 , 2 , 3'
                        ></TextField>
                        <TextField
                            size="small"
                            value={level}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    setLevel((value));
                                }
                            }}
                            className='w-auto'
                            label="Level"
                            variant="outlined"
                            placeholder='e.g. 10 , 20 , 15'
                        ></TextField>
                        <TextField
                            size="small"
                            value={bay}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    setBay((value));
                                }
                            }}
                            className='w-2/6'
                            label="Bay"
                            variant="outlined"
                            placeholder='e.g. 25000 , 50000 (Max 500000)'
                        ></TextField>
                        <Button
                            loading={loading}
                            className="w-1/6"
                            color="primary"
                            variant="outlined"
                            disabled={(Number(bankName) === 0 || Number(level) === 0)}
                            onClick={() => {
                                (Number(bankName) === 0 || Number(level) === 0) ? '' : addBank()
                            }}
                        >
                            เพิ่ม Bank
                        </Button>
                    </div>
                ) : (
                    <div className='flex flex-row w-full justify-around gap-2'>
                        <TextField
                            size="small"
                            value={updateBankName}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    setUpdateBankName((value));
                                }
                            }}
                            className='w-auto'
                            label="Bank Name"
                            type='number'
                            variant="outlined"
                            placeholder='e.g. 1 , 2 , 3'

                        ></TextField>
                        <TextField
                            size="small"
                            value={updateLevel}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    setUpdateLevel((value));
                                }
                            }}
                            className='w-auto'
                            label="Level"
                            type='number'
                            variant="outlined"
                            placeholder='e.g. 10 , 20 , 15'
                        ></TextField>
                        <TextField
                            size="small"
                            value={updateBay}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    setUpdateBay((value));
                                }
                            }}
                            className='w-2/6'
                            label="Bay"
                            type='number'
                            variant="outlined"
                            placeholder='e.g. 25000 , 50000 (Max 500000)'
                        ></TextField>
                        <div className='w-1/6 flex flex-row gap-1'>
                            <Button
                                loading={loading}
                                className="w-full"
                                color="primary"
                                disabled={(Number(updateBankName) === 0 || Number(updateLevel) === 0)}
                                variant="outlined"
                                onClick={() => {
                                    ( Number(updateBankName) === 0 || Number(updateLevel) === 0) ? '' : updateBank()
                                }}
                            >
                                บันทึก
                            </Button>
                            <Button
                                color="error"
                                variant="outlined"
                                onClick={() => setUpdateBankState(false)}
                                className='w-1/3 text-md rounded-r-md flex flex-row justify-center items-center'>
                                <CancelIcon />
                            </Button>
                        </div>
                    </div>
                )}
                <div className='w-full'>
                    <table className='w-full table border-2 border-collapse mb-4'>
                        <thead className='line-table-gray bg-gray-100'>
                            <tr>
                                <th className='p-2 text-center w-16 line-table-gray'>#</th>
                                <th className='p-2 text-center w-16 line-table-gray'>ID</th>
                                <th className='p-2 text-center w-44 line-table-gray'>Bank</th>
                                <th className='p-2 text-center w-44 line-table-gray'>Level</th>
                                <th className='p-2 text-center w-auto line-table-gray'>Bay (mm.)</th>
                                <th className='p-2 text-center w-28 line-table-gray'>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.banks.map((bank, index) => (
                                <tr key={bank.bank_id} className='table-hover-gray'
                                    onClick={() => {
                                        setBankId(bank.bank_id.toString())
                                        setUpdateBankName((bank.bank).toString())
                                        setUpdateBay((bank.bay).toString())
                                        setUpdateLevel((bank.level).toString())
                                        setUpdateBankState(true)
                                    }}
                                >
                                    <td className='px-2 py-1 text-center line-table-gray'>{index + 1}</td>
                                    <td className='px-2 py-1 text-center line-table-gray'>{bank.bank_id}</td>
                                    <td className='px-2 py-1 text-center line-table-gray'>{bank.bank}</td>
                                    <td className='px-2 py-1 text-center line-table-gray'>{bank.level}</td>
                                    <td className='px-2 py-1 text-center line-table-gray'>{bank.bay.toLocaleString('th-TH')}</td>
                                    <td className='w-fit py-1 px-2 line-table-gray'>
                                        <Button
                                            loading={delLoading}
                                            className="w-full"
                                            color="error"
                                            variant="outlined"
                                            onClick={(e) => {
                                                deleteBank(bank.bank_id)
                                                e.stopPropagation()
                                            }}
                                        >
                                            ลบ
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div >
        
    )
}