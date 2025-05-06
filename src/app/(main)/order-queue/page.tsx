'use client'
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { SrmRealtimeRoom } from "../srm-status/page";
import SRMStatus from "@/app/components/SRMStatus";

import { useStoreData } from "@/app/hooks/useStoreData";
import axios from "@/app/config/axiosConfig";
import { BASE_API } from "../api";
import { errorMessage, successMessage, warningMessage } from "@/utils/messageAlert";
import { Crane } from "@/models/crane";
import { Button, Card, CircularProgress, Divider, Tab, Tabs, TextField, ToggleButton, Tooltip } from "@mui/material";
import { io, Socket } from "socket.io-client";
import SelectCraneMenu from "@/app/components/form/SelectCraneMenu";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CachedIcon from '@mui/icons-material/Cached';
import MuiCrrQTable from "@/app/components/dataTable/MuiCrrQTable";
import RefreshIcon from '@mui/icons-material/Refresh';
import MuiFnQTable from "@/app/components/dataTable/MuiFnQTable";
import DoDisturbIcon from '@mui/icons-material/DoDisturb';

import { CheckBox, Description } from "@mui/icons-material";
import MuiQueReport from "@/app/components/dataTable/MuiQueReport";
import MuiStuckQTable from "@/app/components/dataTable/MuiStuckQTable";
import AddQueueCSV from "./components/AddQueueCsv";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import InputIcon from '@mui/icons-material/Input';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import StopIcon from '@mui/icons-material/Stop';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import errorHandler from "@/utils/errorHandler";
import { AxiosError } from "axios";
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import DeleteIcon from '@mui/icons-material/Delete';

import * as XLSX from 'xlsx';
export interface qData {
    id: number,
    queue: number,
    barcode: string,
    status: 0 | 1 | 2 | 3 | 4,
    date: string,
    crane_id: number,
    crane: Crane,
    site_id: number,
    user_id: number,
    input_id: number | null
}

interface QueueUpdate {
    room: string,
    queue_id: number,
    status: 0 | 1 | 2 | 3 | 4
}

