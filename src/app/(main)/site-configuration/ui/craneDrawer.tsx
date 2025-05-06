"use client";

import axios from '@/app/config/axiosConfig';
import { useEffect, useState } from "react";
import { BASE_API } from "../../api";
import { Camera } from "@/models/camera";
import { Bank } from "@/models/bank";
import { Box, Button, Divider, Drawer, TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { errorMessage, successMessage } from "@/utils/messageAlert";
import MsgAlert from "@/utils/sweetAlert";
import RenderCamera from "./RenderCamera";
import RenderBank from "./RenderBank";

interface CraneDrawerProps {
  isOpen: boolean;
  craneId: number;
  onClose: () => void;
  onUpdate: () => void;
}

interface CraneDetail {
  crane_id: number;
  crane_name: string;
  delete_status: boolean;
}

interface CraneData {
  crane_id: number | string;
  crane_name: string;
  path_opc: string;
  site_id: number | string;
  camera: Array<Camera>;
  bank: Array<Bank>;
}

/**
 * Drawer สำหรับการแสดงผลข้อมูลของ Crane อย่างละเอียด 
 * @param crane_id ส่ง crane id มาเพื่อดึงข้อของ crane นั้นๆ โดยจะส่งกลับมาพร้อข้อมูลของ camera และ bank 
 * @param isOpen ส่งสถานะการเปิด/ปิด drawer มา
 * @param onClose ฟังก์ชันสำหรับการปิด drawer เพื่อให้ siteRender อัพเดตสถานะของการเปิด/ปิด drawer
 * @param onUpdate ฟังกฺชันสำหรับการอัพเดตสถานะที่ siteRender ในการเรียกข้อมูลใหม่ให้เป็นปัจจุบัน ในกรณีที่ข้อมูลของ crane มีการแก้ไข
 * 
 * @returns 
 */
export default function CraneDrawer(props: CraneDrawerProps) {

  const _msg = new MsgAlert()

  const [craneData, setCraneData] = useState<CraneData>();
  const [craneDetail, setCraneDetail] = useState<CraneDetail>();

  const [newCraneName, setNewCraneName] = useState<string>("");
  const [newPathOpc, setNewPathOPC] = useState<string>("");
  const [newIdWcs, setNewIdWcs] = useState<string>("");

  const [loading, setLoading] = useState(false)
  const [delLoading, setDelLoading] = useState(false)

  useEffect(() => {
    if (props.isOpen === true) {
      getCraneDetail();
    }
  }, [props.isOpen]);

  const getCraneDetail = async () => {
    try {
      const res = await axios.post(`${BASE_API}/get_crane_detail`, {
        crane_id: props.craneId,
      });

      setCraneDetail({
        crane_id: res.data.craneData.crane_id,
        crane_name: res.data.craneData.crane_name,
        delete_status: res.data.craneData.delete_status,
      });

      setNewCraneName(res.data.craneData.crane_name);
      setNewPathOPC(res.data.craneData.path_opc);
      setNewIdWcs(res.data.craneData.id_wcs);
      setCraneData(res.data.craneData);
    } catch (err) {
      console.log(err);
    }
  };

  const updateCrane = async () => {
    try {
      setLoading(true)
      const data = {
        crane_id: craneDetail!.crane_id,
        crane_name: newCraneName,
        path_opc: newPathOpc,
        id_wcs: newIdWcs
      }
      const res = await axios.post(`${BASE_API}/update_crane`, data)
      if (res.status === 200) {
        successMessage(res.data.msg)
        getCraneDetail()
        props.onUpdate()
      } else {
        throw new Error(res.data.msg)
      }
    } catch (err: any) {
      console.log(err);
      _msg.default_msg({
        title: 'Error',
        icon: 'error',
        msg: err,
        cancelBtn: true,
        cancelText: 'Close',
      })
    } finally {
      setLoading(false)
    }
  }


  const deleteCrane = async () => {
    _msg.confirm('ต้องการลบเครนใช่ไหม').then(async (isConfirmed) => {
      if (isConfirmed) {
        try {
          setDelLoading(true)
          const res = await axios.post(`${BASE_API}/delete_crane`, {
            crane_id: props.craneId,
            delete_status: !craneDetail!.delete_status
          })

          if (res.status === 200) {
            successMessage(res.data.msg)
            props.onUpdate()
            props.onClose()
          } else {
            throw new Error(res.data.msg)
          }
        } catch (err: any) {
          console.log(err);
          errorMessage({
            message: err.message
          })
        } finally {
          setDelLoading(false)
        }
      }
    })
  }

  return (

    <Drawer open={props.isOpen} anchor={"right"} hideBackdrop={true} className='shadow-none'>
      <Box sx={{ width: 1000 }} role="presentation" className="h-full pt-16">
        <div className="w-full h-full flex flex-col ">
          <div className="w-full flex flex-row justify-start items-center px-8">
            <CloseIcon
              onClick={() => props.onClose()}
              className="text-orange font-extrabold text-4xl cursor-pointer hover:scale-[1.1] duration-300"
            />
            <div className="flex flex-row p-6 text-orange text-2xl font-extrabold gap-2 justify-center items-center">
              <span>SRM : {craneDetail?.crane_name}</span>
            </div>
          </div>
          <Divider />
          <div className="w-full flex flex-col px-6 mt-4 gap-4">
            <TextField
              size="small"
              value={newCraneName}
              onChange={(e) => setNewCraneName(e.target.value)}
              className="w-full"
              label="ชื่อเครน"
              variant="outlined"
            ></TextField>
            <div className="w-full flex flex-row gap-2">
              <TextField
                size="small"
                value={newPathOpc}
                onChange={(e) => setNewPathOPC(e.target.value)}
                className="w-1/2"
                label="OPC Node"
                variant="outlined"
              ></TextField>
              <TextField
                size="small"
                value={newIdWcs}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    if (value.length <= 2) {
                      setNewIdWcs(e.target.value)
                    }
                  }
                }
                }
                className="w-1/2"
                label="ID WCS"
                placeholder="ลำดับของเครนใน WCS เช่น 1 , 2 , 3"
                variant="outlined"
              ></TextField>
            </div>
            <div className="w-full flex justify-end">
              <TextField
                size="small"
                className="w-5/6 invisible"
                variant="outlined"
              ></TextField>
              <Button
                loading={loading}
                size="large"
                variant='outlined'
                color='primary'
                onClick={() => {
                  updateCrane()
                }}
              >
                บันทึก
              </Button>
            </div>
          </div>
          {craneData?.camera !== undefined && (
            <RenderCamera
              craneId={props.craneId}
              cameras={craneData.camera}
              onUpdate={() => {
                getCraneDetail()
                props.onUpdate()
              }}
            >
            </RenderCamera>
          )
          }

          {craneData?.bank !== undefined && (
            <RenderBank
              craneId={props.craneId}
              banks={craneData.bank}
              onUpdate={() => {
                getCraneDetail()
                props.onUpdate()
              }}
            ></RenderBank>
          )

          }

          <div className="w-full py-4 px-6">
            <Button
              loading={delLoading}
              variant='outlined'
              size='large'
              color='error'
              onClick={() => {
                deleteCrane()
              }}
            >
              ลบเครน
            </Button>
          </div>
        </div>

      </Box>
    </Drawer>

  )
}
