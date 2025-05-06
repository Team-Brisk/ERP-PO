
'use client'

import { useEffect, useRef, useState } from "react";
import { BASE_API } from "@/app/(main)/api";
import io, { Socket } from "socket.io-client";
import axios from '@/app/config/axiosConfig';
import { errorMessage } from "@/utils/messageAlert";
import Chip from '@mui/material/Chip';
import { Card, CircularProgress, Divider, ToggleButton } from "@mui/material";
import SRMCommandBtn from "@/app/components/button/SRMCommandBtn";
import { Credential, Role } from "@/models/users";
import { useRouter } from "next/navigation";
import { useStoreData } from "@/app/hooks/useStoreData";
import { AnimatePresence, motion } from "framer-motion";

export interface SrmRealtimeRoom {
    dist_x: string | number;
    dist_y: string | number;
    D0147: string;
    D0148: string;
    D0149: string;
    D0328: string;
    online: boolean;
    room: string;
    status?: string;
    order_work?: string
}

export default function SrmStatus() {

    const router = useRouter()

    const setPageTitle = useStoreData((state) => state.setPageTitle)

    const [opcData, setOpcData] = useState<SrmRealtimeRoom[]>([]);
    const [socketInst, setSocketInst] = useState<Socket | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<Role>(0)

    const hasCalledRef = useRef(false);

    const nodes = [
        'LINE01-MP', 'LINE02-MP', 'LINE03-MP', 'LINE04-MP',
        'LINE05-MP', 'LINE06-MP', 'LINE07-MP', 'LINE08-MP'
    ];

    useEffect(() => {
        setPageTitle('สถานะเครน')
        document.title = 'สถานะเครน'
        if (!hasCalledRef.current) {
            getFirstStatusRoom();
            hasCalledRef.current = true;
        }

        const credential = JSON.parse(localStorage.getItem('Credential')!) as Credential
        if (!credential) {
            router.push('/login');
            return;
        }
        const role = credential.userData.role
        setRole(role)

        const socket: Socket = io(BASE_API);
        setSocketInst(socket);

        let rooms = nodes.map(room => room + '-STATUS-ROOM');

        socket.on("connect", () => {
            rooms.forEach(room => socket.emit("join_room", { room }));
        });

        socket.on("receive_data", (data: any) => {
            const { room } = data;
            if (room) {
                setOpcData((prev) => {
                    const index = prev.findIndex(item => item.room === room);
                    if (index !== -1) {
                        const updatedRoom = { ...prev[index], ...data };
                        const newArr = [...prev];
                        newArr[index] = updatedRoom;
                        return newArr;
                    }
                    return [...prev, data];
                });
            } else {
                console.warn("Received data without room info:", data);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const getFirstStatusRoom = async () => {
        try {
            const res = await axios.post(`${BASE_API}/get_current_srm_status`, { nodes: JSON.stringify(nodes) });
            const srmRealTime = res.data.nodes as SrmRealtimeRoom[];
            setOpcData(srmRealTime);
        } catch (err: any) {
            errorMessage(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 text-black bg-gray-50 min-h-screen w-full">
            <div className=" w-full flex justify-center items-center">
                {loading ? (
                    <div className="w-full h-[calc(100vh-128px)] flex justify-center items-center">
                        <CircularProgress size={50} />
                    </div>
                ) : (opcData.length === 0) ? (
                    <div className="w-full h-full flex justify-center items-center">
                        <p className="text-gray-500 col-span-full text-center">ไม่มีข้อมูลแสดงผล</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full h-full">
                        {opcData.map((roomData, index) => (
                            <Card className="relative bg-white p-4 rounded-md border h-full"
                                key={roomData.room || index}>
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold text-gray-700">
                                        {roomData.room?.split('-')[0]}
                                    </h2>
                                    <div className="flex justify-end gap-2">
                                        {(role === 1 || role === 2) &&
                                            (<>
                                                <SRMCommandBtn
                                                    isDisable={(roomData?.online) ? false : true}
                                                    size="small"
                                                    pathOpc={roomData.room?.split('-')[0] + '-MP'} />
                                            </>)
                                        }
                                        <ToggleButton
                                            onClick={(e) => e.preventDefault()}
                                            sx={{
                                                pointerEvents: "none",
                                                '&:hover': { backgroundColor: 'transparent' },
                                                '&:focus': { outline: 'none', boxShadow: 'none' },
                                                '&:active': { backgroundColor: 'transparent' }
                                            }}
                                            className={`${(roomData?.online)
                                                ? 'text-white bg-green-500'
                                                : 'bg-red-500 text-white'} font-extrabold px-3`}
                                            size="small"
                                            value={'unknow'}
                                        >
                                            <span>
                                                {(roomData?.online) ? 'ออนไลน์' : 'ออฟไลน์'}
                                            </span>
                                        </ToggleButton>
                                    </div>
                                </div>

                                <hr className="my-2 border-gray-300" />

                                <div className="text-sm space-y-1">
                                    <div className="flex justify-between">
                                        <span className="">สถานะ:</span>
                                        <span className="font-medium">
                                            {roomData.D0147?.split(' |')?.[1] ?? '-'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between ">
                                        <span>คำสั่ง:</span>
                                        <span>{roomData.D0148?.split(' |')?.[1] ?? '-'}</span>
                                    </div>
                                    <div className="flex justify-between ">
                                        <span>สถานะผิดปกติ:</span>
                                        <span>{roomData.D0328?.split(' |')?.[1] ?? '-'}</span>
                                    </div>
                                    <div className="flex justify-between ">
                                        <span>ตรวจสอบสินค้า:</span>
                                        <span>{(roomData.order_work) ? roomData.order_work : '-'}</span>
                                    </div>

                                    <div className="flex w-full justify-end text-sm text-gray-600">
                                        X: {new Intl.NumberFormat().format(Number(roomData.dist_x))} |
                                        Y: {new Intl.NumberFormat().format(Number(roomData.dist_y))}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
