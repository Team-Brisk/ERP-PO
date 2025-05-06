import axios from "axios";
import { useState, useEffect } from "react";
import { BASE_API } from "../(main)/api";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

const socket = io(BASE_API);

interface QueueListProps {
    queueList: any[];
    idWcs: string;
    craneId: number;
    siteId: number;
    refreshQueue: () => void;
}

export default function QueueList({ queueList, craneId, siteId, idWcs, refreshQueue }: QueueListProps) {
    const [isRunning, setIsRunning] = useState(false);
    const [userId, setUserId] = useState<any>();
    const [pathOpc, setPathOpc] = useState<string>('');


    // เรียงลำดับ: กำลังทำงานก่อน ตามด้วยรอคิว และเรียงตาม queue.queue
    const sortedQueue = [...queueList].sort((a, b) => {
        if (a.status === "1" && b.status === "0") return -1;
        if (a.status === "0" && b.status === "1") return 1;
        return a.queue - b.queue;
    });

    useEffect(() => {
        // socket.on("queue_update", (data: any) => {
        //     console.log("Queue update received:", data);
        //     refreshQueue();
        // });
        // return () => {
        //     socket.off("queue_update");
        // };
    }, [refreshQueue]);

    useEffect(() => {
        const credential: any = JSON.parse(localStorage.getItem('Credential')!);
        setUserId(credential.userData.user_id);
        setPathOpc(credential.userData.srm_resp);
    }, []);

    const handleRunQueue = async () => {
        setIsRunning(true);
        try {
            const response = await axios.post(`${BASE_API}/test_run_queue`, {
                craneId,
                siteId,
                userId,
                idWcs,
                pathOpc
            });
            console.log("Queue run response:", response.data);
            refreshQueue();
        } catch (error) {
            console.error(error);
        }
        setIsRunning(false);
    };

    // กำหนด variants สำหรับ animation ของแต่ละรายการ
    const itemVariants = {
        initial: { opacity: 0, x: -100 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 100 }
    };

    return (
        <div className="max-w-lg mx-auto" style={{ fontFamily: "TT-HovesPro-TrialRegular, sans-serif" }}>
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
                รายการคิวทั้งหมด
            </h2>
            <div className="text-center mb-4">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
                    onClick={handleRunQueue}
                    disabled={isRunning}
                >
                    {isRunning ? "กำลังทำงาน..." : "ทดลองรันคิว"}
                </button>
            </div>
            {sortedQueue.length > 0 ? (
                <AnimatePresence>
                    {sortedQueue.map((queue, index) => (
                        <motion.div
                            key={queue.id}
                            layout
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={itemVariants}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            className={`p-4 rounded-lg shadow-md border flex items-center gap-4 mb-3 ${queue.status === "1" ? "bg-yellow-100 border-yellow-300" :
                                queue.status === "2" ? "bg-green-100 border-green-300" :
                                    "bg-gray-100 border-gray-300"
                                }`}
                        >
                            <div className="text-lg font-semibold text-gray-700 w-10 text-center" style={{ color: "#ff7e36", fontFamily: "TT-HovesPro-TrialRegular, sans-serif" }}>
                                {index + 1}
                            </div>
                            <div className="flex-1 flex justify-between items-center" style={{ fontFamily: "TT-HovesPro-TrialRegular, sans-serif" }}>
                                <div>
                                    <p className="text-sm text-gray-600">Barcode</p>
                                    <p className="font-medium text-gray-800">{queue.barcode}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Queue</p>
                                    <p className="font-medium text-gray-800">{queue.queue}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Status</p>
                                    <p className={`font-medium ${queue.status === "1" ? "text-yellow-700" :
                                        queue.status === "2" ? "text-green-700" :
                                            "text-gray-500"
                                        }`}>
                                        {queue.status === "1" ? "กำลังทำงาน..." :
                                            queue.status === "2" ? "เสร็จสิ้น" :
                                                "รอคิว"}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            ) : (
                <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg shadow-md">
                    ไม่มีคิวที่รอหรือกำลังทำงาน
                </div>
            )}
        </div>
    );
}
