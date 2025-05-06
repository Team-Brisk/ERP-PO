'use client'
import MsgAlert from "@/utils/sweetAlert";
import { Box, Button, Card, Divider, FormControl, Modal, TextField } from "@mui/material";
import axios from '@/app/config/axiosConfig';
import { useEffect, useState } from "react";
import { BASE_API } from "@/app/(main)/api";
interface UpdateSiteModalProps {
    isOpen: boolean
    siteId: number
    onClose: () => void
    onUpdate: () => void
}

/**
 * Modal สำหรับการแก้ไขข้อมูลของ Site งานนั้นๆ
 * @param isOpen สถานะการเปิด/ปิด modal
 * @param siteId ส่ง site id มาเพื่ออ้างอิงในการอัพเดต
 * @param onClose ส่ง event สำหรับการปิด modal ไปให้้ parent
 * @param onUpdate ส่ง event สำหรับการอัพเดตไปให้ parent เพื่อ trigger ฟังก์ชันที่ parent ในการอัพเดต data
 * 
 * @returns 
 */
export default function UpdateSiteModal(props: UpdateSiteModalProps) {
    const _msg = new MsgAlert()
    const [siteName, setSiteName] = useState<string>('')
    const [loading, setLoading] = useState(false)

    const updateSite = async () => {
        try {
            setLoading(true)
            if (siteName.trim() === '') {
                _msg.default_msg({
                    title: `Empty Data`,
                    icon: 'warning',
                    msg: `Site name can't be empty.`,
                    cancelBtn: true,
                    cancelText: 'Close',
                })
                return
            }

            const data = {
                site_id: props.siteId,
                site_name: siteName
            }

            const res = await axios.post(`${BASE_API}/update_site`, data)
            console.log(res.data.msg);
            if (res.status === 200) {
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
        } finally {
            setLoading(false)
        }
    }

    return (
        
            <Modal
                className='modal'
                open={props.isOpen}
            >
                <Box className='w-[600px]'>
                    <Card className='w-full flex flex-col gap-2 p-4'>
                        <h1 className='text-2xl text-black font-extralight pt-4'>
                            แก้ไขไซต์งาน
                        </h1>
                        <Divider></Divider>
                        <div className='w-full mt-2 flex flex-col gap-2'>
                            <FormControl className='w-full flex flex-col sm:flex-row gap-2'>
                                <TextField
                                    value={siteName}
                                    onChange={(e) => setSiteName(e.target.value)}
                                    className='w-full'
                                    size="medium"
                                    label="ชื่อไซต์งาน"
                                    variant="outlined"
                                ></TextField>
                            </FormControl>
                        </div>
                        <div className="w-full flex justify-end items-center gap-2 mt-6">
                            <Button
                                size="large"
                                variant='outlined'
                                color='error'
                                onClick={() => {
                                    props.onClose()
                                    setSiteName('')
                                }}
                            >
                                ยกเลิก
                            </Button>
                            <Button
                                loading={loading}
                                size="large"
                                variant='outlined'
                                color='primary'
                                onClick={() => updateSite()}
                            >
                                บันทึก
                            </Button>
                        </div>
                    </Card>
                </Box>
            </Modal>
        
    )
}