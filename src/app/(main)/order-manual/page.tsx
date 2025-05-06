'use client'
import ReportSRM from "@/app/components/report/ReportSRM";
import SelectCraneMenu from "@/app/components/form/SelectCraneMenu";
import SRMStatus from "@/app/components/SRMStatus";
import { useStoreData } from "@/app/hooks/useStoreData";
import { errorMessage, successMessage, warningMessage } from "@/utils/messageAlert";
import { Button, Card, Divider, TextField, ToggleButtonGroup } from "@mui/material";
import axios from "@/app/config/axiosConfig";
import { useEffect, useRef, useState } from "react";
import { BASE_API } from "../api";
import SelectBankMenu from "@/app/components/form/SelectBankMenu";
import SelectLevelMenu from "@/app/components/form/SelectLevelMenu";
import SRMCommandBtn from "@/app/components/button/SRMCommandBtn";

import ExportToPdf from "@/app/components/button/ExportToPdf";
import PrintPdfBtn from "@/app/components/button/PrintPdfBtn";

import { Reports } from "@/models/srmReport";
import { SrmRealtimeRoom } from "../srm-status/page";
import CircularProgress from '@mui/material/CircularProgress';
import ReplayIcon from '@mui/icons-material/Replay';
import errorHandler from "@/utils/errorHandler";

