'use client'
import ReportSRM from "@/app/components/report/ReportSRM";
import SelectCraneMenu from "@/app/components/form/SelectCraneMenu";
import SRMStatus from "@/app/components/SRMStatus";
import { useStoreData } from "@/app/hooks/useStoreData";
import { errorMessage, errorMessagefeedback, successMessage, warningMessage, warningMessageTime } from "@/utils/messageAlert";
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
import SelectLevelMenuTo from "@/app/components/form/SelectLevelMenuTo";

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
    const [levelsTo, setLevelsTo] = useState(0)
    const [levelTo, setLevelTo] = useState<number | null>(null)
    const [bay, setBay] = useState(0)
    const [maxBay, setMaxBay] = useState(50000)
    const [pathOPC, setPathOPC] = useState('')

    const [isOrderStarted, setIsOrderStarted] = useState(false)
    const [isOrderCompleted, setIsOrderCompleted] = useState(false)
    const [resultData, setResultData] = useState<any>(null)

    const paperElement = useRef<HTMLDivElement>(null!);

    // check emergency status
    const [isEmerBefore, setIsEmerBefore] = useState<boolean>(false);
    const [isDangerouse, setIsDangerouse] = useState(false)
    const [check, setCheck] = useState(false)
    useEffect(() => {
        setPageTitle('นับจำนวนสินค้า')
        document.title = 'นับจำนวนสินค้า'
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
            setLevelsTo(0)
            setLevelTo(0)
            setBay(0)
        }
    }, [srmId])

    useEffect(() => {
        if (bank === 0) {
            setLevels(0)
            setLevel(0)
            setLevelsTo(0)
            setLevelTo(0)
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
                levelTo: levelTo,
                pathOpc: pathOPC,
                userId: userId
            }

            const res = await axios.post(`${BASE_API}/servey_count`, data)
            if (res.data.check ) {
                setResultData(res.data);  // <-- ✅ เก็บข้อมูลที่ต้องการแสดง

            } else {
                setResultData(res.data);
                throw new Error(res.data)
            }

            setIsOrderStarted(false)
            setIsOrderCompleted(true)
        } catch (err: any) {
            console.log(err);
            errorMessagefeedback({ message: err.message })
        }
        setIsOrderCompleted(true)
        setIsOrderCompleted(true)
    }
    const clear = async () => {
        setCheck(false)
        setBank(0)
        setBay(0)
        setLevel(0)
        setLevelTo(null)
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
                                setLevelsTo(v)
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
                                setLevelTo(null);
                                

                            }}
                        >
                        </SelectLevelMenu>
                    </div>
                    <div className='w-full relative flex flex-col'>
                        <SelectLevelMenuTo
                            isDisabled={(srmId === 0 || bank === 0) || isOrderCompleted || isOrderStarted || isDangerouse}
                            selectSize='medium'
                            levels={levelsTo}
                            selectLevel={Number(levelTo)}
                            onUpdate={(v) => {

                                if (v < level) {
                                   
                                    warningMessageTime("Level To ต้องมากกว่าหรือเท่ากับ Level From");
                                    setLevelTo(null);
                                    return;
                                }
                                setLevelTo(v);
                            }}
                        >
                        </SelectLevelMenuTo>
                    </div>
                    <div className="w-full flex flex-row gap-2 mt-4">
                        <Button
                            onClick={() => {
                                serveyManual()
                                setCheck(true)
                            }}
                            size="large"
                            color="inherit"
                            variant="outlined"
                            disabled={
                                (srmId === 0 || siteId === 0 || bank === 0 || level === 0) ||
                                (isOrderCompleted && !isOrderStarted) ||
                                (!isOrderCompleted && isOrderStarted) ||
                                isDangerouse
                            }
                            className="flex-1 bg-white text-black py-2"
                        >
                            <span className="text-md">สั่ง</span>
                        </Button>

                    </div>
                    <div className="w-full flex flex-row gap-2">
                        {(check == true) && (
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
                    {Array.isArray(resultData?.check) && resultData.check.length > 0 && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {resultData.check.map((item: any, index: number) => {
                                const actual = item.count ?? '-';
                                const expected = item.srm_result_level ?? '-';
                                const isMismatch = actual != expected
                                    // item.qr_count !== undefined &&
                                    item.srm_result_level !== undefined &&
                                    item.status !== item.srm_result_level;

                                return (
                                    <div
                                        key={index}
                                        className={`bg-white rounded-lg p-4 border transition shadow-md hover:shadow-lg ${isMismatch ? 'border-red-400' : 'border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-md font-semibold text-blue-600">📦 Level {item.level}</h3>
                                            <span className="text-sm text-gray-500">#{index + 1}</span>
                                        </div>

                                        <div className="text-sm text-gray-700 space-y-2">
                                            <div className="flex justify-between">
                                                <span className="font-medium">Actual Count:</span>
                                                <span>{actual}</span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="font-medium">WCS Data:</span>
                                                <span>{expected}</span>
                                            </div>

                                            {isMismatch ?(
                                                <div className="mt-3 text-sm font-semibold text-red-600 bg-red-100 text-center rounded-md py-1">
                                                    ❌ จำนวนไม่ตรงกัน
                                                </div>
                                            ): (
                                                <div className="mt-3 text-sm font-semibold text-green-600 bg-green-100 text-center rounded-md py-1">
                                                     ✅ จำนวนตรงกัน
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
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