import { Crane } from "@/models/crane";
import { Site } from "@/models/site";
import { Users } from "@/models/users";
import { useDateConverter } from "@/utils/dateConverter";
import { Paper } from "@mui/material";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { BASE_API } from "../../(main)/api";

export interface Reports {
    crane: Crane;
    crane_id: number;
    date_time: string;
    id: number;
    img_barcode: string | null;
    img_bcode_detect: string | null;
    img_bcode_number: string | null;
    img_bcode_status: string | null;
    img_obj: string;
    img_obj_detect: string | null;
    img_shift_cm: string | null;
    img_shift_direction: string;
    img_shift_pix: string;
    img_log_rack: string;
    img_crane: string;
    img_site: string;
    in_bank: number;
    in_bay: number;
    in_level: number;
    in_path_opc: string;
    opc_crr_status: {
        d147: string | null,
        d148: string | null,
        d149: string | null,
        dist_x: string | null,
        dist_y: string | null
    }
    order_type: string;
    rp_status: string;
    rp_status_desc: string | null;
    site: Site;
    site_id: number;
    user_id: number;
    users: Users;
    wcs_asrs: string;
    wcs_bank: number;
    wcs_barcode_number: string;
    wcs_bay: number;
    wcs_height: string | null;
    wcs_length: string | null;
    wcs_level: number;
    wcs_log_rack: string | null;
    wcs_weight: string | null;
    wcs_width: string | null;
    wcs_crane: string | null;
    wcs_site: string | null;
}

interface Props {
    report?: Reports
    onUpdate?: (v: HTMLDivElement) => void
}

