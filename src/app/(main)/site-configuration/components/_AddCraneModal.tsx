"use client";

import axios from '@/app/config/axiosConfig';
import { BASE_API } from "@/app/(main)/api";
import MsgAlert from "@/utils/sweetAlert";
import { useEffect, useState } from "react";
import { Box, Button, Card, Divider, FormControl, Modal, TextField } from "@mui/material";

interface AddCraneModalProps {
  siteId: number;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

/**
 * Modal สำหรับการเพิ่ม Crane ของ site งานนั้นๆ
 * @param isOpen สถานะการเปิด/ปิด modal
 * @param siteId ส่ง site id มาเพื่ออ้างอิงในการเพิ่่ม crane ใน site งานนั้นๆ
 * @param onClose ส่ง event สำหรับการปิด modal ไปให้้ parent
 * @param onUpdate ส่ง event สำหรับการอัพเดตไปให้ parent เพื่อ trigger ฟังก์ชันที่ parent ในการอัพเดต data
 * 
 * @returns 
 */
export default function AddCraneModal(props: AddCraneModalProps) {
  const _msg = new MsgAlert();

  const [craneName, setCraneName] = useState<string>("");
  const [pathOpc, setPathOpc] = useState<string>("");
  const [idWcs, setIdWcs] = useState<string>("");
  const [loading, setLoading] = useState(false)

  const addCrane = async () => {
    try {
      setLoading(true)
      const data = {
        crane_name: craneName,
        path_opc: pathOpc,
        site_id: props.siteId,
        id_wcs: idWcs,
      };

      const res = await axios.post(`${BASE_API}/add_crane`, data);
      if (res.status === 201) {
        _msg.toast_msg({
          title: res.data.msg,
          icon: "success",
          timer: 5,
          progressbar: true,
        });

        props.onUpdate();
        setCraneName("");
        setPathOpc("");
        setIdWcs("");
      } else {
        throw new Error(res.data.msg);
      }
    } catch (err: any) {
      console.log(err);
      _msg.default_msg({
        title: "Error",
        icon: "error",
        msg: err,
        cancelBtn: true,
        cancelText: "Close",
      });
    } finally {
      setLoading(false)
    }
  };

  return (
    
      <Modal className="modal" open={props.isOpen}>
        <Box className="w-[600px]">
          <Card className="w-full flex flex-col gap-2 p-4">
            <h1 className="text-2xl text-black font-extralight pt-4">เพิ่มเครน</h1>
            <Divider></Divider>
            <div className="w-full mt-2 flex flex-col gap-2">
              <FormControl className="w-full flex flex-col gap-4">
                <TextField
                  size='medium'
                  value={craneName}
                  onChange={(e) => setCraneName(e.target.value)}
                  className="w-full"
                  label="ชื่อเครน"
                  variant="outlined"
                ></TextField>
                <TextField
                  size='medium'
                  value={pathOpc}
                  onChange={(e) => setPathOpc(e.target.value)}
                  className="w-full"
                  label="OPC Node"
                  placeholder="e.g. LINE01 MP"
                  variant="outlined"
                ></TextField>
                <TextField
                  value={idWcs}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      if (value.length <= 2) {
                        setIdWcs(e.target.value)
                      }
                    }
                  }
                  }
                  size='medium'
                  className="w-full"
                  label="ID WCS "
                  placeholder="ลำดับของเครนใน WCS เช่น 1 , 2 , 3"
                  variant="outlined"
                ></TextField>
              </FormControl>
            </div>
            <div className="w-full flex justify-end items-center gap-2 mt-6">
              <Button
                size='large'
                variant='outlined'
                color='error'
                onClick={props.onClose}
              >
                ยกเลิก
              </Button>
              <Button
                loading={loading}
                size='large'
                variant='outlined'
                color='primary'
                onClick={() => addCrane()}
              >
                เพิ่มเครน
              </Button>
            </div>
          </Card>
        </Box>
      </Modal>
    
  );
}
