"use client";

import { Crane } from "@/models/crane";
import { Site } from "@/models/site";
import { Users } from "@/models/users";
import { useDateConverter } from "@/utils/dateConverter";
import { Paper } from "@mui/material";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BASE_API } from "../../(main)/api";
import axios from "@/app/config/axiosConfig";
import { errorMessage } from "@/utils/messageAlert";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
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
    d147: string | null;
    d148: string | null;
    d149: string | null;
    dist_x: string | null;
    dist_y: string | null;
  };
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
  sum_total: number | null;
  sum_success: number | null;
  sum_fail: number | null;
  group_queue: number | null;
}

interface Props {
  report?: Reports;
  onUpdate?: (v: HTMLDivElement) => void;
}

export default function ReportSumSRM(props: Props) {
  const paperRef = useRef<HTMLDivElement>(null);
  const [failCount, setFailCount] = useState<number | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const [groupCount, setGroupCount] = useState<number | null>(null);
  const [failList, setFailList] = useState<{ barcode: string; reason: string }[]>([]);

  useEffect(() => {
    const fetchDataAll = async () => {
      try {
        if (!props.report) return;
        const res = await axios.post(`${BASE_API}/get_sum_group`, props);
        if (res.status === 200) {
          setGroupCount(res.data.success_count);
        } else {
          throw new Error(res.data.msg);
        }
      } catch (err: any) {
        errorMessage(err);
      }
    };

    const fetchData = async () => {
      try {
        if (!props.report) return;
        const res = await axios.post(`${BASE_API}/get_sum`, props);
        if (res.status === 200) {
          setSuccessCount(res.data.success_count);
          setFailCount(res.data.failed_count);
        } else {
          throw new Error(res.data.msg);
        }
      } catch (err: any) {
        errorMessage(err);
      }
    };

    const fetchDataDesc = async () => {
      try {
        if (!props.report) return;
        const res = await axios.post(`${BASE_API}/get_fail`, props);
        if (res.status === 200) {
          const failListArray = res.data.q_data.map((item: any, i: number) => ({
            barcode: item.barcode,
            reason: res.data.q_datax[i]?.rp_status_desc || "ไม่ทราบสาเหตุ",
          }));
          setFailList(failListArray);
        } else {
          throw new Error(res.data.msg);
        }
      } catch (err: any) {
        errorMessage(err);
      }
    };

    if (paperRef.current && props.onUpdate) {
      props.onUpdate(paperRef.current);
    }

    fetchData();
    fetchDataAll();
    fetchDataDesc();
  }, [props.onUpdate]);


  const firstPageLimit = 22;
  const otherPageLimit = 28;
  const paginatedFailList: { barcode: string; reason: string }[][] = [];
  let start = 0;

  paginatedFailList.push(failList.slice(start, firstPageLimit));
  start += firstPageLimit;

  while (start < failList.length) {
    paginatedFailList.push(failList.slice(start, start + otherPageLimit));
    start += otherPageLimit;
  }
  const exportToExcel = () => {
    const worksheetData = failList.map((item, index) => ({
      ลำดับ: index + 1,
      รหัสคิวอาร์โค้ด: item.barcode,
      สาเหตุ: item.reason,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Failed Report");

    XLSX.writeFile(workbook, "รายงานคิวไม่สำเร็จ.xlsx");
  };
  const getGlobalIndex = (pageIndex: number, index: number) => {
    if (pageIndex === 0) return index + 1;
    return firstPageLimit + (pageIndex - 1) * otherPageLimit + index + 1;
  };
  return (


    <div id="print-area" className="relative w-full flex flex-col items-center gap-4 text-black print:block">
      <div className="w-full flex justify-end print:hidden">
        <div className="w-full flex justify-end print:hidden">
          <div className="w-full flex justify-end print:hidden">

            <button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Export to Excel
            </button>
          </div>

        </div>
      </div>
      {paginatedFailList.map((page, pageIndex) => (
        <Paper
          key={pageIndex}
          ref={pageIndex === 0 ? paperRef : null}
          elevation={3}
          sx={{
            minWidth: "794px",
            maxWidth: "794px",
            width: "794px",
            minHeight: "1123px",
            maxHeight: "1123px",
            height: "1123px",
            padding: "10px",
            margin: "auto",
            backgroundColor: "white",
            pageBreakBefore: pageIndex > 0 ? "always" : "auto",
          }}
          className="flex flex-col gap-3 page-break"
        >
          {/* Header */}
          <div className="flex flex-row p-1 a4_border justify-between">
            <div>
              <Image
                src="/logo/logo_amw.jpg"
                width={150}
                height={50}
                alt="Logo"
                layout="responsive"
              />
            </div>
            <div className="w-full flex flex-col justify-center items-center">
              <div className="text-xl font-bold">รายงานการสั่งงาน</div>
            </div>
          </div>

          {/* Summary (only on first page) */}
          {pageIndex === 0 && (
            <div className="w-full">
              <table className="a4_border w-full">
                <tbody>
                  <tr className="a4_border font-light">
                    <td className="a4_border py-1 px-1 text-left w-[150px]">วันที่</td>
                    <td className="a4_border py-1 px-1">
                      {useDateConverter(String(props.report?.date_time), "th-TH")}
                    </td>
                  </tr>
                  <tr className="a4_border font-light">
                    <td className="a4_border py-1 px-1 text-left">ผู้ใช้งาน</td>
                    <td className="a4_border py-1 px-1">
                      {props.report?.users.first_name} {props.report?.users.last_name}
                    </td>
                  </tr>
                  <tr className="a4_border font-light">
                    <td className="a4_border py-1 px-1 text-left">จำนวนคิวทั้งหมด</td>
                    <td className="a4_border py-1 px-1">{groupCount ?? "-"}</td>
                  </tr>
                  <tr className="a4_border font-light">
                    <td className="a4_border py-1 px-1 text-left">สำเร็จ</td>
                    <td className="a4_border py-1 px-1">{successCount ?? "-"}</td>
                  </tr>
                  <tr className="a4_border font-light">
                    <td className="a4_border py-1 px-1 text-left">ไม่สำเร็จ</td>
                    <td className="a4_border py-1 px-1">{failCount ?? "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Fail Section Title */}
          <div className="flex justify-center p-1 a4_border font-bold">
            รายการที่ไม่สำเร็จ (หน้าที่ {pageIndex + 1})
          </div>

          {/* Fail List Table */}
          <div className="w-full">
            <table className="a4_border w-full">
              <thead>
                <tr className="a4_border font-light">
                  <th className="a4_border py-1 px-1 text-left w-[60px]">ลำดับ</th>
                  <th className="a4_border py-1 px-1 text-left w-[260px]">รหัสคิวอาร์โค้ด</th>
                  <th className="a4_border py-1 px-1 text-left">สาเหตุ</th>
                </tr>
              </thead>
              <tbody>
                {page.map((item, index) => (
              <tr key={`${item.barcode}-${getGlobalIndex(pageIndex, index)}`} className="a4_border font-light">
                    <td className="a4_border py-1 px-1">{getGlobalIndex(pageIndex, index)}</td>
                    <td className="a4_border py-1 px-1">{item.barcode}</td>
                    <td className="a4_border py-1 px-1">{item.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Paper>
      ))}
    </div>
  );
}