export default function ReportSRM(props: Props) {

    const paperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (paperRef.current && props.onUpdate) {
            props.onUpdate(paperRef.current);
        }
    }, [props.onUpdate]);

    return (
        <div className="relative w-full flex justify-center gap-4 text-black">
            <Paper
                ref={paperRef}
                elevation={3}
                sx={{
                    minWidth: '794px',
                    maxWidth: '794px',
                    width: '794px',
                    minHeight: '1123px',
                    maxHeight: '1123px',
                    height: '1123px',
                    padding: '10px',
                    margin: 'auto',
                    backgroundColor: 'white',
                }}
                className="flex flex-col gap-3"
            >

                <div className="flex flex-row p-1 a4_border justify-between">
                    <div className="">
                        <Image
                            src="/logo/logo_amw.jpg"
                            width={150}
                            height={50}
                            alt="Picture of the author"
                            layout="responsive"
                        ></Image>
                    </div>
                    <div className="w-full h-full flex flex-col">
                        <div className="w-full text-xl h-full flex justify-center items-center font-bold">
                            รายงานการสั่งงาน
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <table className="a4_border w-full">
                        <tbody>
                            <tr className="a4_border font-light">
                                <td className="a4_border py-1 px-1 text-left w-[150px]">รหัสรายงาน</td>
                                <td className="a4_border py-1 px-1">{props.report?.id}</td>
                            </tr>
                            <tr className="a4_border font-light">
                                <td className="a4_border py-1 px-1 text-left w-[150px]">ประเภทการสั่ง</td>
                                <td className="a4_border py-1 px-1">
                                    {(props.report?.order_type === 'barcode') ? (
                                        <>สั่งการด้วยคิวงานแบบบาร์โค้ด</>) : (<>สั่งการแบบแมนนวล</>)}
                                </td>
                            </tr>
                            <tr className="a4_border font-light">
                                <td className="a4_border py-1 px-1 text-left w-[150px]">ผลลัพธ์</td>
                                <td className="a4_border py-1 px-1">{props.report?.rp_status} {props.report?.rp_status_desc}</td>
                            </tr>
                            <tr className="a4_border font-light">
                                <td className="a4_border py-1 px-1 text-left w-[150px]">วันที่</td>
                                <td className="a4_border py-1 px-1">{useDateConverter(String(props.report?.date_time), 'th-TH')}</td>
                            </tr>
                            <tr className="a4_border font-light">
                                <td className="a4_border py-1 px-1 text-left w-[150px]">ผู้ใช้งาน</td>
                                <td className="a4_border py-1 px-1">{props.report?.users.first_name} {props.report?.users.last_name}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-row p-1 a4_border">
                    <div className="w-1/2 h-[210px] obj-center pr-0.5">
                        {
                            (props.report?.img_obj) ?
                                (
                                    <Image
                                        alt="Demo Image"
                                        width={100}
                                        height={50}
                                        layout="responsive"
                                        src={`${BASE_API}/static/KKFMiniLoad/${props.report?.img_obj}`}
                                        className="max-h-[210px] object-contain"
                                    ></Image>
                                )
                                : (
                                    <div className="w-full h-full flx obj-center">
                                        ไม่มีภาพสินค้า
                                    </div>
                                )
                        }
                    </div>
                    <div className="w-1/2 obj-center pl-0.5 max-h-[210px]">
                        {
                            (props.report?.img_barcode) ?
                                (
                                    <Image
                                        alt="Demo Image Barcode"
                                        width={100}
                                        height={50}
                                        layout="responsive"
                                        src={`${BASE_API}/static/KKFMiniLoad/${props.report?.img_barcode}`}
                                        className="max-h-[210px] object-contain"
                                    ></Image>
                                )
                                : (
                                    <div className="w-full h-full flx obj-center">
                                        ไม่มีภาพบาร์โค้ด
                                    </div>
                                )
                        }

                        {/* <div className="w-full h-full flx obj-center">
                    ไม่มีภาพบาร์โค้ด
                </div> */}
                    </div>
                </div>
                <div className="flex flex-row gap-3 w-full font-extralight">
                    <div className="w-2/3">
                        <table className="a4_border w-full">
                            <thead className="a4_border">
                                <tr className="a4_border">
                                    <th className="a4_border p-1 text-left">หัวข้อ</th>
                                    <th className="a4_border">ข้อมูลจาก WCS</th>
                                    <th className="a4_border">
                                        {(props.report?.order_type === 'barcode') ? (
                                            <>ข้อมูลที่พบจริง</>) : (<>ข้อมูลที่สั่ง</>)}

                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="a4_border font-light">
                                    <td className="a4_border py-1 px-1">Barcode</td>
                                    <td className="a4_border py-1 px-1 text-center">{(props.report?.wcs_barcode_number) ?? '-'}</td>
                                    <td className="a4_border py-1 px-1 text-center">{(props.report?.img_bcode_number) ?? '-'}</td>
                                </tr>
                                <tr className="a4_border font-light">
                                    <td className="a4_border py-1 px-1">Log Rack</td>
                                    <td className="a4_border py-1 px-1 text-center">{props.report?.wcs_log_rack ?? '-'}</td>
                                    <td className="a4_border py-1 px-1 text-center">{props.report?.img_log_rack ?? '-'}</td>
                                </tr>
                                <tr className="a4_border font-light">
                                    <td className="a4_border py-1 px-1">Site</td>
                                    <td className="a4_border py-1 px-1 text-center">KKF-MINILOAD</td>
                                    <td className="a4_border py-1 px-1 text-center">
                                        {/* {props.report?.site.site_name ?? '-'} */}
                                        {(props.report?.order_type === 'barcode') ? (
                                            <>{props.report?.img_site ?? '-'}</>
                                        ) : (
                                            <>{props.report?.site.site_name ?? '-'}</>
                                        )}
                                    </td>
                                </tr>
                                <tr className="a4_border font-light">
                                    <td className="a4_border py-1 px-1">SRM</td>
                                    <td className="a4_border py-1 px-1 text-center">
                                        {(props.report?.order_type === 'barcode') ? (
                                            <>{props.report?.crane.crane_name ?? '-'}</>
                                        ) : (
                                            <>{props.report?.wcs_crane ?? '-'}</>
                                        )}
                                        {/* {props.report?.wcs_asrs ?? '-'} */}
                                    </td>
                                    <td className="a4_border py-1 px-1 text-center">
                                        {(props.report?.order_type === 'barcode') ? (
                                            <>{props.report?.img_crane ?? '-'}</>
                                        ) : (
                                            <>{props.report?.crane.crane_name ?? '-'}</>
                                        )}

                                    </td>
                                </tr>
                                <tr className="a4_border font-light">
                                    <td className="a4_border py-1 px-1">Bank</td>
                                    <td className="a4_border py-1 px-1 text-center">{props.report?.wcs_bank ?? '-'}</td>
                                    <td className="a4_border py-1 px-1 text-center">{props.report?.in_bank ?? '-'}</td>
                                </tr>
                                <tr className="a4_border font-light">
                                    <td className="a4_border py-1 px-1">Level</td>
                                    <td className="a4_border py-1 px-1 text-center">{props.report?.wcs_level ?? '-'}</td>
                                    <td className="a4_border py-1 px-1 text-center">{props.report?.in_level ?? '-'}</td>
                                </tr>
                                <tr className="a4_border font-light">
                                    <td className="a4_border py-1 px-1">Bay</td>
                                    <td className="a4_border py-1 px-1 text-center">
                                        {
                                            props.report?.wcs_bay !== null && props.report?.wcs_bay !== undefined
                                                ? `${props.report.wcs_bay.toLocaleString()} mm.`
                                                : ` -`
                                        }
                                    </td>
                                    <td className="a4_border py-1 px-1 text-center">
                                        {
                                            props.report?.in_bay !== null && props.report?.in_bay !== undefined
                                                ? `${props.report.in_bay.toLocaleString()} mm.`
                                                : ` -`
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="w-1/3 flex flex-col">
                        <table className="a4_border w-full">
                            <thead className="a4_border">
                                <tr className="a4_border">
                                    <th className="a4_border py-1">ข้อมูลจากกล้องที่จับได้</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="a4_border font-light">
                                    <td className="a4_border p-1">บาร์โค้ด:{props.report?.img_bcode_number ?? '-'}</td>
                                </tr>
                                <tr className="a4_border font-light">
                                    <td className="a4_border p-1">ตรวจจับสินค้า:{props.report?.img_obj_detect ?? '-'}</td>
                                </tr>
                                <tr className="a4_border font-light">
                                    <td className="a4_border p-1">ตรวจจับบาร์โค้ด:{props.report?.img_bcode_detect ?? '-'}</td>
                                </tr>
                                <tr className="a4_border font-light">
                                    <td className="a4_border p-1">การอ่าน:{props.report?.img_bcode_status ?? '-'}</td>
                                </tr>
                                <tr className="a4_border font-light">
                                    <td className="a4_border p-1">ทิศทางการเลื่อน:{props.report?.img_shift_direction ?? '-'}</td>
                                </tr>
                                <tr className="a4_border font-light">
                                    <td className="a4_border p-1">ระยะเลื่อน (px):{props.report?.img_shift_pix ?? '-'}</td>
                                </tr>
                                <tr className="a4_border font-light">
                                    <td className="a4_border p-1">ระยะเลื่อน (mm.):{props.report?.img_shift_cm ?? '-'}</td>
                                </tr>
                                {/* <tr className="a4_border font-light">
                            <td className="a4_border p-1"></td>
                        </tr> */}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="w-full">
                    <table className="a4_border w-full">
                        <tbody>
                            <tr className="a4_border font-light">
                                <td className="a4_border py-1 px-1 text-left w-[200px]">น้ำหนัก</td>
                                <td className="a4_border py-1 px-4">{props.report?.wcs_weight ?? ' -'}</td>
                            </tr>
                            <tr className="a4_border font-light">
                                <td className="a4_border py-1 px-1 text-left w-[200px]">ส่วนสูง</td>
                                <td className="a4_border py-1 px-4">{props.report?.wcs_height ?? ' -'}</td>
                            </tr>
                            <tr className="a4_border font-light">
                                <td className="a4_border py-1 px-1 text-left w-[200px]">ความกว้าง</td>
                                <td className="a4_border py-1 px-4">{props.report?.wcs_width ?? ' -'}</td>
                            </tr>
                            <tr className="a4_border font-light">
                                <td className="a4_border py-1 px-1 text-left w-[200px]">ความยาว</td>
                                <td className="a4_border py-1 px-4">{props.report?.wcs_length ?? ' -'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="w-full">
                    <table className="a4_border w-full">
                        <tbody>
                            <tr className="a4_border font-light">
                                <td className="a4_border py-1 px-1 text-left w-[200px]">ระยะเคลื่อนที่แนวแกน X</td>
                                <td className="a4_border py-1 px-4">
                                    {props.report?.opc_crr_status?.dist_x != null
                                        ? `${props.report.opc_crr_status.dist_x.toLocaleString()} mm`
                                        : ` -`}
                                </td>
                            </tr>
                            <tr className="a4_border font-light">
                                <td className="a4_border py-1 px-1 text-left w-[200px]">ระยะเคลื่อนที่แนวแกน Y</td>
                                <td className="a4_border py-1 px-4">
                                    {props.report?.opc_crr_status?.dist_y != null
                                        ? `${props.report.opc_crr_status.dist_y.toLocaleString()} mm`
                                        : ` -`}
                                </td>
                            </tr>
                            <tr className="a4_border font-light">
                                <td className="a4_border py-1 px-1 text-left w-[200px]">สถานะเครน (D147)</td>
                                <td className="a4_border py-1 px-4">
                                    {props.report?.opc_crr_status !== null
                                        ? <>รหัส: {props.report?.opc_crr_status.d147?.split('|')[0] ?? ' -'} {props.report?.opc_crr_status.d147?.split('|')[1] ?? ''}</>
                                        : ` -`
                                    }

                                </td>
                            </tr>
                            <tr className="a4_border font-light">
                                <td className="a4_border py-1 px-1 text-left w-[200px]">คำสั่งเเครน (D148)</td>
                                <td className="a4_border py-1 px-4">
                                    {props.report?.opc_crr_status !== null
                                        ? <>รหัส: {props.report?.opc_crr_status.d148?.split('|')[0] ?? ' -'} {props.report?.opc_crr_status.d148?.split('|')[1] ?? ''}</>
                                        : ` -`
                                    }
                                </td>
                            </tr>
                            <tr className="a4_border font-light">
                                <td className="a4_border py-1 px-1 text-left w-[200px]">สถานะผิดปกติ (D149)</td>
                                <td className="a4_border py-1 px-4">
                                    {props.report?.opc_crr_status !== null
                                        ? <>รหัส: {props.report?.opc_crr_status.d149?.split('|')[0] ?? ' -'} {props.report?.opc_crr_status.d149?.split('|')[1] ?? ''}</>
                                        : ` -`
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Paper >
        </div >
    )
}