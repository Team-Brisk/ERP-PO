'use clinet'

import { Users } from "@/models/users"
import { useEffect, useRef, useState } from "react"
import { Autocomplete, Avatar, Button, Chip, Divider, Paper, TextField, ToggleButton, Tooltip } from "@mui/material";
import FindInPageIcon from '@mui/icons-material/FindInPage';
import { Reports, RpResult } from "@/models/srmReport";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { convertDateToShort, useDateConverter } from "@/utils/dateConverter";
import { BASE_API } from "@/app/(main)/api";
import { usePathname, useRouter } from "next/navigation";
import axios from '@/app/config/axiosConfig'
import { Credential } from "@/models/users";
import { errorMessage, successMessage } from "@/utils/messageAlert";
import { TypeOrderSrm } from "../form/OrderTypeSelect";
import { convertDateToISO } from "@/utils/dateConverter";
import MsgAlert from "@/utils/sweetAlert";
import { useStoreData } from "@/app/hooks/useStoreData";
import { color } from "framer-motion";
import errorHandler from "@/utils/errorHandler";
import { PoMaster } from "@/models/poMaster";
import { fetchOrder } from "@/app/services/orderService";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// const currentUserRole = useStoreData((state) => state.currentUserRole); // สมมุติว่าดึงจาก store

const DRAWER_WIDTH = 240;

interface gridVal {
    row: PoMaster
}

