'use client'

import { Credential } from "@/models/users"
import axios from "@/app/config/axiosConfig"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { BASE_API } from "../(main)/api"
import { SrmRealtimeRoom } from "../(main)/srm-status/page"
import { errorMessage } from "@/utils/messageAlert"
import { io, Socket } from "socket.io-client"
import { Box, Card, Chip, CircularProgress, Paper } from "@mui/material"
import errorHandler from "@/utils/errorHandler"

interface Props {
    onUpdate?: (v: boolean) => void
    onStatus?: (v: SrmRealtimeRoom) => void
}

export default function srmStatus(props: Props) {
    const router = useRouter()
    const [credential, setCredential] = useState<Credential | null>(null)
    const [userId, setUserId] = useState<number>();
    const [companyId, setCompanyId] = useState<number>()
    const [srmResp, setSrmResp] = useState<string>();
    const [realTimeData, setRealTimeData] = useState<SrmRealtimeRoom>()
    const [socketInst, setSocketInst] = useState<Socket | undefined>(undefined);

    const [isLoading, setIsLoading] = useState<boolean>(false)


    useEffect(() => {
        document.title = 'Maunal SRM'
        const credential = JSON.parse(localStorage.getItem('Credential')!) as Credential
        if (!credential) {
            router.push('/login');
            return;
        }

        setCredential(credential)
        setUserId(credential.userData.user_id)
        setCompanyId(credential.userData.company_id)
        setSrmResp(credential.userData.srm_resp)
    }, [])

    const getFirstStatus = async () => {
        setIsLoading(true)
        try {
            const res = await axios.post(`${BASE_API}/get_first_srm_status`, {
                node: srmResp
            })
            if (res.status === 200) {
                setRealTimeData(res.data.data)
            } else {
                throw new Error(res.data.msg)
            }
        } catch (err: any) {
            errorHandler(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (realTimeData && props.onStatus) {
            props.onStatus(realTimeData)
        }
    }, [realTimeData])

    useEffect(() => {
        if (srmResp !== undefined) {
            getFirstStatus();
        }
        const socket: Socket = io(BASE_API);
        setSocketInst(socket);

        socket.on("connect", () => {
            const room = srmResp + "-STATUS-ROOM";
            socket.emit("join_room", { room });
        });

        socket.on("receive_data", (data: any) => {
            if (data.room === srmResp + "-STATUS-ROOM") {
                setRealTimeData((prvData) => ({
                    ...prvData,
                    ...data
                }));
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [srmResp]);

    return (
        <>
            <div className="w-full flex flex-row gap-4 text-sm justify-between">
                <div className="flex-1 flex flex-row gap-2 ">
                    {(isLoading === false) && (
                        <Card
                            className={`${(realTimeData?.online) ? 'bg-green-500' : 'bg-red-500'} text-white px-3 py-4`}>
                            {(realTimeData?.online) ? 'ออนไลน์' : 'ออฟไลน์'}
                        </Card>
                    )}
                    {(isLoading === true) && (
                        <Card
                            className={`bg-white text-black px-3 py-4 flex flex-row justify-center items-center gap-2`}>
                            <CircularProgress size={15} color="inherit" /> กำลังเชื่อมต่อ...
                        </Card>
                    )}
                    <Card
                        className={`px-3 py-4
                        ${(realTimeData?.D0148) ?
                                (realTimeData?.D0148.split('| ')[1] === 'หยุดทำงาน') ? 'text-gray-400' : 'text-blue-500'
                                : null
                            }
                    `}>
                        <span>คำสั่ง (D148) :</span> {(realTimeData?.D0148) ? realTimeData.D0148.split('| ')[1] : '-'}
                    </Card>
                    <Card
                        className={`px-3 py-4 flex flex-row items-center
                        ${(realTimeData?.D0147) ?
                                (realTimeData?.D0147.split('| ')[1] !== 'จอด') ? 'text-blue-500' : 'text-gray-400'
                                : null}
                        `}
                    >
                        {/* {(realTimeData?.D0147.split('| ')[1] !== 'จอด') && (<CircularProgress size="15px" className={`mr-2`} />)} */}
                        <span>สถานะการทำงาน (D147) :</span> {(realTimeData?.D0147) ? realTimeData.D0147.split('| ')[1] : '-'}
                    </Card>
                    <Card
                        className={`px-3 py-4
                        ${(realTimeData?.D0149) ?
                                (realTimeData?.D0149)?.split('| ')[1] !== '-' ? 'text-yellow-600' : 'text-gray-400'
                                : null
                            }
                        `}
                    >
                        <span>สถานะผิดปกติ (D328) :</span> {(realTimeData?.D0328) ? realTimeData.D0328.split('| ')[1] : '-'}
                    </Card>
                </div>
                <div className="flex flex-row gap-2 justify-end ">
                    <Card className={`px-5 py-4`}>
                        <span>X :</span> {(realTimeData?.dist_x) ? Number(realTimeData.dist_x).toLocaleString() + ` mm.` : '-'}
                    </Card>
                    <Card className={`px-5 py-4`}>
                        <span>Y :</span> {(realTimeData?.dist_y) ? Number(realTimeData.dist_y).toLocaleString() + ` mm.` : '-'}
                    </Card>
                </div>
            </div>
        </>
    )
}