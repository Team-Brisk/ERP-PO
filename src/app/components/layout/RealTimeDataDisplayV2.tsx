'use client'

import '@/app/styles/loading.css'
import { useDateConverter } from '@/utils/dateConverter'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconButton } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { BASE_API } from '@/app/(main)/api';
import { getDescription } from "@/models/mcCommu";
import { errorMessage } from '@/utils/messageAlert';

export interface realTimeData {
    D148: string | null,
    D149: string | null,
    D147: string | null,
    distX: string | null,
    distY: string | null,
    pathOPC: string,
}

interface realTimeDataProps {
    pathOpc: string
    craneId: number
    username: string
    onUpdate: (v: string) => void
}

export default function RealTimeDataDisplay2(props: realTimeDataProps) {
    // Socket IO
    const [socketData, setSocketData] = useState<realTimeData>()
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (props.pathOpc !== undefined && props.pathOpc !== null && props.pathOpc.trim() !== '' && props.craneId !== 0) {
            initializeSocket()
        }
    }, [props.craneId, props.pathOpc])

    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
                console.log("WebSocket connection closed on unmount");
            }
        };
    }, [])

    const initializeSocket = () => {
        if (socketRef.current) {
            socketRef.current.close();
        }

        socketRef.current = io(`${BASE_API}`, {
            transports: ["websocket"],
            upgrade: true,
            rememberUpgrade: true,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
            autoConnect: true,
        });

        // Connection handlers
        socketRef.current.on("connect", () => {
            // console.log("Socket Connected:", socketRef.current?.id);
        });

        socketRef.current.emit("join_room", { room: `${props.pathOpc}-STATUS-ROOM` });

        socketRef.current.on("disconnect", (reason: any) => {
            console.log("Socket Disconnected:", reason);
        });

        socketRef.current.on("server_msg", (data) => {
            // console.log("Message from server:", data.message);
        });

        socketRef.current.on("connect_error", (error: any) => {
            console.log("Socket Connection Error:", error);
        });

        socketRef.current.on("connect_error", (error: any) => {
            console.log("Socket Connection Error:", error);
        });

        socketRef.current.emit("register_opc", {
            user_id: props.username,
            opc_path: props.pathOpc,
        }, () => {
            console.log('Register OPC');
        })

        socketRef.current.on("register_opc_done", (data) => {
            console.log("Message from server:", data.message);
        });

        socketRef.current.on("receive_data", async (data: { dist_x: string, dist_y: string, D0147: string, D0148: string, D0149: string, order_work?: string }) => {
            if (data.order_work) {
                props.onUpdate(data.order_work)
            }
            setD147(data.D0147)
            setD148(data.D0148)
            setD149(data.D0149)
            setDistX(data.dist_x)
            setDistY(data.dist_y)
            const desc147 = await getDescription('D147', data.D0147)
            const desc149 = await getDescription('D149', data.D0149)
            setMcStatus(desc147)
            setErrStatus(desc149)
        });
    };

    const [isExpand, setIsExpand] = useState<boolean>(true)
    const [distX, setDistX] = useState<string | null>()
    const [distY, setDistY] = useState<string | null>()
    const [D147, setD147] = useState<string | null>()
    const [D148, setD148] = useState<string | null>()
    const [D149, setD149] = useState<string | null>()

    // machine description
    const [mcStatus, setMcStatus] = useState<string>()
    const [errStatus, setErrStatus] = useState<string>()

    const setMcStatusDescription = async () => {
        if (!D147) {
            console.log(D147, ' UNDEFINED !')
            return 'Unknow Machine status description'
        }
        const desc = await getDescription('D147', D147)
        console.log(desc);

        setMcStatus(desc)
    }

    const setErrMcStatusDescription = async () => {
        if (!D149) return 'Unknow Machine status description'
        const desc = await getDescription('D149', D149)
        setErrStatus(desc)
    }

    return (
        <div
            className={`${!isExpand
                ? 'max-h-[70px]'
                : 'max-h-[900px]'} 
            card-expand w-full p-2 rounded-md card-minimal flex flex-col gap-3`}
        >
            <div className={`flex flex-row justify-between pt-3`}>
                <span className='font-extralight px-2 text-lg flex items-end '>
                    {(props.pathOpc !== undefined) && (
                        <div className=''>
                            สถานะการทำงานตอนนี้ | <span className='text-sm text-gray-500'>{props.pathOpc}</span>
                        </div>
                    )}
                </span>
                <div className='relative flex flex-row gap-2 justify-end'>
                    <span className='font-extralight px-2 text-sm flex items-end text-gray-500 pr-[40px]'>
                        อัพเดตล่าสุด: {useDateConverter(String(new Date()), 'th-TH')}
                    </span>
                    <IconButton className={`${!isExpand ? 'rotate-0' : 'rotate-180'} absolute top-0 duration-50 transition-transform`}
                        color='inherit'
                        onClick={() => {
                            setIsExpand(!isExpand)
                        }}
                    >
                        <ExpandMoreIcon
                            fontSize={'small'}
                        />
                    </IconButton>
                </div>
            </div>
            <hr />
            <div className=' w-full flex flex-row gap-3'>
                {/* <div className='w-full rounded-md obj-center py-4'>
                    <div className='loader text-black'></div>
                </div> */}
                <div className='w-1/2 rounded-md obj-center border-2'>
                    <div className='flex flex-col gap-2 items-center text-gray-600 text-2xl py-4'>
                        <span className='font-extrabold'>X</span>
                        {(distX !== undefined) ? (
                            <span> {distX} </span>
                        ) : (
                            <span> - </span>
                        )}
                    </div>
                </div>
                <div className='w-1/2 rounded-md obj-center border-2'>
                    <div className='flex flex-col gap-2 items-center text-gray-600 text-2xl py-4'>
                        <span className='font-extrabold'>Y</span>
                        {(distY !== undefined) ? (
                            <span> {distY} </span>
                        ) : (
                            <span> - </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-row gap-3 justify-center items-center">
                <div className="w-1/2 flex flex-col gap-3 py-2 h-full justify-center items-center border-2 rounded-md">
                    <div className="w-full h-auto flex flex-col gap-1 items-center justify-center rounded-lg text-green-400">
                        {(D147 !== undefined) ? (
                            <span className="text-3xl font-extrabold"> {D147} </span>
                        ) : (
                            <span className="text-3xl font-extrabold"> - </span>
                        )}
                        <span className="text-lg font-extrabold">Machine Status</span>
                        <span className="text-lg font-extralight"> {mcStatus} </span>
                    </div>
                </div>
                <div className="w-1/2 flex flex-col gap-3 py-2 h-full justify-center items-center border-2 rounded-md">
                    <div className="w-full h-auto flex flex-col gap-1 items-center justify-center rounded-lg text-red-400">
                        {(D149 !== undefined) ? (
                            <span className="text-3xl font-extrabold"> {D149} </span>
                        ) : (
                            <span className="text-3xl font-extrabold"> - </span>
                        )}
                        <span className="text-lg font-extrabold">Machine Error</span>
                        <span className="text-lg font-extralight"> {errStatus}</span>
                    </div>
                </div>
            </div>
        </div >
    )
}