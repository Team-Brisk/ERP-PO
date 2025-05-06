import { ToggleButton, Tooltip } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import { errorMessage } from '@/utils/messageAlert';
import { element2image, img2pdf } from '@/utils/fileExport';
import { PopperProps } from '@mui/material/Popper/BasePopper.types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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



export default function ExportToPdfAll({ paperEl, placement, customClass }: Props) {
    const [saveLoading, setSaveLoading] = useState(false)

    const exportPDF = async () => {
        if (!paperEl.current) return;
      
        const pages = document.querySelectorAll(".page-break"); // ใช้ class เดิมของแต่ละหน้า
        const pdf = new jsPDF("p", "pt", "a4");
        const padding = 10;
      
        for (let i = 0; i < pages.length; i++) {
          const page = pages[i] as HTMLElement;
          const canvas = await html2canvas(page, {
            scale: 2,
            useCORS: true,
          });
          const imgData = canvas.toDataURL("image/jpeg", 1.0);
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
          if (i > 0) pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
        }
      
        pdf.save(`report.pdf`);
      };

    return (
        <>
            <Tooltip title='ดาวน์โหลดไฟล์เป็น PDF' placement={(placement) ? placement : 'left'}>
                <ToggleButton
                    onClick={() => {
                        exportPDF()
                    }}
                    className={`bg-white hover:text-red-500 duration-300
                        ${(customClass) ? customClass : null}`}
                    value="center"
                >
                    {(saveLoading === false) ? <SaveIcon /> : <CircularProgress size={20} color="inherit" />}

                </ToggleButton>
            </Tooltip>
        </>
    )
}