type OrderQueueType = 'Box' | 'Csv'
type RabbitMQTypeInfo = 'Running' | 'Paused' | 'Unknow'
export default function OrderQueue() {

    const setPageTitle = useStoreData((state) => state.setPageTitle)

    const [qTypeSl, setQTypeSl] = useState<OrderQueueType>('Box')
    const [isRbStated, setIsRbStarted] = useState<RabbitMQTypeInfo>('Unknow')
    const [isPLoading, setIsPLoading] = useState(false)
    const [isCLoading, setIsCLoading] = useState(false)

    const socketRef = useRef<Socket | null>(null);
    const [realTimeData, setRealTimeData] = useState<SrmRealtimeRoom>()
    const [credential, setCredential] = useState<Credential | null>(null)

    const [qData, setQData] = useState<Array<qData>>([])
    const [qDataStuck, setQDataStuck] = useState<Array<qData>>([])

    const [companyId, setCompanyId] = useState<number>()

    const [srmId, setSrmId] = useState(0);
    const [siteId, setSiteId] = useState<number>()
    const [userId, setUserId] = useState<number | null>(null)
    const [pathOpc, setPathOpc] = useState<string>();
    const [srmResp, setSrmResp] = useState<string>();
    const [idWCS, setIdWCS] = useState<string>();

    // element binding 
    const [tabV, setTabV] = useState(0);
    const [inputs, setInputs] = useState<Array<string>>(['']);

    // check emergency status
    const [isEmerBefore, setIsEmerBefore] = useState<boolean>(false);
    const [isDangerouse, setIsDangerouse] = useState(false)

    const [searchInput, setSearchInput] = useState('');
    const [options, setOptions] = useState<string[]>([]);
    const [selectedBarcode, setSelectedBarcode] = useState<string | null>(null);
    const [failCount, setFailCount] = useState<number | null>(null); // ใช้ชื่อให้สื่อความหมาย
    const [successCount, setSuccessCount] = useState<number>(0);

    const nextGroupId = 0
    useEffect(() => {
        setPageTitle(`สั่งการเครนแบบคิวงาน`)
        document.title = 'สั่งการเครนแบบคิวงาน'
        const credential: any = JSON.parse(localStorage.getItem('Credential')!) as Credential


        const getSite = async () => {
            try {
                const res = await axios.get(`${BASE_API}/get_first_site`)
                if (res.status === 200) {
                    setSiteId(res.data.data.site_id)
                } else {
                    throw new Error(res.data.msg)
                }
            } catch (err: any) {
                errorMessage(err)
            }
        }
        const fetchData = async () => {
            try {
                const res = await axios.post(`${BASE_API}/get_group`)
                if (res.status === 200) {
                    setSuccessCount(res.data.q_data[0].group_queue)
                } else {
                    throw new Error(res.data.msg)
                }
            } catch (err: any) {
                errorMessage(err)
            }
        }

        getSite()
        fetchData()
        setCredential(credential)
        setUserId(credential.userData.user_id)
        setCompanyId(credential.userData.company_id)
        setSrmResp(credential.userData.srm_resp)
    }, [])

    useEffect(() => {
        if (!realTimeData?.D0328) return;

        const d328 = Number(realTimeData.D0328.split('|')[0]);
        const isEmerNow = d328 > 100;

        // ถ้าในรอบนี้เป็น emergency แต่รอบก่อนหน้าไม่ใช่ => แสดง warning
        if (isEmerNow && !isEmerBefore) {
            setIsDangerouse(true);
            warningMessage('เกิดสถานะผิดปกติไม่สามารถสั่งการได้');
        }
        // ถ้าในรอบนี้ไม่ใช่ emergency แต่รอบก่อนหน้าคือ emergency => แสดง success
        else if (!isEmerNow && isEmerBefore) {
            setIsDangerouse(false);
            successMessage('สถานะเครื่องจักรพร้อมใช้งานแล้ว');
        }

        // อัปเดตสถานะ emergency ให้ตรงกับรอบนี้
        setIsEmerBefore(isEmerNow);
    }, [realTimeData?.D0328, isEmerBefore])

    useEffect(() => {
        if (tabV === 2) {
            fetchQStuck()
        }
    }, [tabV])

    useEffect(() => {
        if (pathOpc) {
            checkChannelStatue()
        }
    }, [pathOpc])

    useEffect(() => {
        if (!srmResp) {
            return
        }

        if (!socketRef.current) {
            const socket = io(BASE_API)
            socketRef.current = socket;

            socket.on("connect", () => {
                const room = srmResp + "-STATUS-ROOM";
                socket.emit("join_room", { room });
            });

            socket.on("receive_data", () => {
                (data: any) => {
                    if (data.room === srmResp + "-STATUS-ROOM") {
                        setRealTimeData((prvData) => ({
                            ...prvData,
                            ...data
                        }));
                    }
                }
            });

            socket.on('q_update', async (data: QueueUpdate) => {
                setTimeout(() => {
                    if (qData) {
                        setQData((prevQData) => {
                            const newData = [...prevQData];
                            const index = newData.findIndex((q) => q.id === data.queue_id);
                            if (index !== -1) {
                                if ([2, 3, 4].includes(data.status)) {
                                    newData.splice(index, 1); // ลบ item ออกจาก array
                                } else {
                                    newData[index] = { ...newData[index], status: data.status };
                                }
                            }
                            return newData;
                        });
                    }

                    if (data.status === 2) {
                        successMessage('ตรวจสอบคิวงานเสร็จแล้ว')
                    }
                }, 500)

            })
        }

        const socket = socketRef.current;
        const room = srmResp + "-STATUS-ROOM";
        return () => {
            socket.emit("leave_room", { room }); // ออกจากห้องเมื่อ component unmount
        };
    }, [srmResp, srmId, qData]);

    useEffect(() => {
        if (userId !== undefined && srmId !== undefined) {
            fetchQ()
        }
    }, [userId, srmId])


    const fetchQ = async () => {
        try {
            const data = {
                craneId: srmId,
            }
            const res = await axios.post(`${BASE_API}/get_q_running`, data)
            if (res.status === 200) {
                setQData(res.data.q_data)
                fetchQStuck()
            } else {
                throw new Error(res.data.msg)
            }
        } catch (err: any) {
            errorMessage(err)
        }
    }

    const fetchQStuck = async () => {
        try {
            const data = {
                craneId: srmId,
            }
            const res = await axios.post(`${BASE_API}/get_q_stuck`, data)
            if (res.status === 200) {
                setQDataStuck(res.data.q_data)
            } else {
                throw new Error('มีบางอย่างผิดพลาด')
            }
        } catch (err: any) {
            errorMessage(err)
        }
    }

    const addQ = async () => {
        try {
            console.log(srmId, pathOpc, '<-- checked!');

            if (!srmId) {
                errorMessage({ title: 'ไม่สามารถเพิ่มคิวงานได้', message: 'กรุณาเลือกเครนที่ต้องการใช้งานก่อน' });
                return;
            }
            if (!validateInputs()) {
                errorMessage({ title: 'ไม่สามารถเพิ่มคิวงานได้', message: 'กรุณาป้อนบาร์โค้ดให้ครบทุกช่อง' });
                return;
            }
            // if (qData.length + inputs.length > 10) {
            //     errorMessage({ title: 'ไม่สามารถเพิ่มคิวงานได้', message: 'สามารถเพิ่มคิวงานได้มากสุด 10 คิวงานต่อ 1 เครน' });
            //     return;
            // }

            const queryData: Array<{
                group_queue: number
                barcode: string
                status: number
                crane_id: number
                site_id: number
                user_id: number
            }> = [];

            const data = {
                idWCS,
                pathOpc,
                queryData
            }
            const groupQueue = successCount + 1;
            inputs.forEach((barcode, index) => {
                queryData.push({
                    group_queue: groupQueue,
                    barcode: barcode,
                    status: 0, // กำหนดสถานะเริ่มต้น (อาจจะเปลี่ยนเป็น status อื่นตามที่ต้องการ)
                    crane_id: srmId!,
                    site_id: siteId!,
                    user_id: userId!
                });
            });

            const res = await axios.post(`${BASE_API}/servey_srm_q`, data)

            if (res.status === 200) {

                successMessage('เพิ่มคิวเเล้ว')
                fetchQ()
            } else {
                throw new Error(res.data.msg)
            }

        } catch (err: any) {
            errorMessage({ message: err })
        }
    }

    const deleteQueue = (index: number): void => {
        setInputs((prevInputs) => prevInputs.filter((_, i) => i !== index));
    };

    // ฟังก์ชันสำหรับเพิ่ม input ใหม่เข้าไปใน array
    const addInput = (): void => {
        setInputs([...inputs, '']);
    };

    const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newInputs = [...inputs];
        newInputs[index] = event.target.value;
        setInputs(newInputs);
    };

    const validateInputs = (): boolean => {
        return inputs.every(input => input.trim() !== "");
    };

    const [isModalOpen, setIsModalOpen] = useState(false)

    const renderInput = () => {
        return (<>
            {inputs.map((value, index) => (
                <div key={index} className="flex flex-row gap-1">
                    <TextField
                        size='small'
                        value={value}
                        disabled={isDangerouse}
                        onChange={(e) => handleInputChange(index, e)}
                        color='primary'
                        className='w-full border-orange text-orange bg-white'
                        label={`บาร์โค้ด ${index + 1}`}
                        slotProps={{
                            inputLabel: { shrink: true }
                        }}
                    >
                    </TextField>
                    <Tooltip title='ลบ' placement={'right'}>
                        <ToggleButton
                            size="small"
                            onClick={() => { deleteQueue(index) }}
                            className={`bg-red-300 text-white hover:bg-red-400 duration-300`}
                            value="center"
                        >
                            <CloseIcon />
                        </ToggleButton>
                    </Tooltip>
                </div>
            ))}
        </>);
    }

    const renderCsv = () => {
        return (
            <div onClick={() => handleDivClick()}
                className="w-full h-[200px] flex flex-col justify-center items-center border-[2px] border-dashed rounded-lg cursor-pointer
                        text-gray-400 border-gray-400 hover:text-gray-400 hover:bg-gray-50 hover:border-gray-600 duration-300"
            >
                <CloudUploadIcon />
                <span>
                    อัปโหลดไฟล์
                </span>
            </div>
        )
    }

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDivClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }



    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const fileName = file.name.toLowerCase();
        const isExcel = fileName.endsWith('.xls') || fileName.endsWith('.xlsx');
        const isCSV = fileName.endsWith('.csv');

        if (!isExcel && !isCSV) {
            errorMessage({ title: 'รูปแบบไฟล์ไม่รองรับ', message: 'กรุณาอัปโหลดเฉพาะไฟล์ .csv, .xls, หรือ .xlsx เท่านั้น' });
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            const result = e.target?.result;
            if (!result) {
                errorMessage({ title: 'ไม่สามารถอ่านไฟล์ได้', message: 'กรุณาลองใหม่อีกครั้งหรือเลือกไฟล์อื่น' });
                return;
            }

            let barcodeList: string[] = [];

            try {
                if (isExcel) {
                    const data = new Uint8Array(result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    if (jsonData.length <= 1) {
                        errorMessage({ title: 'ไฟล์ว่างเปล่า', message: 'ไม่พบข้อมูลบาร์โค้ดในไฟล์ Excel' });
                        return;
                    }

                    barcodeList = jsonData.slice(1).map(row => row[1]).filter(Boolean);
                } else {
                    const text = result as string;
                    const rows = text.split('\n').map(row => row.trim()).filter(row => row !== '');
                    if (rows.length <= 1) {
                        errorMessage({ title: 'ไฟล์ว่างเปล่า', message: 'ไม่พบข้อมูลบาร์โค้ดในไฟล์ CSV' });
                        return;
                    }

                    barcodeList = rows.slice(1).map(row => row.split(',')[1]).filter(Boolean);
                }

                if (barcodeList.length === 0) {
                    errorMessage({ title: 'รูปเเบบไม่ถูกต้อง', message: 'กรุณาตรวจสอบว่าไฟล์มีข้อมูลบาร์โค้ดอยู่ในคอลัมน์ที่ 2' });
                    return;
                }

                setInputs(prev => [...barcodeList]);
                setQTypeSl('Box');
            } catch (err) {
                console.error(err);
                errorMessage({ title: 'เกิดข้อผิดพลาด', message: 'ไม่สามารถประมวลผลไฟล์นี้ได้ กรุณาตรวจสอบข้อมูลในไฟล์' });
            }
        };

        if (isExcel) {
            reader.readAsArrayBuffer(file);
        } else {
            reader.readAsText(file);
        }
    };


    const cancelAllQ = async () => {
        setIsCLoading(true)
        try {
            if (!pathOpc) return errorMessage({ message: 'กรุณาเลือกเครนให้ถูกต้อง' })
            const res = await axios.post(`${BASE_API}/cancel_all_q`, { node: pathOpc })
            if (res.status === 200) {
                successMessage(res.data.msg)
                fetchQ()
            } else {
                throw new AxiosError('Unknow Error')
            }
        } catch (err: any) {
            errorHandler(err)
        } finally {
            setIsCLoading(false)
        }
    }

    const pause_all_q = async () => {
        setIsPLoading(true)
        try {
            if (!pathOpc) return errorMessage({ message: 'กรุณาเลือกเครนให้ถูกต้อง' })
            const res = await axios.post(`${BASE_API}/pause_all_q`, { node: pathOpc })
            if (res.status === 200) {
                successMessage(res.data.msg)
                fetchQ()
            } else {
                throw new AxiosError('Unknow Error')
            }
        } catch (err: any) {
            errorHandler(err)
        } finally {
            checkChannelStatue()
        }
    }

    const resume_all_q = async () => {
        setIsPLoading(true)
        try {
            if (!pathOpc) return errorMessage({ message: 'กรุณาเลือกเครนให้ถูกต้อง' })

            // เรียก API /resume_all_q แทน /pause_all_q
            const res = await axios.post(`${BASE_API}/resume_all_q`, { node: pathOpc })

            if (res.status === 200) {
                successMessage(res.data.msg)
                fetchQ()  // รีเฟรชข้อมูลคิว
            } else {
                throw new AxiosError('Unknow Error')
            }
        } catch (err: any) {
            errorHandler(err)
        } finally {
            checkChannelStatue()
        }
    }

    const checkChannelStatue = async () => {
        setIsPLoading(true)
        try {
            if (!pathOpc) return errorMessage({ message: 'กรุณาเลือกเครนให้ถูกต้อง' })
            const res = await axios.post(`${BASE_API}/check_channel_status`, { node: pathOpc })
            if (res.status === 200) {
                setIsRbStarted(res.data.status)
            } else {
                throw new AxiosError('Unknow Error')
            }
        } catch (err: any) {
            errorHandler(err)
        } finally {
            setIsPLoading(false)
        }
    }

    useEffect(() => {
        console.log(isRbStated);
    }, [isRbStated])
    return (
        <div className="w-full p-4 flex flex-col gap-4">
            <AddQueueCSV
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                }}
            ></AddQueueCSV>
            <div className="">
                <SRMStatus
                    onStatus={(v: SrmRealtimeRoom) => {
                        setRealTimeData(v)
                    }}
                    onUpdate={(v: boolean) => { }}
                ></SRMStatus>
            </div>
            <div className="w-full h-full flex flex-row gap-4 justify-start">
                <Card className=" p-4 w-fit  min-h-[calc(100vh-178px)] h-auto  min-w-[430px] flex flex-col gap-4">
                    <div className="flex flex-row justify-end items-end gap-1">
                        <div className="flex-1 flex justify-between gap-1">
                            <div className="flex gap-1">
                                <Tooltip title='กรอกบาร์โค้ดเอง' placement={'top'}>
                                    <ToggleButton
                                        disabled={isDangerouse}
                                        onClick={() => {
                                            setQTypeSl('Box')
                                        }}
                                        className={`bg-white hover:text-green-500 duration-300`}
                                        value="center"
                                    >
                                        <InputIcon />
                                    </ToggleButton>
                                </Tooltip>
                                <Tooltip title='เพิ่มคิวงานด้วยเอกสาร' placement={'top'}>
                                    <ToggleButton
                                        disabled={isDangerouse}
                                        onClick={() => {
                                            setQTypeSl('Csv')
                                        }}
                                        className={`bg-white hover:text-green-500 duration-300`}
                                        value="center"
                                    >
                                        <NoteAddIcon />
                                    </ToggleButton>
                                </Tooltip>
                                <Tooltip title='ยกเลิกคิวงานทั้งหมด' placement={'top'}>
                                    <ToggleButton
                                        disabled={isDangerouse || qData.length === 0}
                                        onClick={() => {
                                            cancelAllQ()
                                        }}
                                        className={`bg-white hover:text-red-600 text-red-500 duration-300`}
                                        value="center"
                                    >
                                        {(isCLoading) ? <CircularProgress size={24} color="inherit" /> : <DisabledByDefaultIcon />}
                                    </ToggleButton>
                                </Tooltip>
                                <Tooltip
                                    title={
                                        isRbStated === 'Running' ? (
                                            <>หยุดคิวงานชั่วคราว</>
                                        ) : isRbStated === 'Paused' ? (
                                            <>เริ่มคิวงานอีกครั้ง</>
                                        ) : (
                                            <>ไม่พร้อมทำงาน</>
                                        )
                                    }
                                    placement={'top'}
                                >
                                    <ToggleButton
                                        disabled={isDangerouse || (isRbStated === 'Unknow')}
                                        onClick={() => {
                                            if (isRbStated === 'Running') {
                                                pause_all_q()
                                            } else if (isRbStated === 'Paused') {
                                                resume_all_q()
                                            }
                                        }}
                                        className={`bg-white hover:text-blue-500  text-blue-500 duration-300`}
                                        value="center"
                                    >
                                        {(isPLoading) ? <CircularProgress size={24} color="inherit" /> : (
                                            <>
                                                {(isRbStated === 'Paused') && <span className="hover:text-blue-500  text-blue-500"><PlayCircleFilledWhiteIcon /></span>}
                                                {(isRbStated === 'Running') && <span className="hover:text-red-500  text-red-500"><StopCircleIcon /></span>}
                                                {(isRbStated === 'Unknow') && <DoNotDisturbIcon />}
                                            </>
                                        )}
                                    </ToggleButton>
                                </Tooltip>


                            </div>
                            <div className="flex flex-row gap-1">
                                <Tooltip title='โหลดข้อมูลใหม่' placement={'top'}>
                                    <ToggleButton
                                        disabled={isDangerouse}
                                        onClick={() => {
                                            fetchQ()
                                            checkChannelStatue()
                                        }}
                                        className={`bg-white hover:text-blue-500 duration-300`}
                                        value="center"
                                    >
                                        <RefreshIcon />
                                    </ToggleButton>
                                </Tooltip>
                                {(qTypeSl === 'Box') && (
                                    <Tooltip title='เพิ่มช่องคิวงาน' placement={'top'}>
                                        <ToggleButton
                                            onClick={() => { addInput() }}
                                            className={`bg-white hover:text-blue-500 duration-300`}
                                            disabled={isDangerouse}
                                            value="center"
                                        >
                                            <AddIcon />
                                        </ToggleButton>
                                    </Tooltip>
                                )}
                                <Tooltip title='ลบบาร์โค้ดทั้งหมด' placement={'top'}>
                                    <ToggleButton
                                        onClick={() => setInputs([])}
                                        className={`bg-white hover:text-red-500 text-red-500 duration-300`}
                                        disabled={isDangerouse || inputs.length === 0}
                                        value="center"
                                    >
                                        <DeleteIcon />
                                    </ToggleButton>
                                </Tooltip>

                            </div>
                        </div>
                    </div>
                    <Divider></Divider>
                    {(siteId) && (
                        <div className="w-full max-h-[calc(100vh-178px)] overflow-auto">
                            <SelectCraneMenu
                                isAutoSelected
                                isSrmp
                                isDisabled={isDangerouse}
                                selectSize="small"
                                siteId={siteId}
                                onUpdate={(v: any) => {
                                    setPathOpc(v.pathOpc)
                                    setSrmId(v.craneId)
                                }}
                            ></SelectCraneMenu>
                        </div>
                    )}
                    {(qTypeSl === 'Box') ? (
                        <>
                            {renderInput()}

                        </>
                    ) : (
                        <>
                            {renderCsv()}
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                accept=".csv, .xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            />

                        </>
                    )}
                    <Button
                        onClick={() => {
                            addQ()
                        }}
                        disabled={(inputs.length <= 0) || isDangerouse}
                        size="medium"
                        color="inherit"
                        variant="outlined"
                        className=" bg-white text-black py-2"
                    >
                        <span className="text-md">เริ่มคิวงาน</span>
                    </Button>
                </Card>
                <div className="w-full h-[calc(100vh-178px)]">
                    <Card className={`w-full h-full flex flex-col items-start justify-start gap-4`}>
                        <Tabs
                            value={tabV}
                            onChange={(event, newValue) => setTabV(newValue)}
                            aria-label="basic tabs example">
                            <Tab label={`คิวงานปัจจุบัน (${qData.length})`} icon={<CachedIcon />} iconPosition="start" />
                            <Tab label="คิวงานที่เสร็จสิ้น (ล่าสุด)" icon={<CheckCircleIcon />} iconPosition="start" />
                            <Tab label={`คิวงานตกค้าง (${qDataStuck.length})`} icon={<DoDisturbIcon />} iconPosition="start" />
                            <Tab label={`ตรวจสอบคิวงาน `} icon={<Description />} iconPosition="start" />

                        </Tabs>
                        {(tabV === 0) &&
                            (
                                <MuiCrrQTable
                                    qData={qData}
                                    orderStatus={realTimeData?.order_work}
                                ></MuiCrrQTable>
                            )
                        }
                        {(tabV === 1) &&
                            (
                                <MuiFnQTable
                                    craneId={srmId}
                                >
                                </MuiFnQTable>
                            )
                        }
                        {(tabV === 2) &&
                            (

                                <MuiStuckQTable
                                    onUpdate={(v: any) => {
                                        fetchQ()
                                        fetchQStuck()
                                    }}
                                    qDataStuck={qDataStuck}
                                ></MuiStuckQTable>

                            )

                        }
                        {(tabV === 3) &&
                            (

                                <MuiQueReport
                                    craneId={srmId}
                                    check={1}
                                >
                                </MuiQueReport>

                            )

                        }

                    </Card>
                </div>
            </div >
        </div >

    );
}