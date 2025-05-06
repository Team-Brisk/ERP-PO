import { element2image, pdf2print } from "@/utils/fileExport";
import { errorMessage } from "@/utils/messageAlert";
import { ToggleButton, Tooltip } from "@mui/material"
import { useEffect, useRef, useState } from "react";
import PrintIcon from '@mui/icons-material/Print';
import CircularProgress from '@mui/material/CircularProgress';

interface Props {
    paperEl: React.RefObject<HTMLDivElement>;
    customClass?: string
    placement?: | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top'
}

export default function PrintPdfBtn({ paperEl, placement, customClass }: Props) {
    const [printLoading, setPrintLoading] = useState(false)

    const printPDF = async () => {
        if (!paperEl.current) return errorMessage({ title: 'Print Error', message: 'Cannot find paper element' });
        try {
            setPrintLoading(true)
            const imgData = await element2image(paperEl.current);
            await pdf2print(imgData)
            setPrintLoading(false)
        } catch (error) {
            setPrintLoading(false)
            errorMessage({ title: 'Print Error', message: String(error) });
        }
    }
    return (
        <>
            <Tooltip title='ถ่ายเอกสาร' placement={(placement) ? placement : 'left'}>
                <ToggleButton
                    onClick={() => window.print()}
                    className={`bg-white hover:text-blue-500 duration-300 
                        ${(customClass) ? customClass : null}`}
                    value="center"
                >
                    {(printLoading === false) ? <PrintIcon /> : <CircularProgress size={20} color="inherit" />}
                </ToggleButton>
            </Tooltip>
        </>
    )
}