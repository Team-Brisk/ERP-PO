import { Avatar, Button, Chip, Divider, Paper, ToggleButton, Tooltip } from "@mui/material";
import FindInPageIcon from '@mui/icons-material/FindInPage';
import { Reports, RpResult } from "@/models/srmReport";
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
import MsgAlert from "@/utils/sweetAlert";
import { useStoreData } from "@/app/hooks/useStoreData";
import StatusBtn from "../button/StatusBtn";
import ShowLocationBtn from "../button/ShowLocationBtn";

interface Props {
    isHeightAuto?: boolean
    disableTool?: boolean
    userId?: string | number | null
    filterDate?: Date | string | null
    filterOrderType?: TypeOrderSrm
    filterSRM?: number | null
    filterSearch?: string | null
    filterResult?: RpResult | null | string
    density?: 'compact' | 'standard' | 'comfortable'
}

interface gridVal {
    row: Reports
}

export default function MuiReportTable(props: Props) {
    const _msg = new MsgAlert()
    const router = useRouter()
    const [reports, setReports] = useState<Array<Reports>>()
    const setLoadingPage = useStoreData((state) => state.setLoadingPage)

    // credential data
    const [credential, setCredential] = useState<Credential | null>(null)
    const [userId, setUserId] = useState<number | null>(null)
    const [companyId, setCompanyId] = useState<number>()
    const [role, setRole] = useState<0 | 1 | 2 | null>()

    const [rpLoading, setRpLoading] = useState<boolean>(false)
    const [totalItem, setTotalItem] = useState<number>(0)
    const [page, setPage] = useState(0)  // Page number (0-indexed)
    const [pageSize, setPageSize] = useState(100)  // Number of rows per page

    const [searchTrigger, setSearchTrigger] = useState(Date.now());

    useEffect(() => {
        const credential = JSON.parse(localStorage.getItem('Credential')!) as Credential
        if (!credential) {
            router.push('/login');
            return;
        }
        setCredential(credential)
        setUserId(credential.userData.user_id)
        setRole(credential.userData.role)
        getReport();
    }, [page, pageSize, searchTrigger])


    useEffect(() => {
        // รีเซ็ต page เมื่อ filter เปลี่ยนแปลง
        if (props.filterSearch
            || props.filterDate
            || props.filterOrderType
            || props.filterSRM
            || props.filterResult) {

            setPage(0);
            setSearchTrigger(Date.now())
        }
    }, [props.filterSearch, props.filterDate, props.filterOrderType, props.filterSRM, props.filterResult]);

    const getReport = async () => {
        let srm: number | null = null;
        if (props.filterSRM !== undefined && props.filterSRM !== 0) { srm = props.filterSRM; }
        let rpResult: string | null = null;
        if (props.filterResult && props.filterResult !== 'ยังไม่เลือก') { rpResult = props.filterResult; }

        setRpLoading(true)
        try {
            let startItem
            let endItem
            startItem = page * pageSize  // คำนวณ startItem และ endItem
            endItem = startItem + pageSize - 1

            let data = {}
            let api = `${BASE_API}`

            if (
                (props.filterSearch !== '' && props.filterSearch) ||
                (props.filterDate !== null && props.filterDate) ||
                (props.filterOrderType !== null && props.filterOrderType) ||
                (props.filterSRM !== null && props.filterSRM) ||
                (props.filterResult !== null && props.filterResult)
            ) {
                api = api + `/search_reports`
                data = {
                    barcode: props.filterSearch ?? null,
                    date: (props.filterDate !== null && props.filterDate !== undefined) ? convertDateToISO(String(props.filterDate)) : null,
                    srm: srm,
                    orderType: props.filterOrderType ?? null,
                    userId: (props.userId) ? props.userId : null,
                    rpResult: rpResult,
                    startItem: startItem,
                    endItem: endItem
                }
            } else {
                api = api + `/get_reports`
                data = {
                    startItem: startItem,
                    endItem: endItem,
                    userId: (props.userId) ? props.userId : null
                }
            }
            const res = await axios.post(api, data)
            if (res.status === 200) {
                const data = res.data as { msg: string, reports: Array<Reports>, totalItem: number }
                setReports(data.reports);
                setTotalItem(data.totalItem);

            } else {
                throw new Error(res.data.msg)
            }
        } catch (err: any) {
            errorMessage(err)
        }
        setRpLoading(false)
    }

    const cols: GridColDef[] = [
        {
            field: 'date_time',
            headerName: 'วันที่',
            headerAlign: 'center',
            align: 'center',
            disableColumnMenu: true,
            resizable: false,
            width: 150,
            valueGetter: (v, r: Reports) => { return convertDateToShort(r.date_time) + ' น.' }
        },
        {
            field: 'img_bcode_number',
            headerName: 'บาร์โค้ด',
            headerAlign: 'center',
            align: 'center',
            disableColumnMenu: true,
            resizable: false,
            width: 130,
            renderCell: (p: gridVal) => {
                return (
                    <>
                        {(p.row.order_type === 'barcode') ? (
                            <>
                                {p.row.wcs_barcode_number ?? ' - '}
                            </>
                        ) : (
                            <>
                                {p.row.img_bcode_number ?? ' - '}
                            </>
                        )}
                    </>
                )
            }


        },

        {
            field: 'rp_status',
            headerName: 'ผลลัพธ์',
            flex: 1,
            width: 100,
            sortable: false,
            disableColumnMenu: true,
            resizable: false,
            align: 'left',
            headerAlign: 'left',
            renderCell: (p: gridVal) => {
                return (
                    <StatusBtn
                        isOk={(p.row.rp_status === 'สำเร็จ')}
                        text={p.row.rp_status === 'สำเร็จ'
                            ? `สำเร็จ ${(p.row.rp_status_desc) ? `: ` + p.row.rp_status_desc : ''}`
                            : `ไม่สำเร็จ : ${(p.row.rp_status_desc) && p.row.rp_status_desc!}`}
                    ></StatusBtn>

                );
            }
        },
        {
            field: 'location',
            headerName: 'ตำแหน่ง',
            headerAlign: 'right',
            align: 'right',
            disableColumnMenu: true,
            sortable: true,
            width: 260,
            renderCell: (p: gridVal) => {
                let bank: string | number | undefined;
                let level: string | number | undefined;
                let bay: number | null | undefined;

                if (p.row.order_type === 'barcode') {
                    bank = p.row.wcs_bank;
                    level = p.row.wcs_level;
                    bay = p.row.wcs_bay;
                } else {
                    bank = p.row.in_bank;
                    level = p.row.in_level;
                    bay = p.row.in_bay;
                }

                const hasBay = bay !== null && bay !== undefined;

                if (hasBay) {
                    return (
                        // <Tooltip
                        //     placement="top"
                        //     title={`Bank: ${bank}, Level: ${level}, Bay: ${bay.toLocaleString()} mm.`}
                        // >
                        //     <span>{`${bank} - ${level} - ${bay.toLocaleString()} (mm.)`}</span>
                        // </Tooltip>
                        <div className="flex items-center justify-end h-full">
                            <ShowLocationBtn
                                bank={String(bank)}
                                bay={String(bay)}
                                level={String(level)}
                            ></ShowLocationBtn>
                        </div>
                    );
                }

                return <ToggleButton
                    sx={{
                        pointerEvents: "none",
                        '&:hover': { backgroundColor: 'transparent' },
                        '&:focus': { outline: 'none', boxShadow: 'none' },
                        '&:active': { backgroundColor: 'transparent' }
                    }}
                    size="small"
                    className="px-4"
                    value={'unknow'}
                >
                    <span>
                        ไม่พบตำแหน่ง
                    </span>
                </ToggleButton>
            }
        },

        {
            field: 'order_type',
            headerName: 'ประเภท',
            width: 110,
            align: 'center',
            headerAlign: 'center',
            disableColumnMenu: true,
            resizable: false,
            sortable: false,
            renderCell: (p: gridVal) => {
                return (
                    <ToggleButton
                        size="small"
                        className="px-4  w-full"
                        value={'unknow'}
                        sx={{
                            pointerEvents: "none",
                            '&:hover': { backgroundColor: 'transparent' },
                            '&:focus': { outline: 'none', boxShadow: 'none' },
                            '&:active': { backgroundColor: 'transparent' }
                        }}
                    >
                        <span>
                            {p.row.order_type === 'barcode' ? 'คิวงาน' : 'แมนนวล'}
                        </span>
                    </ToggleButton>
                );
            }
        },
        {
            field: 'crane',
            headerName: 'เครน',
            width: 100,
            align: 'center',
            headerAlign: 'center',
            disableColumnMenu: true,
            sortable: false,
            resizable: false,
            renderCell: (p: gridVal) => {
                return <ToggleButton
                    size="small"
                    className="px-4  w-full"
                    value={'unknow'}
                    color="primary"
                    sx={{
                        pointerEvents: "none",
                        '&:hover': { backgroundColor: 'transparent' },
                        '&:focus': { outline: 'none', boxShadow: 'none' },
                        '&:active': { backgroundColor: 'transparent' }
                    }}
                >
                    <span>
                        {p.row.crane.crane_name! ?? ' - '}
                    </span>
                </ToggleButton>
            }
        },
        {
            field: 'edit',
            width: 80,
            headerName: 'จัดการ',
            headerAlign: 'center',
            align: 'center',
            resizable: false,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params: gridVal) => {

                const handleClick = () => {
                    //คลิกซ้าย
                    setLoadingPage(true);
                    router.push(`/reports/${params.row.id}`);
                };

                const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                    if (e.button === 1) {
                        // ถ้าเมาส์กลาง (Middle Click) ให้เปิดแท็บใหม่
                        e.preventDefault(); // ป้องกัน default 
                        window.open(`/reports/${params.row.id}`, '_blank');
                    }
                };

                return (
                    <Tooltip title={'อ่านรายงาน'} placement="top">
                        <ToggleButton
                            onClick={handleClick}           // กดซ้าย
                            onMouseDown={handleMouseDown}  // กดกลาง
                            size="small"
                            className="px-4"
                            value={'unknow'}
                            color="primary"
                        >
                            <span>
                                <FindInPageIcon color="primary" />
                            </span>
                        </ToggleButton>
                        {/* <Button
                            onClick={handleClick}           // กดซ้าย
                            onMouseDown={handleMouseDown}  // กดกลาง
                            size="small"
                            variant="outlined"
                        >
                            <FindInPageIcon />
                        </Button> */}
                    </Tooltip>
                )
            }
        }

    ];


    return (
        <Paper
            sx={{ height: (props.isHeightAuto) ? 'h-auto' : null }}
            className="w-full flex flex-col p-4 gap-2"
        >
            {/* {
                (!props.disableTool) && (
                    <div className="w-full flex justify-end gap-2 invisible">
                        <ToggleButton value="0" size="small" className="px-4" color="success">
                            ส่งออก CSV
                        </ToggleButton>
                        <ToggleButton value="0" size="small" className="px-4" color="error" hidden={role === 0}>
                            ลบ
                        </ToggleButton>
                    </div>
                )
            }
            {
                (props.disableTool != true) && (
                    <Divider></Divider>
                )
            } */}
            <DataGrid
                density={(props.density) ? props.density : 'comfortable'}
                loading={rpLoading}
                rows={reports}
                columns={cols}
                getRowId={(row) => row.id}
                // checkboxSelection={role === 1}
                checkboxSelection={false}
                sx={{ border: 0 }}
                columnVisibilityModel={{
                    users: (role === 1 && (!props.userId))
                }}
                pagination
                paginationMode="server"
                rowCount={totalItem}
                paginationModel={{ page, pageSize }}
                onPaginationModelChange={(model) => {
                    setPage(model.page)
                    setPageSize(model.pageSize)
                }}
                pageSizeOptions={[25, 50, 100]}
            />
        </Paper>

    );
}