"use client";

import { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
// import "../selected/selected.scss";
import "../(main)/selected/selected.scss";
import { Alert, Snackbar } from "@mui/material";
import axios from '@/app/config/axiosConfig';
import { getDescription } from "@/models/mcCommu";
import { BASE_API } from "@/app/(main)/api";

interface RealTimeDataDisplayProps {
  pathOpc: string;
  crane: string;
  bank: string;
  bay: string;
  level: string;
  ids: string;
}

export default function RealTimeDataDisplay({
  pathOpc,
  crane,
  bank,
  bay,
  level,
  ids,
}: RealTimeDataDisplayProps) {
  const [dataRealTime, setDataRealTime] = useState<any>(null);
  const dataRealTimeRef = useRef<any>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 2000; // 2 seconds
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [isSocketInitialized, setIsSocketInitialized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const previousD0148Ref = useRef<string | null>(null);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [startAi, setStartAi] = useState(null);
  const [D0147, setD0147] = useState<any | null>(null);
  const [D0149, setD0149] = useState<any | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString());
  }, []);

  const check_process_video = async () => {
    try {
      const response = await axios.post(
        `${BASE_API}/check_process_video`,
        {
          in_id: ids,
        }
      );

      // ถ้า process สำเร็จ
      if (response.status === 200) {
        console.log("Video processed successfully:", response.data);
        let check = response.data?.exists_in_image_processing;
        setStartAi(check);
        console.log(check);
      }
    } catch (error: any) { }
  };

  const handleProcessVideo = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const response = await axios.post(
        `${BASE_API}/process_video`,
        {
          input_id: ids,
          crane_id: crane
        }
      );

      // ถ้า process สำเร็จ
      if (response.status === 200) {
        console.log("Video processed successfully:", response.data);
        // อัพเดทข้อมูลหรือ UI ตามต้องการ
      } else {

        processingTimeoutRef.current = setTimeout(() => {
          handleProcessVideo();
        }, 10000);
      }
    } catch (error: any) {
      processingTimeoutRef.current = setTimeout(() => {
        handleProcessVideo();
      }, 10000);
    } finally {
      setIsProcessing(false);
    }
  };

  // Initialize socket connection

  const initializeSocket = () => {
    // console.log(pathOpc);

    if (socketRef.current) {
      socketRef.current.close();
    }

    socketRef.current = io(`${BASE_API}`, {
      transports: ["polling", "websocket"],
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
      console.log("Socket Connected:", socketRef.current?.id);
      setIsConnected(true);
      reconnectAttempts.current = 0;
    });

    socketRef.current.on("disconnect", (reason: any) => {
      console.log("Socket Disconnected:", reason);
      setIsConnected(false);

      if (reconnectAttempts.current < maxReconnectAttempts) {
        setTimeout(() => {
          // console.log(
          //   `Attempting to reconnect (${
          //     reconnectAttempts.current + 1
          //   }/${maxReconnectAttempts})`
          // );
          reconnectAttempts.current++;
          socketRef.current?.connect();
        }, reconnectDelay);
      } else {
        setAlertMessage(
          "Maximum reconnection attempts reached. Please refresh the page."
        );
        setAlertOpen(true);
      }
    });

    socketRef.current.on("connect_error", (error: any) => {
      console.log("Socket Connection Error:", error);
      setAlertMessage(`Connection error: ${error.message}`);
      setAlertOpen(true);
    });

    socketRef.current.on("receive_data", async (data: any) => {
      dataRealTimeRef.current = data;
      setDataRealTime(data);
      // console.log(data);

      const currentD0148 = data.D0148;
      const previousD0148 = previousD0148Ref.current;
      const statusCode = data?.D0147; // ตัวอย่างค่าจาก Real-Time Data
      const errorCode = data?.D0149;
      const statusDescription = await getDescription("D147", statusCode);
      const errorDescription = await getDescription("D149", errorCode);
      setD0147(statusDescription);
      setD0149(errorDescription);

      if (!startAi) {
        // เมื่อค่าเป็น 0 หรือเปลี่ยนจากค่าอื่นมาเป็น 0
        if (currentD0148 === "0" && (!previousD0148 || previousD0148 !== "0")) {
          handleProcessVideo();
        }
      }

      previousD0148Ref.current = currentD0148;
    });

    setIsSocketInitialized(true);
  };


  useEffect(() => {
    // Send pathOpc to backend
    const sendPathOpcToBackend = async () => {
      if (!pathOpc) {
        console.log("pathOpc is empty, skipping request");
        return;
      }

      try {
        await axios.post(`${BASE_API}/set_opc_path`, {
          path: pathOpc,
        });
        initializeSocket();
        await check_process_video();
      } catch (error) {
        console.error("Error sending pathOpc to backend:", error);
        setAlertMessage("Failed to send pathOpc to backend.");
        setAlertOpen(true);
      }
    };

    sendPathOpcToBackend();

    // Cleanup on component unmount
    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.close();
      }
    };
  }, [pathOpc, startAi]);

  const RealTime = () => {
    if (!dataRealTime) {
      return (
        <div
          style={{
            color: "#333",
            marginTop: "20px",
            padding: "15px",
            background: "rgba(240, 240, 240, 1)",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0" }}>Real-time OPC Data</h3>
          <p style={{ color: "#666" }}>Waiting for OPC data...</p>
        </div>
      );
    }

    return (
      <div
        style={{
          color: "#333",
          marginTop: "20px",
          padding: "15px",
          background: "rgba(240, 240, 240, 1)",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      >
        <h3 style={{ margin: "0 0 15px 0" }}>Real-time OPC Data</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginBottom: "15px",
          }}
        >
          <div
            style={{
              padding: "10px",
              background: "rgba(255, 255, 255, 1)", // สีขาวสำหรับ light mode
              borderRadius: "4px",
              boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", // เพิ่มเงาเล็กน้อย
            }}
          >
            <div
              style={{ fontSize: "0.9em", color: "#666", textAlign: "center" }}
            >
              X
            </div>
            <div
              style={{
                fontSize: "1.2em",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {dataRealTime.dist_x}
            </div>
          </div>
          <div
            style={{
              padding: "10px",
              background: "rgba(255, 255, 255, 1)", // สีขาว
              borderRadius: "4px",
              boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ fontSize: "0.9em", color: "#666" }}>Y</div>
            <div style={{ fontSize: "1.2em", fontWeight: "bold" }}>
              {dataRealTime.dist_y}
            </div>
          </div>
        </div>
        <div
          style={{
            fontSize: "0.8em",
            color: "#666",
            textAlign: "right",
            borderTop: "1px solid #ccc", // เส้นขอบอ่อนสำหรับ light mode
            paddingTop: "10px",
          }}
        >
          Last Updated: {lastUpdated}
        </div>
      </div>
    );
  };

  return (
    <>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      <div className="flex-cus">
        <RealTime />
        <div className=" bg0-cus rounded-xl shadow-lg p-6">
          <div className="w-full text-lg flex-cus-in text-black">
            <p>Macchine Status : {dataRealTime?.D0147}</p>
            <p>Discription : {D0147}</p>
            <p>Macchine Error : {dataRealTime?.D0149} </p>
            <p>Discription : {D0149}</p>
          </div>
        </div>
      </div>
    </>
  );
}
