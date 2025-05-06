'use client'

import axios from "@/app/config/axiosConfig";
import { useParams } from "next/navigation";
import { BASE_API } from "../../api";
import { Reports } from "@/models/srmReport";
import { useEffect, useRef, useState } from "react";
import { errorMessage } from "@/utils/messageAlert";
import { ButtonGroup } from "@mui/material";
import { qData } from "@/app/(main)/order-queue/page";
import '../../../styles/tailwind.css'
import { useSearchParams } from 'next/navigation';


import ReportSRM from "@/app/components/report/ReportSRM";
import PrintPdfBtn from "@/app/components/button/PrintPdfBtn";
import ExportToPdf from "@/app/components/button/ExportToPdf";
import errorHandler from "@/utils/errorHandler";
import ReportSumSRM from "@/app/components/report/ReportSumSRM";
import ExportToPdfAll from "@/app/components/button/ExportToPdfAll";
import PrintPdfBtnAll from "@/app/components/button/PrintPdfBtnAll";

export default function ReportDetail() {

    const params = useParams()
    const [report, setReport] = useState<Reports>()
    const paperElement = useRef<HTMLDivElement>(null!);
    const searchParams = useSearchParams();
    const check = searchParams.get('check');
    const group_queue = searchParams.get('group_queue');
    const from = searchParams.get('from');
    const pagesRef = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        getReportDetail()
    }, [])

    // fetch
    const getReportDetail = async () => {
        try {
            const res = await axios.post(`${BASE_API}/report_detail`, { reportId: params.reportId })
            console.log(res.data);
            const data = res.data.report as Reports
            if (res.status === 200) {
                console.log(data);
                setReport(data)
            } else {
                throw new Error(res.data.msg)
            }
            // console.log(data);
        } catch (err: any) {
            // errorMessage(err)
            errorHandler(err)
        }
    }

    // const exportPDF = async () => {
    //     if (!paperRef.current) return errorMessage({ title: 'PDF export error', message: `Cann't Find paper element` })
    //     try {
    //         setSaveLoading(true)
    //         const imgData = await element2image(paperRef.current)
    //         await img2pdf(imgData)
    //         setSaveLoading(false)
    //     } catch (error) {
    //         setSaveLoading(false)
    //         errorMessage({ title: 'PDF export error', message: String(error) })
    //     }
    // }

    // const printPDF = async () => {
    //     if (!paperRef.current) return errorMessage({ title: 'Print Error', message: 'Cannot find paper element' });
    //     try {
    //         setPrintLoading(true)
    //         const imgData = await element2image(paperRef.current);
    //         await pdf2print(imgData)
    //         setPrintLoading(false)
    //     } catch (error) {
    //         setPrintLoading(false)
    //         errorMessage({ title: 'Print Error', message: String(error) });
    //     }
    // }

    return (

        <div className="min-h-full flex flex-row justify-center p-4">
            <div className="w-fit min-h-[calc(100vh-128px)] h-auto border-gray-300 justify-end ">
                <div className="sticky top-[80px] px-2 flex justify-end">
                    <ButtonGroup
                        color="success"
                        className="flex gap-2"
                        orientation="vertical"
                        aria-label="Vertical button group">

                        {check ? (
                            <><ExportToPdfAll
                                customClass="shadow-lg"
                                paperEl={paperElement}></ExportToPdfAll>
                                <PrintPdfBtnAll
                                    customClass="shadow-lg"
                                    paperEl={paperElement} /></>

                        ) : (
                            <><ExportToPdf
                                customClass="shadow-lg"
                                paperEl={paperElement} />
                                <PrintPdfBtn
                                    customClass="shadow-lg"
                                    paperEl={paperElement} /></>
                        )}


                    </ButtonGroup>
                </div>
            </div>
            {check ? (
                <ReportSumSRM
                    onUpdate={(v) => {
                        paperElement.current = v;
                    }}
                    report={report}
                />
            ) : (
                <ReportSRM
                    onUpdate={(v) => {
                        paperElement.current = v;
                    }}
                    report={report}
                />
            )}
        </div>

    );
}