export default function OrderPage() {
    //--------------------------FillTer-------------------------------/////
    const [orderFilter, setOrderFilter] = useState('');
    const [lineFilter, setLineFilter] = useState('');
    const [sequenceFilter, setSequenceFilter] = useState('');
    const [partnerFilter, setPartnerFilter] = useState('');
    const [siteFilter, setSiteFilter] = useState('');
    const [dateFilter, setDateFilter] = useState<string>('');
    //---------------------------------------------------------/////
    const router = useRouter();
    const pathName = usePathname();
    const _msg = new MsgAlert();
    const [loggedInRole, setLoggedInRole] = useState<number | null>(null);

    const setFromPage = useStoreData((state) => state.setFromPage)
    const [users, setUsers] = useState<Array<PoMaster>>()
    const [dataLoading, setDataLoading] = useState<boolean>(false)
    const [totalItem, setTotalItem] = useState<number>(0)
    const [page, setPage] = useState(0)  // Page number (0-indexed)
    const [pageSize, setPageSize] = useState(25)  // Number of rows per page
    const [search, setSearch] = useState<string>('')
    const [searchTrigger, setSearchTrigger] = useState(Date.now());
    const isDrawerOpen = useStoreData((state) => state.isDrawerOpen);
    const [dataGridWidth, setDataGridWidth] = useState<number | null>(null);
    const [lastKnownWidth, setLastKnownWidth] = useState<number | null>(null);
    const dataGridRef = useRef<HTMLDivElement>(null);
    const [poMaster, setPoMaster] = useState<Array<PoMaster>>()
    const filteredUsers = (users || []).filter((u) =>
        (u.order_no || '').toLowerCase().includes(orderFilter.toLowerCase()) &&
        String(u.line || '').toLowerCase().includes(lineFilter.toLowerCase()) &&
        String(u.sequence || '').toLowerCase().includes(sequenceFilter.toLowerCase()) &&
        (u.buy_from_partner_code || '').toLowerCase().includes(partnerFilter.toLowerCase()) &&
        (u.site_code || '').toLowerCase().includes(siteFilter.toLowerCase()) &&
        (!dateFilter || (u.created_at && new Date(u.created_at).toISOString().slice(0, 10) === dateFilter))
    );
    const [order, setOrder] = useState<{ id: string, order_no: string; }[]>([]);
    const [order_no, setOrder_no] = useState('');
    useEffect(() => {
        const credentialString = localStorage.getItem('Credential');
        if (credentialString) {
            const credential = JSON.parse(credentialString);
            const { role } = credential?.userData || {};
            setLoggedInRole(parseInt(role, 10)); // Parse as integer for easier comparison
        }
        if (dataGridRef.current) {
            if (isDrawerOpen) {
                setDataGridWidth(dataGridRef.current.offsetWidth);
            }
        }

        fetchUser()

    }, [page, searchTrigger, loggedInRole, isDrawerOpen])


    useEffect(() => {
        if (search !== '') {
            setPage(0);
        }

        const loadOrder = async () => {
            const data = await fetchOrder();
            setOrder(data);
        };
        loadOrder();
        //  fetchOrder();
        setSearchTrigger(Date.now())
    }, [search])

    // const fetchOrder= async () => {
    //   try {
    //     const res = await axios.post(`${BASE_API}/po/getAllOrder`);
    //     if (res.data) {
    //       const data = res.data.map((item: any) => ({
    //         id: item.id,             // ✅ เพิ่ม id ที่ไม่ซ้ำ
    //         order_no: item.order_no, // ✅ ควรใช้ชื่อให้ตรงกับจริง
    //       }));
    //       setOrder(data);
    //     }
    //   } catch (err) {
    //     console.error('Failed to fetch orders:', err);
    //   }
    // };


    const deleteUser = async (userId: number) => {
        try {
            const isConfirmed = await _msg.confirm('คุณต้องการลบผู้ใช้งานใช่ไหม');
            if (isConfirmed) {
                const res = await axios.post(`${BASE_API}/getAlPOs`)
                if (res.status === 200) {
                    successMessage(res.data.msg)
                    fetchUser()
                } else {
                    throw new Error('เกิดข้อผิดพลาดบางอย่าง')
                }
            }

        } catch (err: any) {
            errorHandler(err)
        }
    }

    const fetchUser = async () => {
        try {

            const res = await axios.post(`${BASE_API}/po/getAllPOsPost`, {
                order_no, // ✅ Send this to the backend
            });


            setTotalItem(res.data.length)
            setUsers(res.data)
        } catch (err: any) {
            errorMessage({ message: err })
        } finally {
            setDataLoading(false)
        }
    }

    const cols: GridColDef[] = [
        //-----------------Order-------------------------//
        {
            field: 'Order',
            headerName: 'Order',
            align: 'center',
            headerAlign: 'center',
            filterable: false,
            sortable: false,
            width: 130,
            disableColumnMenu: true,
            renderHeader: () => (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',  // horizontally center
                        justifyContent: 'center', // vertically center if needed
                        gap: 4,
                    }}
                >
                    <strong>Order</strong>
                    <TextField
                        value={orderFilter}
                        onChange={(e) => setOrderFilter(e.target.value)}
                        variant="outlined"
                        placeholder=""
                        size="small"
                        sx={{
                            backgroundColor: '#ffffff',
                            color: '#000000',
                            '& .MuiInputBase-input': {
                                color: '#000000',
                                padding: '4px 8px',
                                textAlign: 'center',
                            },
                            '& fieldset': {
                                borderColor: '#000000',
                            },
                            '&:hover fieldset': {
                                borderColor: '#000000',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#000000',
                            },
                        }}
                        InputProps={{ sx: { color: '#000000' } }}
                        InputLabelProps={{ sx: { color: '#000000' }, shrink: true }}
                    />
                </div>
            ),
            renderCell: (p: gridVal) => <span>{p.row.order_no}</span>,
        },

        //-----------------Line-------------------------//
        {
            field: 'line',
            headerName: 'Line',
            width: 100,
            sortable: true, // ✅ will work because field matches the data key
            // renderHeader: () => (
            //     <div className="flex flex-col items-center">
            //         <strong>Line</strong>
            //         <TextField
            //             value={lineFilter}
            //             onChange={(e) => setLineFilter(e.target.value)}
            //             variant="standard"
            //             placeholder=""
            //             InputProps={{ disableUnderline: true }}
            //             size="small"
            //             sx={{ textAlign: 'center' }}
            //         />
            //     </div>
            // ),
            renderCell: (p: { row: PoMaster }) => <span>{p.row.line}</span>,
        }
        ,



        //-----------------Sequence-------------------------//
        {
            field: 'Sequence',
            headerName: 'Sequence',
            width: 100,
            align: 'center',
            headerAlign: 'center',
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            resizable: false,
            renderCell: (p: gridVal) => {
                return (
                    <>
                        <span> {p.row.sequence} </span>
                    </>
                )
            }
        },
        //-----------------Buy from Business Partner-------------------------//
        {
            field: 'Buy from Business Partner',
            headerName: 'Buy from Business Partner',
            width: 200,
            align: 'left',
            headerAlign: 'center',
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            resizable: false,
            renderCell: (p: gridVal) => {
                return (
                    <span>{p.row.buy_from_partner_code} </span>
                )
            }
        },
        //-----------------------Site-------------------------------//
        {
            field: 'Site',
            headerName: 'Site',
            width: 200,
            align: 'left',
            headerAlign: 'center',
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            resizable: false,
            renderCell: (p: gridVal) => {
                return (
                    <>
                        <span>
                            {p.row.site_code}
                        </span>
                    </>
                )
            }
        },
        //-----------------------date-------------------------------//
        {
            field: 'date',
            headerName: 'date',
            width: 200,
            align: 'center',
            headerAlign: 'center',
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            resizable: false,
            renderCell: (p: gridVal) => {
                const formattedDate = p.row.created_at
                    ? new Date(p.row.created_at).toLocaleDateString('th-TH') // หรือ 'en-GB' สำหรับ dd/mm/yyyy
                    : '-';
                return (
                    <>
                        <span> {formattedDate} </span>

                    </>
                )
            }
        },
        //-----------------------Item Details-------------------------------//
        {
            field: 'Item Details',
            headerName: 'Item Details',
            width: 200,
            renderCell: (p: gridVal) => (
                <div className="flex flex-col">
                    <span>{p.row.item_code} - {p.row.item_description}</span>
                </div>
            )
        },
        //-----------------------project------------------------------//
        {
            field: 'project',
            headerName: 'Project',
            width: 200,
            align: 'center',
            headerAlign: 'center',
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            resizable: false,
            renderCell: (p: gridVal) => {
                return (
                    <>
                        <span> {p.row.project} </span>
                    </>
                )
            }
        },
        //-----------------------Ordered_Quantity------------------------------//
        {
            field: 'Ordered_Quantity',
            headerName: 'Ordered_Quantity',
            width: 200,
            align: 'center',
            headerAlign: 'center',
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            resizable: false,
            renderCell: (p: gridVal) => {
                return (
                    <>
                        <span> {p.row.ordered_quantity} </span>


                    </>
                )
            }
        },
        //-----------------------Received_Quantity------------------------------//

        {
            field: 'Received_Quantity',
            headerName: 'Received_Quantity',
            width: 200,
            align: 'center',
            headerAlign: 'center',
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            resizable: false,
            renderCell: (p: gridVal) => {
                return (
                    <>
                        <span> {p.row.received_quantity} </span>


                    </>
                )
            }
        },
        //-----------------------Price------------------------------//
        {
            field: 'Price',
            headerName: 'Price',
            width: 200,
            align: 'center',
            headerAlign: 'center',
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            resizable: false,
            renderCell: (p: gridVal) => {
                return (
                    <>
                        <span> {p.row.price} </span>


                    </>
                )
            }
        },
    ]

    return (

        <Paper
            // sx={{ height: 'calc(100vh - 100px)', }}
            className="min-w-0 w-full flex flex-col py-4 gap-2"

        >
            <div className="flex flex-row gap-4 px-4 pb-2">
                {/* ซ้าย: Autocomplete */}
                <div className="w-1/2">
                    <Autocomplete
                        options={order}
                        getOptionLabel={(option) => option.order_no || ''}
                        isOptionEqualToValue={(opt, val) => opt.id === val.id}
                        value={order.find((d) => d.order_no === order_no) || null}
                        onChange={(e, newValue) => {
                            setOrder_no(newValue?.order_no || '');
                            setSearchTrigger(Date.now());
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="ค้นหา Order"
                                fullWidth
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    height: '60px', // ทำให้สูงเท่ากับ DatePicker
                                }}
                            />
                        )}
                        disableClearable={false}
                        openOnFocus
                    />
                </div>

                {/* ขวา: Date Picker */}
                <div className="w-1/2">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="วันที่"
                            value={dateFilter ? dayjs(dateFilter) : null}
                            onChange={(newValue) => {
                                setDateFilter(newValue?.format('YYYY-MM-DD') || '');
                            }}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    size: 'small',
                                    sx: {
                                        height: '60px',
                                    },
                                    InputLabelProps: { shrink: true },
                                },
                                actionBar: {
                                    actions: ['clear', 'accept'], // เพิ่มปุ่ม Clear
                                },
                            }}
                        />
                    </LocalizationProvider>
                </div>
            </div>



            <Divider sx={{ borderColor: '#1976d2' }} />
            <DataGrid
                ref={dataGridRef}
                style={{ width: isDrawerOpen ? `${dataGridWidth}px` : '100%' }} // ถ้าไม่มีค่า ใช้ 100% 
                sx={{
                    border: 0,
                    //                  '& .super-app-theme--header': {
                    //                     backgroundColor: 'rgba(212, 223, 245, 0.94)',

                    // }, 
                    borderColor: '#ccc', // กรอบรอบนอก
                    '& .MuiDataGrid-cell': {
                        borderRight: '1px solid #ccc',
                        borderBottom: '1px solid #ccc',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        borderBottom: '2px solid #1976d2',
                    },
                    '& .MuiDataGrid-columnHeader': {
                        borderRight: '1px solid #ccc',
                        backgroundColor: 'rgba(212, 223, 245, 0.94)', // หรือรวมกับ class super-app-theme--header
                    },
                    '& .MuiDataGrid-row': {
                        backgroundColor: '#fff',
                    }, '& .MuiDataGrid-row:nth-of-type(odd)': {
                        backgroundColor: '#ffffff',  // สีเทาอ่อน
                    },
                    '& .MuiDataGrid-row:nth-of-type(even)': {
                        backgroundColor: '#ffffff',  // สีขาว
                    },

                }}
                density={'comfortable'}
                loading={dataLoading}
                rows={filteredUsers}
                columns={cols}
                getRowId={(row) => row.id} // ✅ บอกให้ใช้ `id` ของแต่ละ row
                checkboxSelection={false}
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

    )
}