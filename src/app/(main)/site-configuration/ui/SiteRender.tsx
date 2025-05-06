'use client';

import { Site } from '@/models/site';
import { useEffect, useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import UpdateSiteModal from '@/app/(main)/site-configuration/components/_UpdateSiteModal';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from '@/app/config/axiosConfig';
import { BASE_API } from '../../api';
import MsgAlert from '@/utils/sweetAlert';
import CraneDrawer from './craneDrawer';
import AddCraneModal from '../components/_AddCraneModal';
import { useStoreData } from '@/app/hooks/useStoreData';
import { motion } from 'framer-motion';
import { Card, Divider, ToggleButton, Tooltip } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';

interface SiteRenderProps {
  siteData: Array<Site>;
  onUpdate: () => void;
}

/**
 * ใช้ในการแสดงผลหน้า site configuration ที่ประกอบไปด้วย site > crane > cameran and bank 
 * @param siteData ส่งข้อมูลสรุปของ Site มาเพื่อแสดงผล 
 * @returns 
 */
export default function SiteRender(props: SiteRenderProps) {
  const _msg = new MsgAlert();
  const setDrawer = useStoreData((state) => state.setDrawer)

  const [siteData, setSiteData] = useState<Array<Site>>([]);
  const [siteId, setSiteId] = useState<number>(0);
  const [isOpenSiteUpdate, setIsOpenSiteUpdate] = useState<boolean>(false);
  const [isOpenAddCraneModal, setIsOpenAddCraneModal] = useState<boolean>(false);

  const [craneId, setCraneId] = useState<number>();

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  useEffect(() => {
    if (isDrawerOpen === true) {
      setDrawer(false)
    }
  }, [isDrawerOpen]);

  useEffect(() => {
    setSiteData(props.siteData);
  }, [props.siteData]);


  // const deleteSite = async (data: { site_id: any; delete_status: boolean }) => {
  //   try {
  //     _msg.confirm('ต้องการลบไซต์งานใช่ไหม').then(async (isConfirmed) => {
  //       if (isConfirmed) {
  //         const res = await axios.post(`${BASE_API}/delete_site`, data);
  //         if (res.status === 200) {
  //           _msg.toast_msg({
  //             title: res.data.msg,
  //             icon: 'success',
  //             timer: 5,
  //             progressbar: true,
  //           });

  //           // reset data
  //           props.onUpdate();
  //         } else {
  //           throw new Error(res.data.msg);
  //         }
  //       }
  //     });
  //   } catch (err: any) {
  //     console.log(err);
  //     _msg.default_msg({
  //       title: 'Error',
  //       icon: 'error',
  //       msg: err,
  //       cancelBtn: true,
  //       cancelText: 'Close',
  //     });
  //   }
  // };
  return (
    <>
      <UpdateSiteModal
        isOpen={isOpenSiteUpdate}
        siteId={siteId}
        onUpdate={() => props.onUpdate()}
        onClose={() => setIsOpenSiteUpdate(false)}
      ></UpdateSiteModal>
      <div className='w-full flex flex-col px-4 pb-4'>
        {siteData.map((site) => (
          <motion.div key={site.site_id}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: 'easeInOut', duration: 0.25 }}
          >
            <div className='w-full rounded-md' key={site.site_id}>
              <div className='w-full rounded-md flex flex-col gap-4'>
                <div className='w-full flex flex-row gap-2'>
                  <ToggleButton
                    value={'unknow'}
                    sx={{
                      pointerEvents: "none",
                      '&:hover': { backgroundColor: 'transparent' },
                      '&:focus': { outline: 'none', boxShadow: 'none' },
                      '&:active': { backgroundColor: 'transparent' }
                    }}
                    className='text-md bg-white font-extralight flex items-center w-fit'>
                    {site.site_name}
                  </ToggleButton>
                  <div className='w-fit flex flex-row gap-2 items-center justify-center'>
                    <ToggleButton
                      value={'Add SRM'}
                      onClick={() => {
                        setIsOpenAddCraneModal(true)
                        setSiteId(Number(site.site_id))
                      }}
                      color='primary'
                      className='text-md bg-white px-6'
                    >
                      เพิ่มเครน
                    </ToggleButton>
                    <ToggleButton
                      value={'Edit'}
                      color='secondary'
                      onClick={() => {
                        setSiteId(Number(site.site_id));
                        setIsOpenSiteUpdate(true);
                      }}
                      className='text-md rounded-md bg-white'
                    >
                      <SettingsIcon />
                    </ToggleButton>
                  </div>
                </div>
                {site.crane?.length ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full h-full">
                    {site.crane.map((crane, index) => (
                      <Card
                        key={crane.crane_id}
                        className="relative bg-white p-4 flex flex-col gap-4">
                        <div className='w-full flex flex-row justify-between items-center'>
                          <div className='text-lg font-semibold text-gray-700'>
                            {crane.crane_name}
                          </div>
                          <div className='flex flex-row gap-2'>
                            {crane.camera?.length === 0 ? (
                              <span className='text-red-400'>-</span>
                            ) : (
                              crane.camera?.map((camera) => (
                                <Tooltip
                                  key={camera.camera_id}
                                  placement='top'
                                  title={`กล้อง ${camera.camera_direction} ${(camera.camera_activate === 1) ? ' เปิดใช้งาน' : 'ยังไม่เปิดใช้งาน'}`}
                                >
                                  <ToggleButton
                                    sx={{
                                      pointerEvents: "none",
                                      '&:hover': { backgroundColor: 'transparent' },
                                      '&:focus': { outline: 'none', boxShadow: 'none' },
                                      '&:active': { backgroundColor: 'transparent' }
                                    }}
                                    key={camera.camera_id}
                                    size='small'
                                    value={camera.camera_id}
                                    className={`${camera.camera_activate ? 'text-green-400' : 'text-red-400'}`}
                                  >
                                    <VideocamIcon />
                                  </ToggleButton>
                                </Tooltip>

                              ))
                            )}
                            <ToggleButton
                              size='small'
                              className='px-4'
                              value={'unknow'}
                              onClick={() => {
                                setCraneId(Number(crane.crane_id));
                                setIsDrawerOpen(true);
                              }}
                            >
                              แก้ไข
                            </ToggleButton>
                          </div>
                        </div>
                        <Divider></Divider>
                        <div className='w-full flex flex-col gap-0 text-md'>
                          <div className='w-full flex justify-between'>
                            <span className='font-medium'>OPC Node</span>
                            <span>{crane.path_opc}</span>
                          </div>
                          <div className='w-full flex justify-between'>
                            <span className='font-medium'>ID WCS</span>
                            <span>{crane.id_wcs}</span>
                          </div>
                          <div className='w-full flex justify-between'>
                            <span className='font-medium'>Bank</span>{' '}
                            {crane.bank?.length === 0 ? (
                              <span className='text-red-400'>-</span>
                            ) : (
                              <span>{crane.bank?.length}</span>
                            )}
                          </div>
                        </div>

                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className='w-full h-[150px] obj-center text-2xl font-extralight text-red-500 bg-gray-50 rounded-xl flex items-center justify-center'>
                    ยังไม่มีการกำหนดเครนในไซต์งานนี้
                  </div>
                )}

              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {(craneId !== undefined) && (
        <div>
          <CraneDrawer
            isOpen={isDrawerOpen}
            craneId={craneId}
            onClose={() => setIsDrawerOpen(false)}
            onUpdate={() => props.onUpdate()}
          ></CraneDrawer>
        </div>
      )}

      {siteId !== 0 && (
        <div>
          <AddCraneModal
            siteId={siteId}
            isOpen={isOpenAddCraneModal}
            onClose={() => {
              setIsOpenAddCraneModal(false)
              setSiteId(0)
            }}
            onUpdate={() => props.onUpdate()}
          >

          </AddCraneModal>
        </div>
      )

      }
    </>
  );
}
