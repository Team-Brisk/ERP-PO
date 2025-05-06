import { Button, Chip, Tooltip } from "@mui/material";
import FindInPageIcon from '@mui/icons-material/FindInPage';

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { convertDateToShort, convertDateToShortWithSecond } from "@/utils/dateConverter";
import { BASE_API } from "@/app/(main)/api";
import { useRouter } from "next/navigation";
import axios from '@/app/config/axiosConfig'
import { useEffect, useState } from "react";

import { errorMessage } from "@/utils/messageAlert";

import { qData } from "@/app/(main)/order-queue/page";

interface Props {
    readonly craneId: number
    readonly check: number
}

interface GridVal {
    row: qData
}

export default function MuiQueReport(props: Props) {
    const [QData, setQdata] = useState<Array<qData>>()

    const router = useRouter()


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.post(`${BASE_API}/get_q_finished_sum`, { craneId: props.craneId })
                if (res.status === 200) {
                    setQdata(res.data.q_data)
                } else {
                    throw new Error(res.data.msg)
                }
            } catch (err: any) {
                errorMessage(err)
            }
        }

        if (props.craneId) {
            fetchData()
        }
    }, [props])
    const cols: GridColDef[] = [
        {
            field: 'queueIndex',
            headerName: '#',
            width: 120,
            align: 'center',
            headerAlign: 'center',
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            resizable: false,
            renderCell: (p: any) => p.api.getAllRowIds().indexOf(p.id) + 1
        },
        {
            field: 'date',
            headerName: 'วันเวลาที่สั่งการคิว',
            width: 260,
            align: 'center',
            headerAlign: 'center',
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            resizable: false,
            renderCell: (p: GridVal) => {
                return (
                    <span>
                        {convertDateToShortWithSecond(p.row.date)}
                    </span>
                );
            }
        },
        {
            field: 'status',
            headerName: 'สถานะคิวงาน',
            width: 280,
            align: 'center',
            headerAlign: 'center',
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            resizable: false,
            renderCell: (p: GridVal) => {
                const getStatusColor = (status: number): 'warning' | 'primary' | 'success' | 'error' | 'default' => {
                    const map: Record<number, 'warning' | 'primary' | 'success' | 'error' | 'default'> = {
                        0: 'warning',
                        1: 'primary',
                        2: 'success',
                        3: 'error',
                        4: 'error',
                    };
                    return map[status] || 'default';
                };

                const getStatusLabel = (status: number): string => {
                    switch (status) {
                        case 0: return 'รอคิว';
                        case 1: return 'กำลังทำงาน...';
                        case 2: return 'สำเร็จ';
                        case 3: return 'ยกเลิก';
                        case 4: return 'ล้มเหลว';
                        default: return 'ไม่ทราบสถานะ';
                    }
                };
                return (

                    <Chip
                        className="w-[150px]"
                        size="medium"
                        variant="outlined"
                        color={getStatusColor(Number(p.row.status))}
                        label={getStatusLabel(Number(p.row.status))}
                    />

                );
            }
        },
        {
            field: 'edit',
            headerName: 'จัดการ',
            headerAlign: 'center',
            align: 'center',
            resizable: false,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params: GridVal) => {
                const reportDetail = () => {
                    router.push(`/reports/${params.row.input_id}?from=dashboard&check=${encodeURIComponent(props.check)}`)
                }
                const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                    if (e.button === 1) {
                        // ถ้าเมาส์กลาง (Middle Click) ให้เปิดแท็บใหม่
                        e.preventDefault(); // ป้องกัน default 
                        window.open(`/reports/${params.row.input_id}?from=dashboard&check=${encodeURIComponent(props.check)}`, '_blank');
                    }
                };

                return (
                    <Tooltip title={'อ่านรายงาน'} placement="top">
                        <Button
                            onClick={reportDetail}
                            onMouseDown={handleMouseDown}
                            size="small"
                            variant="outlined">
                            <FindInPageIcon />
                        </Button>
                    </Tooltip>
                )
            }
        },
    ];


    return (

        <div className="w-full h-full overflow-auto">
            <DataGrid
                density={'standard'}
                // loading={rpLoading}
                rows={QData}
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