export default function orderManual() {



    const [userId, setUserId] = useState<number | null>(null)
    const [report, setReport] = useState<Reports>()
    const [realTimeData, setRealTimeData] = useState<SrmRealtimeRoom>()

    const setPageTitle = useStoreData((state) => state.setPageTitle)
    const [siteId, setSiteId] = useState<number>()
    const [srmId, setSrmId] = useState(0)
    const [bank, setBank] = useState(0)
    const [levels, setLevels] = useState(0)
    const [level, setLevel] = useState(0)
    const [bay, setBay] = useState(0)
    const [maxBay, setMaxBay] = useState(50000)
    const [pathOPC, setPathOPC] = useState('')

    const [isOrderStarted, setIsOrderStarted] = useState(false)
    const [isOrderCompleted, setIsOrderCompleted] = useState(false)


    const paperElement = useRef<HTMLDivElement>(null!);

    // check emergency status
    const [isEmerBefore, setIsEmerBefore] = useState<boolean>(false);
    const [isDangerouse, setIsDangerouse] = useState(false)

    useEffect(() => {
        setPageTitle('สั่งการเครนแมนนวล')
        document.title = 'สั่งการเครนแมนนวล'
        const credential: any = JSON.parse(localStorage.getItem('Credential')!) as Credential
        setUserId(credential.userData.user_id)

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
        getSite()
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
        if (srmId === 0) {
            setBank(0)
            setLevels(0)
            setLevel(0)
            setBay(0)
        }
    }, [srmId])

    useEffect(() => {
        if (bank === 0) {
            setLevels(0)
            setLevel(0)
            setBay(0)
        }
    }, [bank])

    useEffect(() => {
        if (bay > maxBay) {
            setBay(maxBay)
        }
    }, [bay])

    const serveyManual = async () => {
        try {
            setIsOrderStarted(true)
            setIsOrderCompleted(false)
            const data = {
                siteId: siteId,
                craneId: srmId,
                bank: bank,
                bay: bay,
                level: level,
                pathOpc: pathOPC,
                userId: userId
            }

            const res = await axios.post(`${BASE_API}/servey_srm_mn`, data)
            if (res.status === 200) {
                await getReportDetail(res.data.report.id)
                successMessage(res.data.msg)
            } else {
                throw new Error('Unknow err occured')
            }

            setIsOrderStarted(false)
            setIsOrderCompleted(true)
        } catch (err: any) {
            console.log(err);
            errorMessage({ message: err })
        }
        setIsOrderCompleted(true)
        setIsOrderCompleted(true)
    }

    const getReportDetail = async (reportId: number) => {
        console.log(reportId)
        try {
            const res = await axios.post(`${BASE_API}/report_detail`, { reportId: reportId })
            console.log(res.data);
            const data = res.data.report as Reports
            if (res.status === 200) {
                console.log(data);
                setReport(data)
            } else {
                throw new Error(res.data.msg)
            }

        } catch (err: any) {
            errorMessage(err)
        }
    }

    const clear = async () => {
        setBank(0)
        setBay(0)
        setLevel(0)
        setReport(undefined)
        setIsOrderCompleted(false)
        setIsOrderStarted(false)
    }

    return (

        <div className="w-full p-4 flex flex-col gap-4">
            <div className="">
                <SRMStatus
                    onStatus={(v: SrmRealtimeRoom) => {
                        setRealTimeData(v)
                    }}
                    onUpdate={(v: boolean) => { }}
                ></SRMStatus>
            </div>

            <div className="w-full h-full flex flex-row gap-4 justify-start">
                <Card className="p-4 w-fit  min-h-[calc(100vh-178px)] h-autp min-w-[430px] flex flex-col gap-4">
                    <div className="flex flex-row justify-between items-end  ">
                        <div className="w-full flex justify-end gap-4">
                            {(report) && (
                                <ToggleButtonGroup
                                    color="success"
                                    orientation="horizontal"
                                >
                                    <ExportToPdf placement="top" paperEl={paperElement} />
                                    <PrintPdfBtn placement="top" paperEl={paperElement} />
                                </ToggleButtonGroup>
                            )}
                            <SRMCommandBtn
                                isDisable={isDangerouse}
                                pathOpc={pathOPC}
                            />
                        </div>
                    </div>
                    <Divider></Divider>
                    {(siteId) && (
                        <div className="w-full">
                            <SelectCraneMenu
                                isSrmp
                                isDisabled={isOrderStarted || isOrderCompleted || isDangerouse}
                                selectSize="medium"
                                siteId={siteId}
                                onUpdate={(v: any) => {
                                    setPathOPC(v.pathOpc)
                                    setSrmId(v.craneId)
                                }}
                            ></SelectCraneMenu>
                        </div>
                    )}
                    <div className="w-full">
                        <SelectBankMenu
                            isClear={bank === 0}
                            isDisabled={isOrderCompleted || (isOrderStarted) || isDangerouse}
                            selectSize='medium'
                            onUpdate={(v) => {
                                setBank(v)
                            }}
                            craneId={srmId}
                            onMaxBay={(v) => {
                                setMaxBay(v)
                            }}
                            onLevel={(v) => {
                                setLevels(v)
                            }}
                        >
                        </SelectBankMenu>
                    </div>
                    <div className='w-full relative flex flex-col'>
                        <SelectLevelMenu
                            isDisabled={(srmId === 0 || bank === 0) || isOrderCompleted || isOrderStarted || isDangerouse}
                            selectSize='medium'
                            levels={levels}
                            selectLevel={level}
                            onUpdate={(v) => {
                                setLevel(v)
                            }}
                        >
                        </SelectLevelMenu>
                    </div>

                    <div className='w-full relative flex flex-col'>
                        <TextField
                            size='medium'
                            value={bay}
                            disabled={(bank === 0 || isOrderCompleted) || (isOrderStarted) || isDangerouse}
                            onChange={(e) => {
                                const v = e.target.value
                                if (!isNaN(Number(v))) {
                                    setBay(Number(e.target.value));
                                }
                            }}

                            color='primary'
                            className='w-full border-orange text-orange bg-white'
                            label={`เบย์ (Max ${maxBay} mm.)`}
                            slotProps={{
                                inputLabel: { shrink: true }
                            }}
                        >
                        </TextField>
                    </div>
                    <div className="w-full flex flex-row gap-2 mt-4">
                        <Button
                            onClick={() => {
                                serveyManual()
                            }}
                            size="large"
                            color="inherit"
                            variant="outlined"
                            disabled={
                                (srmId === 0 || siteId === 0 || bank === 0 || bay === 0 || level === 0) ||
                                (isOrderCompleted && !isOrderStarted) ||
                                (!isOrderCompleted && isOrderStarted) ||
                                isDangerouse
                            }
                            className="flex-1 bg-white text-black py-2"
                        >
                            <span className="text-md">สั่ง</span>
                        </Button>
                        {(isOrderCompleted && !isOrderStarted) && (
                            <Button
                                onClick={() => {
                                    serveyManual()
                                }}
                                size="large"
                                color="inherit"
                                variant="outlined"
                                disabled={(!isOrderCompleted && isOrderStarted) || isDangerouse}
                                className="w-fit bg-white text-black flex flex-row gap-2 py-2"
                            >
                                <span className="text-md">สั่งเหมือนเดิม</span>
                                <ReplayIcon />
                            </Button>
                        )}
                    </div>
                    <div className="w-full flex flex-row gap-2">
                        {(isOrderCompleted === true && isOrderStarted === false) && (
                            <Button
                                disabled={isDangerouse}
                                onClick={() => {
                                    clear()
                                }}
                                size="large"
                                color="inherit"
                                variant="outlined"
                                className="flex-1 bg-white text-black py-2"
                            >
                                <span className="text-md">สั่งใหม่</span>
                            </Button>
                        )}
                    </div>
                </Card>
                <div className="w-full h-[calc(100vh-178px)]">
                    {(isOrderCompleted === false && isOrderStarted === false) && (
                        <div className="min-w-[794px] h-full flex text-black">
                            <Card className={`px-3 w-full py-4 flex flex-row items-center justify-center`}>
                                <span className="text-xl">
                                    ยังไม่มีการสั่งงาน
                                </span>
                            </Card>
                        </div>
                    )}
                    {(isOrderCompleted === true && isOrderStarted === false) && (
                        <ReportSRM
                            report={report}
                            onUpdate={(v) => {
                                paperElement.current = v;
                            }}
                        ></ReportSRM>
                    )}
                    {(isOrderCompleted === false && isOrderStarted === true) && (
                        <div className="min-w-[794px] h-full flex  ">
                            <Card className={`px-3 w-full py-4 flex flex-col items-center justify-center gap-4`}>
                                <CircularProgress size="35px" />
                                <span className="text-blue-500 text-xl">
                                    {realTimeData?.order_work ? realTimeData?.order_work : '-'}
                                </span>
                            </Card>
                        </div>
                    )}
                </div>
            </div >
        </div >

    )
}