'use client'

import { Camera } from "@/models/camera"
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { useState } from "react"
import CancelIcon from '@mui/icons-material/Cancel';
import { errorMessage, successMessage, warningMessage } from "@/utils/messageAlert";
import axios from '@/app/config/axiosConfig';
import { BASE_API } from "../../api";
import MsgAlert from "@/utils/sweetAlert";
import CameraStatus from "../components/_cameraStatus";
import { direction } from "html2canvas/dist/types/css/property-descriptors/direction";
import errorHandler from "@/utils/errorHandler";

interface RenderCameraProps {
    craneId: number
    cameras: Array<Camera>
    onUpdate: () => void
}

/**
 * component สำหรับการจัดการ camera ของ crane นั้นๆ ใน drawer หน้า site configuration
 * @param craneId ส่ง crane id มาเพื่อระบุในการแก้ไขข้อมูลของ camera 
 * @param cameras ข้อมูลของ cameras 
 * @returns 
 */
export default function RenderCamera(props: RenderCameraProps) {
    const _msg = new MsgAlert()

    const [cameraUrl, setCameraUrl] = useState<string>('')
    const [updateCameraState, setUpdateCameraState] = useState<boolean>(false)
    const [newCameraUrl, setNewCameraUrl] = useState<string>('')
    const [newCameraDirect, setNewCameraDirect] = useState<string>()
    const [cameraId, setCameraId] = useState<number>()
    const [cameraDirection, setCameraDirection] = useState<string>('ไม่เลือก')
    const [loading, setLoading] = useState(false)
    const [delLoading, setDelLoading] = useState(false)
    const [cameraLoading, setCameraLoading] = useState(false)
    const [cameraLoadingId, setCameraLoadingId] = useState<number>()

    const addCamera = async () => {
        try {
            setLoading(true)

            // ตรวจสอบว่า URL ถูกต้องหรือไม่
            if (cameraUrl.trim() === '') {
                _msg.default_msg({
                    title: `เพิ่มไม่สำเร็จ`,
                    icon: 'warning',
                    msg: `กรุณากรอก URL กล้องให้ถูกต้อง`,
                    cancelBtn: true,
                    cancelText: 'ปิด',
                })
                return
            }

            // ตรวจสอบว่ามี camera_direction ซ้ำหรือไม่
            const DuplicateDirection = props.cameras.some(
                (camera) => camera.camera_direction === cameraDirection
            )


            if (DuplicateDirection) {
                return warningMessage(`เเพิ่มกล้องไม่สำเร็จ : ทิศทาง "${cameraDirection}" มีกล้องอยู่แล้ว กรุณาเลือกทิศทางอื่น`)
            }

            // ข้อมูลที่ต้องการส่งไปยัง API
            const data = {
                crane_id: props.craneId,
                camera_url: cameraUrl,
                camera_direction: cameraDirection,
            }

            // เรียก API
            const res = await axios.post(`${BASE_API}/add_camera`, data)

            if (res.status === 201) {
                setCameraUrl('')
                successMessage(res.data.msg)
                props.onUpdate()
            } else {
                throw new Error(res.data.msg)
            }
        } catch (err: any) {
            errorHandler(err)
        } finally {
            setLoading(false)
        }
    }

    const updateCamera = async () => {
        try {
            setLoading(true)
            if (!!!newCameraUrl.trim()) {
                _msg.default_msg({
                    title: `เพิ่มไม่สำเร็จ`,
                    icon: 'warning',
                    msg: `กรุณากรอก URL กล้องให้ถูกต้อง`,
                    cancelBtn: true,
                    cancelText: 'ปิด',
                })
                return
            }

            // เช็คทิศทางซ้ำ (แต่ไม่เช็คตัวเอง)
            const DuplicateDirection = props.cameras.some(
                (camera) => camera.camera_direction === newCameraDirect && camera.camera_id !== cameraId
            )

            if (DuplicateDirection) {
                return warningMessage(`เพิ่มกล้องไม่สำเร็จ : ทิศทาง "${newCameraDirect}" มีกล้องอยู่แล้ว กรุณาเลือกทิศทางอื่น`)
            }

            const data = {
                camera_id: cameraId,
                new_camera_url: newCameraUrl,
                camera_direction: newCameraDirect
            }

            const res = await axios.post(`${BASE_API}/update_camera`, data)

            if (res.status === 200) {
                successMessage(res.data.msg)
                setUpdateCameraState(false)
                setNewCameraUrl('')
                setNewCameraDirect('')
                props.onUpdate()
            } else {
                throw new Error(res.data.msg)
            }

        } catch (err: any) {
            errorHandler(err)
        } finally {
            setLoading(false)
        }
    }


    const toggleCamera = async (cameraId: string | number, status: 1 | 0) => {
        try {
            setCameraLoadingId(Number(cameraId))
            setCameraLoading(true)
            if (status === 1) {
                status = 0
            } else {
                status = 1
            }

            const data = {
                camera_id: cameraId,
                active_status: status
            }

            const res = await axios.post(`${BASE_API}/toggle_camera`, data)

            if (res.status === 200) {
                props.onUpdate()
                successMessage(res.data.msg)
            } else {
                throw new Error(res.data.msg)
            }
        } catch (err: any) {
            errorHandler(err)
            // if (err.response && (err.response.status === 404 || err.response.status === 503)) {
            //     props.onUpdate();
            //     errorMessage({ message: err.response.data.msg });
            // } else {

            //     errorMessage({ message: 'เกิดข้อผิดพลาดบางอย่าง ไม่ทราบสาเหตุ' })
            // }
        } finally {
            setCameraLoadingId(0)
            setCameraLoading(false)
        }
    }

    const deleteCamera = async (cameraId: number) => {
        _msg.confirm('ต้องการลบกล้องใช่ไหม').then(async (isConfirmed) => {
            if (isConfirmed) {
                try {
                    setDelLoading(true)
                    const res = await axios.delete(`${BASE_API}/delete_camera/${cameraId}`)
                    if (res.status = 200) {
                        successMessage(res.data.msg)
                        setUpdateCameraState(false)
                        setCameraDirection('ไม่เลือก')
                        props.onUpdate()
                    } else {
                        throw new Error(res.data.msg)
                    }
                } catch (err: any) {
                    errorMessage({ message: err })
                } finally {
                    setDelLoading(false)
                }
            }
        })
    }

    return (

        <div className='w-full flex flex-col justify-start items-start px-6 gap-3 mt-4'>
            <p className='text-orange text-2xl font-extralight '>
                Camera
            </p>
            {(updateCameraState === false) ? (
                <div className='flex flex-row w-full gap-2'>
                    <TextField
                        size='small'
                        value={cameraUrl}
                        onChange={(e) => setCameraUrl(e.target.value.trim())}
                        className='w-4/6'
                        label="Camera Url"
                        variant="outlined"
                        placeholder='Enter Cemera Url'
                    >
                    </TextField>
                    <FormControl className='w-1/6'>
                        <InputLabel id="selectLabel">ทิศทาง</InputLabel>
                        <Select
                            value={cameraDirection}
                            onChange={(e) => {
                                setCameraDirection(e.target.value)
                            }}
                            size='small'
                            labelId="selectLabel"
                            id="selectLabel"
                            label="ทิศทาง"
                            className="w-full"
                        >
                            <MenuItem value={'ไม่เลือก'} key={0}>
                                ไม่เลือก
                            </MenuItem>
                            <MenuItem value={'ซ้าย'} key={1}>
                                ซ้าย
                            </MenuItem>
                            <MenuItem value={'ขวา'} key={2}>
                                ขวา
                            </MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        loading={loading}
                        className="w-1/6"
                        color="primary"
                        variant="outlined"
                        disabled={(cameraDirection === 'ไม่เลือก' || cameraUrl.trim() === '')}
                        onClick={() => {
                            (cameraDirection !== 'ไม่เลือก' || cameraUrl.trim() !== '') ? addCamera() : ''
                        }}
                    >
                        เพิ่มกล้อง
                    </Button>
                </div>
            ) : (
                <div className='flex flex-row w-full gap-2'>
                    <TextField
                        size="small"
                        value={newCameraUrl}
                        onChange={(e) => setNewCameraUrl(e.target.value.trim())}
                        className='w-4/6'
                        label="New Camera Url"
                        variant="outlined"
                        placeholder='Enter New Cemera Url'
                    >
                    </TextField>
                    <FormControl className='w-1/6'>
                        <InputLabel id="selectLabel">Direction</InputLabel>
                        <Select
                            size="small"
                            value={newCameraDirect}
                            onChange={(e) => {
                                setNewCameraDirect(e.target.value)
                            }}
                            labelId="selectLabel"
                            id="selectLabel"
                            label="Direction"
                            className="w-full"
                        >
                            <MenuItem value={'ซ้าย'} key={1}>
                                ซ้าย
                            </MenuItem>
                            <MenuItem value={'ขวา'} key={2}>
                                ขวา
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <div className='w-1/6 flex flex-row gap-1'>
                        <Button
                            loading={loading}
                            color="primary"
                            variant="outlined"
                            onClick={() => {
                                if (cameraId) {
                                    if (newCameraDirect !== 'ไม่เลือก' && newCameraUrl.trim() !== '') {
                                        updateCamera();
                                    }
                                }
                            }}
                            className={`w-full obj-center text-md rounded-l-md`}>
                            บันทึก
                        </Button>

                        <Button
                            color="error"
                            variant="outlined"
                            onClick={(e) => {
                                setUpdateCameraState(false);
                                setCameraDirection('ไม่เลือก');
                                e.stopPropagation();
                            }}
                            className='w-1/3 text-md rounded-r-md flex flex-row justify-center items-center'>
                            <CancelIcon />
                        </Button>
                    </div>
                </div>
            )}
            <div className='w-full'>
                <table className='w-full table border-2 border-collapse'>
                    <thead className='line-table-gray bg-gray-100'>
                        <tr>
                            <th className='p-2 text-center w-16 line-table-gray'>#</th>
                            <th className='p-2 text-center w-16 line-table-gray'>ID</th>
                            <th className='p-2 text-left w-auto line-table-gray'>Url</th>
                            <th className='p-2 text-center w-16 line-table-gray'>Direction</th>
                            <th className='p-2 text-center w-16 line-table-gray'>Active</th>
                            <th className='p-2 text-center w-28 line-table-gray'>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.cameras.map((camera, index) => (
                                <tr key={index} className='table-hover-gray'
                                    onClick={() => {
                                        setCameraId(camera.camera_id)
                                        setUpdateCameraState(true)
                                        setNewCameraUrl(camera.camera_url)
                                        setNewCameraDirect(camera.camera_direction)
                                    }}>
                                    <td className='px-2 py-1 text-center w-16 line-table-gray'>{index + 1}</td>
                                    <td className='px-2 py-1 text-center w-16 line-table-gray'>{camera.camera_id}</td>
                                    <td className='px-2 py-1 text-left w-auto line-table-gray'>
                                        <div className='w-full flex justify-start items-start gap-2'>
                                            {/* <Link
                                                    onClick={(e) => { e.stopPropagation() }}
                                                    href={camera.camera_url.startsWith('http') ? camera.camera_url : `http://${camera.camera_url}`}
                                                    target="_blank">
                                                    <OpenInNewIcon color='primary' className='hover:scale-[1.2]' />
                                                </Link> */}
                                            {camera.camera_url}
                                        </div>
                                    </td>
                                    <td className='px-2 py-1 text-center w-auto line-table-gray'>
                                        {camera.camera_direction}
                                    </td>
                                    <td className='px-2 py-1 text-center w-auto line-table-gray'
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            toggleCamera(camera.camera_id, camera.camera_activate);
                                        }}>
                                        <Button
                                            loading={cameraLoading && (cameraLoadingId === camera.camera_id)}
                                            color={camera.camera_activate === 0 ? 'error' : 'success'}
                                            variant="outlined"
                                        >
                                            <span>{(camera.camera_activate === 0) ? 'ปิด' : 'เปิด'}</span>
                                        </Button>
                                    </td>
                                    <td className='w-fit py-1 px-2 line-table-gray' onClick={(e) => { e.stopPropagation() }}>
                                        <Button
                                            loading={delLoading}
                                            className="w-full"
                                            color="error"
                                            variant="outlined"
                                            onClick={() => {
                                                deleteCamera(camera.camera_id)
                                            }}
                                        >
                                            ลบ
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>

    )
}
