'use client'
import { Box, Button, FormControl, Modal, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { BASE_API } from "@/app/(main)/api";
import axios from '@/app/config/axiosConfig';
import MsgAlert from "@/utils/sweetAlert";

interface AddSiteModalProps {
    isOpen: boolean
    userId: number
    companyId: number
    onClose: () => void
    onUpdate: () => void
}

/**
 * Modal สำหรับการเพิ่มข้อมูลของ Site งานนั้นๆ
 * @param isOpen สถานะการเปิด/ปิด modal
 * @param userId ส่ง user id มาเพื่ออ้างอิงในการเพิ่่ม site งาน
 * @param companyId ส่ง company id มาเพื่ออ้างอิงในการเพิ่่ม site งาน
 * @param onClose ส่ง event สำหรับการปิด modal ไปให้้ parent
 * @param onUpdate ส่ง event สำหรับการอัพเดตไปให้ parent เพื่อ trigger ฟังก์ชันที่ parent ในการอัพเดต data
 * 
 * @returns 
 */
export default function AddSiteModal(props: AddSiteModalProps) {
    const _msg = new MsgAlert()

    const [siteName, setSiteName] = useState<string>('')

    useEffect(() => {
        if (props.isOpen) {
            
        }
    }, [props.isOpen])

    const addSite = async () => {
        try {
            const data = {
                site_name: siteName,
                user_id: props.userId,
                company_id: props.companyId
            }

            if (siteName.trim() === '') {
                return _msg.default_msg({
                    title: `Empty Data`,
                    icon: 'warning',
                    msg: `Site name can't be empty.`,
                    cancelBtn: true,
                    cancelText: 'Close',
                })

            }
            const res = await axios.post(`${BASE_API}/add_site`, { data })
            console.log(res);
            if (res.status === 201) {
                _msg.toast_msg({
                    title: res.data.msg,
                    icon: 'success',
                    timer: 5,
                    progressbar: true,
                })
                props.onUpdate()
            } else {
                throw new Error(res.data.msg)
            }

        } catch (err: any) {
            console.log(err);
            _msg.default_msg({
                title: 'Error',
                icon: 'error',
                msg: err,
                cancelBtn: true,
                cancelText: 'Close',
            })
        }
    }

    return (
        
            <Modal
                className='modal'
                open={props.isOpen}
            >
                <Box className='modal-box w-[600px]'>
                    <div className='w-full flex flex-col gap-4'>
                        <h1 className='text-2xl text-orange font-bold'>
                            Add Site
                        </h1>
                        <div className='w-full mt-2 flex flex-col gap-2'>
                            <FormControl className='w-full flex flex-col sm:flex-row gap-2'>
                                <TextField
                                    size="small"
                                    value={siteName}
                                    onChange={(e) => setSiteName(e.target.value)}
                                    className='w-full'
                                    label="Site Name"
                                    variant="outlined"
                                ></TextField>
                            </FormControl>
                        </div>
                        <div className='w-full flex justify-end items-center gap-2'>
                        <button className='btn-minimal py-2 px-3 text-red-500'  onClick={props.onClose}>Cancel</button>
                            {/* <div className='btn-minimal py-2 px-3 text-red-500' onClick={props.onClose}>Cancel</div> */}
                            {/* <div className='btn-minimal py-2 px-3 text-green-500' onClick={() => addSite()}>Add Site</div> */}
                            <button className='btn-minimal py-2 px-3 text-green-500' onClick={addSite}>Add Site</button>
                        </div>
                    </div>
                </Box>
            </Modal>
    
    )
}