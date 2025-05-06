import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { RefObject } from "react";

export const element2image = async (element: HTMLElement) => {
    const canvas = await html2canvas(element,
        {
            scale: 3,
            // useCORS: true,
            // foreignObjectRendering: true
        });
    const imgData = canvas.toDataURL('image/png');
    return imgData
}

export async function img2pdf(imgData: string) {
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
    const imgWidth = imgProps.width * ratio;
    const imgHeight = imgProps.height * ratio;

    // วางรูปภาพให้อยู่ตรงกลางในหน้า PDF
    pdf.addImage(
        imgData,
        'PNG',
        (pdfWidth - imgWidth) / 2,
        (pdfHeight - imgHeight) / 2,
        imgWidth, imgHeight
    );

    // บันทึกไฟล์ PDF เป็น report.pdf
    pdf.save('report.pdf');
}

export async function pdf2print(imgData: string) {
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
    const imgWidth = imgProps.width * ratio;
    const imgHeight = imgProps.height * ratio;

    // วางรูปให้อยู่ตรงกลางในหน้า PDF
    pdf.addImage(
        imgData,
        'PNG',
        (pdfWidth - imgWidth) / 2,
        (pdfHeight - imgHeight) / 2,
        imgWidth,
        imgHeight
    );

    // แทนที่จะบันทึกไฟล์ ให้สร้าง Blob URL แล้วเปิดหน้าต่างใหม่เพื่อ Print
    const blobUrl = pdf.output('bloburl');
    const printWindow = window.open(blobUrl, '_blank');
    if (printWindow) {
        // เมื่อหน้าต่างโหลดเสร็จ ให้สั่ง print
        printWindow.addEventListener('load', () => {
            printWindow.print();
        });
    } else {
        console.error("Failed to open print window");
    }
}