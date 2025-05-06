import { IconButton } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from 'react';
import { Report } from '@/models/report';
import { BASE_API } from '../../(main)/api';
import MsgAlert from '@/utils/sweetAlert';

interface OutputReportProps {
    reportData: Report
}

export default function OutputReport(props: OutputReportProps) {
    const _msg = new MsgAlert()

    useEffect(() => {
        console.log(props.reportData);
    }, [props.reportData])
    // compare table
    const RenderRowTable = ({ label, WcsVal, relVal }: { label: string, WcsVal?: string | number | null, relVal?: string | number | null }) => (
        <tr className="bg-white hover:bg-gray-50 transition-colors duration-200 line-table-gray ">
            <td className="px-4 py-4 text-black font-medium text-md line-table-gray">{label}</td>
            <td className="px-4 py-4 text-black text-center text-md line-table-gray">{WcsVal || '-'}</td>
            <td className="px-4 py-4 text-black text-center text-md line-table-gray">{relVal || '-'}</td>
        </tr>
        //
    );

    const renderLatestStatus = () => {
        return (
            <>
                <div className='w-full card-minimal p-2 flex flex-col justify-center items-center'>
                    <div className='w-full text-lg font-extralight pb-3'>
                        <span className='px-2'>บันทึกสถานะการทำงาน</span>
                        <hr />
                    </div>
                    <div className='w-full grid grid-cols-4 gap-4'>
                        <div className='p-4 w-full border-2 rounded-md flex flex-col justify-center items-center gap-2'>
                            <div className='text-2xl font-extralight'>
                                {props.reportData.opc_crr_status.dist_x ?? '-'}
                            </div>
                            <div className='font-bold text-center '>
                                ระยะทางในแกน X
                            </div>
                        </div>
                        <div className='p-4 w-full border-2 rounded-md flex flex-col justify-center items-center gap-2'>
                            <div className='text-2xl font-extralight'>
                                {props.reportData.opc_crr_status.dist_y ?? '-'}
                            </div>
                            <div className='font-bold text-center'>
                                ระยะทางในแกน y
                            </div>
                        </div>
                        <div className='p-4 w-full border-2 rounded-md flex flex-col justify-center items-center'>
                            <div className='text-center'>
                                {props.reportData.opc_crr_status.d147 ?? '-'}
                            </div>
                            <div className='font-bold text-center'>
                                สถานะการทำงาน
                            </div>
                        </div>
                        <div className='p-4 w-full border-2 rounded-md flex flex-col justify-center items-center'>
                            <div>
                                {props.reportData.opc_crr_status.d149 ?? '-'}
                            </div>
                            <div className='font-bold text-center'>
                                สถานะผิดปกติ
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const renderHeaderStatus = () => {
        return (
            <>
                <div className='w-full card-minimal p-2 flex flex-col justify-center items-center'>
                    <div className='w-full text-lg font-extralight pb-3'>
                        <span className='px-2'>ผลการตรวจสอบ</span>
                        <hr />
                    </div>
                    <div className='w-full grid grid-cols-4 gap-4'>
                        <div className='p-4 w-full border-2 rounded-md flex flex-col justify-center items-center gap-2'>
                            <div className={`${props.reportData.rp_status === 'สำเร็จ' ? 'text-green-500' : 'text-red-500'} 
                            flex flex-col w-full justify-center items-center`}>
                                <span>
                                    {props.reportData.rp_status ?? '-'}
                                </span>
                                <span>
                                    {props.reportData.rp_status_desc ?? '-'}
                                </span>
                            </div>
                            <div className='font-bold text-center '>
                                ผลลัพธ์รายงาน
                            </div>
                        </div>
                        <div className='p-4 w-full border-2 rounded-md flex flex-col justify-center items-center'>
                            <div>
                                {props.reportData.img_obj_detect ?? '-'}
                            </div>
                            <div className='font-bold text-center'>
                                การตรวจสอบสินค้า
                            </div>
                        </div>
                        <div className='p-4 w-full border-2 rounded-md flex flex-col justify-center items-center'>
                            <div>
                                {props.reportData.img_bcode_detect ?? '-'}
                            </div>
                            <div className='font-bold text-center'>
                                การตรวจจับบาร์โค้ด
                            </div>
                        </div>
                        <div className='p-4 w-full border-2 rounded-md flex flex-col justify-center items-center'>
                            <div>
                                {props.reportData.img_bcode_detect ?? '-'}
                            </div>
                            <div className='font-bold text-center'>
                                การอ่านบาร์โค้ด
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const renderCompareTable = () => {
        return (
            <div className='w-full flex flex-col gap-2'>
                <table className='border-2 border-collapse '>
                    <thead className='bg-gray-100'>
                        <tr className='line-table-gray'>
                            <th className='p-3 text-left line-table-gray'>Information</th>
                            <th className='p-3 line-table-gray'>WCS Database</th>
                            <th className='p-3 line-table-gray'>Real Detection</th>
                        </tr>
                    </thead>
                    <tbody>
                        <RenderRowTable label='Barcode ID' WcsVal={props.reportData.wcs_barcode_number} relVal={props.reportData.img_bcode_number}></RenderRowTable>
                        <RenderRowTable label='Log Rack' WcsVal={props.reportData.wcs_log_rack} relVal={'-'}></RenderRowTable>
                        <RenderRowTable label='Site' WcsVal={'KKF-MINILOAD'} relVal={props.reportData.site_id}></RenderRowTable>
                        <RenderRowTable label='Crane' WcsVal={props.reportData.wcs_asrs} relVal={props.reportData.crane_id}></RenderRowTable>
                        <RenderRowTable label='Bank' WcsVal={props.reportData.wcs_bank} relVal={props.reportData.in_bank}></RenderRowTable>
                        <RenderRowTable label='Level' WcsVal={props.reportData.wcs_level} relVal={props.reportData.in_level}></RenderRowTable>
                        <RenderRowTable label='Bay (Distance X)' WcsVal={props.reportData.wcs_bay + ' mm.'} relVal={props.reportData.in_bay + ' mm.'}></RenderRowTable>
                    </tbody>
                </table>
            </div>
        )
    }

    const [isAiSecExpand, setIsAiSecExpand] = useState<boolean>(true)
    const renderAiDectected = () => {
        return (
            <div className={`${!isAiSecExpand
                ? 'max-h-[60px]'
                : 'max-h-[900px]'} 
                card-expand w-full p-2 rounded-md card-minimal flex flex-col gap-3`}>
                <div className='flex flex-row justify-between'>
                    <span className='w-full text-lg px-2'>
                        ข้อมูลจากกล้อง
                    </span>
                    <div className='relative flex flex-row gap-2 justify-end'>
                        <IconButton className={`${!isAiSecExpand ? 'rotate-0' : 'rotate-180'} absolute top-0  duration-50 transition-transform`}
                            color='inherit'
                            onClick={() => {
                                setIsAiSecExpand(!isAiSecExpand)
                            }}
                        >
                            <ExpandMoreIcon
                                fontSize={'small'}
                            />
                        </IconButton>
                    </div>
                </div>
                <hr />
                <div className='w-full flex flex-row gap-3'>
                    <div className='w-1/2 flex flex-col gap-3'>
                        <div className='w-full flex flex-col'>
                            <div className='relative rounded-md w-full h-[250px] group overflow-hidden'>
                                {(props.reportData.img_obj) ? (
                                    <img src={`${BASE_API}/static/KKFMiniLoad/${props.reportData.img_obj}`}
                                        onClick={() => _msg.lightBox(`${BASE_API}/static/KKFMiniLoad/${props.reportData.img_obj}`, '70%')}
                                        className='rounded-md w-full h-full border-2 bg-gray-100 cursor-pointer object-cover hover:scale-[1.02] duration-300' alt="" />
                                ) : (
                                    <div className='w-full h-full text-gray-400 obj-center rounded-md border-[3px] border-dashed border-gray-200 bg-gray-50'>
                                        No Image
                                    </div>
                                )}

                            </div>
                        </div>
                        <div className='w-full flex flex-col gap-2'>
                            <div className='rounded-md w-full h-28'>
                                {(props.reportData.img_barcode) ? (
                                    <img src={`${BASE_API}/static/KKFMiniLoad/${props.reportData.img_barcode}`}
                                        className='rounded-md w-full h-full object-fit border-2 bg-gray-100' alt="" />
                                ) : (
                                    <div className='w-full h-full text-gray-400 obj-center rounded-md border-[3px] border-dashed border-gray-200 bg-gray-50'>
                                        No Barcode Image
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='w-1/2 flex flex-col gap-3 justify-around'>
                        <div className='p-4 border-2 rounded-md flex flex-col'>
                            <span className='text-lg'>
                                ทิศทางการเลื่่อน : {props.reportData.img_shift_direction ?? '-'}
                            </span>
                        </div>
                        <div className='p-4 border-2 rounded-md flex flex-col'>
                            <span className='text-lg'>
                                ระยะการเลื่อน (px) : {props.reportData.img_shift_pix ?? '-'}
                            </span>
                        </div>
                        <div className='p-4 border-2 rounded-md flex flex-col'>
                            <span className='text-lg'>
                                ระยะการเลื่อน (cm) : {props.reportData.img_shift_cm ?? '-'}
                            </span>
                        </div>
                        <div className='grid grid-cols-2 gap-3'>
                            <div className='flex flex-col w-full p-4 rounded-md border-2 border-gray-200'>
                                <div className='w-full text-center text-2xl font-extralight'>
                                    {props.reportData.wcs_weight ?? '-'}
                                </div>
                                <div className='text-center text-sm font-bold'>
                                    น้ำหนัก
                                </div>
                            </div>
                            <div className='flex flex-col w-full p-4 rounded-md border-2 border-gray-200'>
                                <div className='w-full text-center text-2xl font-extralight'>
                                    {props.reportData.wcs_width ?? '-'}
                                </div>
                                <div className='text-center text-sm font-bold'>
                                    ความกว้าง
                                </div>
                            </div>
                            <div className='flex flex-col w-full p-4 rounded-md border-2 border-gray-200'>
                                <div className='w-full text-center text-2xl font-extralight'>
                                    {props.reportData.wcs_height ?? '-'}
                                </div>
                                <div className='text-center text-sm font-bold'>
                                    ความสูง
                                </div>
                            </div>
                            <div className='flex flex-col w-full p-4 rounded-md border-2 border-gray-200'>
                                <div className='w-full text-center text-2xl font-extralight'>
                                    {props.reportData.wcs_length ?? '-'}
                                </div>
                                <div className='text-center text-sm font-bold'>
                                    ความยาว
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {renderHeaderStatus()}
            {renderLatestStatus()}
            {renderAiDectected()}
            {renderCompareTable()}
        </>
    );
} 
