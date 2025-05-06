import { ToggleButton, Tooltip } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import { errorMessage } from '@/utils/messageAlert';
import { element2image, img2pdf } from '@/utils/fileExport';
import { PopperProps } from '@mui/material/Popper/BasePopper.types';

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



export default function ExportToPdf({ paperEl, placement, customClass }: Props) {
    const [saveLoading, setSaveLoading] = useState(false)

    const exportPDF = async () => {
        if (!paperEl.current) return errorMessage({ title: 'PDF export error', message: `Cann't Find paper element` })
        try {
            setSaveLoading(true)
            const imgData = await element2image(paperEl.current)
            await img2pdf(imgData)
            setSaveLoading(false)
        } catch (error) {
            setSaveLoading(false)
            errorMessage({ title: 'PDF export error', message: String(error) })
        }
    }

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