'use client'
import { Button, Tooltip } from "@mui/material";


import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { convertDateFromNow, convertDateToShortWithSecond } from "@/utils/dateConverter";
import { BASE_API } from "@/app/(main)/api";

import axios from '@/app/config/axiosConfig'


import { errorMessage, successMessage } from "@/utils/messageAlert";

import CancelIcon from '@mui/icons-material/Cancel';
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';
import { qData } from "@/app/(main)/order-queue/page";
import errorHandler from "@/utils/errorHandler";
interface Props {
    qDataStuck: Array<qData>
    orderStatus?: string
    isDisabled?: boolean
    onUpdate: (v: any) => void
}

interface gridVal {
    row: qData
}

export default function MuiStuckQTable(props: Props) {

    const reQueue = async (id: number) => {
        try {
            const res = await axios.post(`${BASE_API}/re_q`, { q_id: id })
            if (res.status === 200) {
                successMessage(res.data.msg)
                props.onUpdate('')
            } else {
                throw new Error('เกิดข้อผิดพลาด ไม่ทราบสาเหตุ')
            }
        } catch (err: any) {
            errorHandler(err)
        }
    }

    const cancelQ = async (id: number) => {
        try {
            const res = await axios.post(`${BASE_API}/cancel_q`, { q_id: id })
            if (res.status === 204) {
                successMessage(res.data.msg)
                props.onUpdate('')
            } else {
                throw new Error('เกิดข้อผิดพลาด ไม่ทราบสาเหตุ')
            }
        } catch (err: any) {
            errorHandler(err)
        }
    }

    const cols: GridColDef[] = [
        {
            field: 'Index',
            headerName: '#',
            width: 70,
            align: 'center',
            headerAlign: 'center',
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
            renderCell: (p: gridVal) => {
                return (
                    <span>
                        {p.row.barcode}
                    </span>
                );
            }
        },
        {
            field: 'date',
            headerName: 'วันที่',
            width: 300,
            align: 'left',
            headerAlign: 'left',
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            resizable: false,
            renderCell: (p: gridVal) => {
                return (
                    <span>
                        {convertDateToShortWithSecond(p.row.date)} น. ( {convertDateFromNow(p.row.date)} )
                    </span>
                );
            }
        },
        {
            field: 'edit',
            headerName: 'จัดการ',
            headerAlign: 'center',
            align: 'center',
            width: 180,
            resizable: false,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (p: gridVal) => {
                return (
                    <div className="flex gap-2 justify-center items-center h-full w-full">
                        <Tooltip title={'เพิ่มคิวเข้าไปใหม่'} placement="top">
                            <Button
                                disabled={(props.isDisabled) ? props.isDisabled : false}
                                onClick={() => { reQueue(p.row.id) }}
                                color="warning"
                                size="small"
                                variant="outlined">
                                <ReplayCircleFilledIcon />
                            </Button>
                        </Tooltip>
                        <Tooltip title={'ยกเลิก'} placement="top">
                            <Button
                                disabled={(props.isDisabled) ? props.isDisabled : false}
                                onClick={() => { cancelQ(p.row.id) }}
                                color="error"
                                size="small"
                                variant="outlined">
                                <CancelIcon />
                            </Button>
                        </Tooltip>
                    </div>
                )
            }
        },
        // {
        //     field: 'order work status',
        //     headerName: 'สถานะการทำงาน',
        //     width: 150,
        //     align: 'center',
        //     headerAlign: 'center',
        //     filterable: false,
        //     sortable: false,
        //     disableColumnMenu: true,
        //     resizable: false,
        //     renderCell: (p: any) => {
        //         let index = p.api.getAllRowIds().indexOf(p.id) + 1
        //         let displayStatus = (index === 1) ? (props.orderStatus) ? props.orderStatus : 'กำลังโหลดข้อมูล' : 'กำลังรอคิว'


        //         return (
        //             <>
        //                 <Chip
        //                     className="w-[150px]"
        //                     size="medium"
        //                     variant="outlined"
        //                     color={(index === 1) ? 'primary' : 'default'}
        //                     label={displayStatus}
        //                 />
        //             </>
        //         );
        //     }
        // },
        // {
        //     field: 'status',
        //     headerName: 'สถานะคิวงาน',
        //     width: 150,
        //     align: 'center',
        //     headerAlign: 'center',
        //     filterable: false,
        //     sortable: false,
        //     disableColumnMenu: true,
        //     resizable: false,
        //     renderCell: (p: gridVal) => {
        //         return (
        //             <>
        //                 <Chip
        //                     className="w-[150px]"
        //                     size="medium"
        //                     variant="outlined"
        //                     color={
        //                         (Number(p.row.status) === 0) ? 'warning'
        //                             : (Number(p.row.status) === 1) ? 'primary'
        //                                 : (Number(p.row.status) === 2) ? 'success'
        //                                     : (Number(p.row.status) === 4) ? 'error'
        //                                         : (Number(p.row.status) === 3) ? 'error' : 'default'
        //                     }
        //                     label={
        //                         (Number(p.row.status) === 0) ? 'รอคิว'
        //                             : (Number(p.row.status) === 1) ? 'กำลังทำงาน...'
        //                                 : (Number(p.row.status) === 2) ? 'สำเร็จ'
        //                                     : (Number(p.row.status) === 4) ? 'ล้มเหลว'
        //                                         : (Number(p.row.status) === 3) ? 'ยกเลิก' : 'ไม่ทราบสถานะ'
        //                     }
        //                 />
        //             </>
        //         );
        //     }
        // },
    ];


    return (

        <div className="w-full h-full overflow-auto">
            <DataGrid
                density={'standard'}
                // loading={rpLoading}
                rows={props.qDataStuck}
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