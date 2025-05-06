import { utils, writeFile } from 'xlsx';
import { getRandomNameFromDate } from './dateConverter';


function exportReportToExcel(data: any, fileName?: string) {
    // ตั้งชื่อไฟล์
    let name: string = (fileName) ? fileName + "_" + Math.floor(Math.random() * 1000) : "file_" + getRandomNameFromDate();

    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet1");

    writeFile(workbook, `${name}.xlsx`, {
        compression: true,
    });
}

export default exportReportToExcel;