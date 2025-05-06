import { Avatar, Button, Chip, Divider, Paper, ToggleButton, Tooltip } from "@mui/material";
import FindInPageIcon from '@mui/icons-material/FindInPage';
import { Reports } from "@/models/srmReport";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { convertDateToShort, useDateConverter } from "@/utils/dateConverter";
import { BASE_API } from "@/app/(main)/api";
import { useRouter } from "next/navigation";
import axios from '@/app/config/axiosConfig'
import { useEffect, useState } from "react";
import { Credential } from "@/models/users";
import { errorMessage } from "@/utils/messageAlert";
import { TypeOrderSrm } from "../form/OrderTypeSelect";
import { convertDateToISO } from "@/utils/dateConverter";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { qData } from "@/app/(main)/order-queue/page";

interface Props {
    qData: Array<qData>
    orderStatus?: string
}

interface GridVal {
    row: qData
}

export default function MuiCrrQTable(props: Props) {

    const cols: GridColDef[] = [
        {
            field: 'queueIndex',
            headerName: 'ลำดับคิว',
            width: 70,
            align: 'center',
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            resizable: false,
            renderCell: (p: any) => p.api.getAllRowIds().indexOf(p.id) + 1
        },
        {
            field: 'barcode',
            headerName: 'บาร์โค้ด',
            flex: 1,
            align: 'left',
            headerAlign: 'left',
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            resizable: false,
            renderCell: (p: GridVal) => {
                return (
                    <span>
                        {p.row.barcode}
                    </span>
                );
            }
        },
        {
            field: 'order work status',
            headerName: 'สถานะการทำงาน',
            width: 150,
            align: 'center',
            headerAlign: 'center',
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            resizable: false,
            renderCell: (p: any) => {
                let index = p.api.getAllRowIds().indexOf(p.id) + 1
                let displayStatus: string;
                if (index === 1) {
                    if (props.orderStatus) {
                        displayStatus = props.orderStatus;
                    } else {
                        displayStatus = 'กำลังโหลดข้อมูล';
                    }
                } else {
                    displayStatus = 'กำลังรอคิว';
                }

                return (

                    <Chip
                        className="w-[150px]"
                        size="medium"
                        variant="outlined"
                        color={(index === 1) ? 'primary' : 'default'}
                        label={displayStatus}
                    />

                );
            }
        },
        {
            field: 'status',
            headerName: 'สถานะคิวงาน',
            width: 150,
            align: 'center',
            headerAlign: 'center',
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            resizable: false,
            renderCell: (p: GridVal) => {
                const statusColor = Number(p.row.status);

                const statusColorMap: Record<number, 'warning' | 'primary' | 'success' | 'error' | 'default'> = {
                    0: 'warning',
                    1: 'primary',
                    2: 'success',
                    3: 'error',
                    4: 'error',
                };
                const statusLable = Number(p.row.status);

                const statusLabelMap: Record<number, string> = {
                    0: 'รอคิว',
                    1: 'กำลังทำงาน...',
                    2: 'สำเร็จ',
                    3: 'ยกเลิก',
                    4: 'ล้มเหลว',
                };
                const Color = statusColorMap[statusColor] ?? 'default';
                const Label = statusLabelMap[statusLable] ?? 'ไม่ทราบสถานะ';
                return (

                    <Chip
                        className="w-[150px]"
                        size="medium"
                        variant="outlined"
                        color={Color}
                        label={Label}
                    />

                );
            }
        },
    ];


    return (

        <div className="w-full h-full overflow-auto">
            <DataGrid
                density={'standard'}
                // loading={rpLoading}
                rows={props.qData}
                columns={cols}
                getRowId={(row) => row.id}
                // checkboxSelection={role === 1}
                sx={{ border: 0 }}
            // columnVisibilityModel={{
            //     users: (role === 1 && (!props.userId))
            // }}
            // pagination={false}
            // paginationMode="server"
            // rowCount={totalItem}
            // initialState={{ pagination: { paginationModel } }}
            // onPaginationModelChange={(v: { page: number, pageSize: number }) => {
            //     setPage(v.page)
            //     setPageSize(v.pageSize)
            // }}
            // pageSizeOptions={[25, 50, 100]}
            />
        </div>

    )
}