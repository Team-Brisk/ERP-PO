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
// const currentUserRole = useStoreData((state) => state.currentUserRole); // สมมุติว่าดึงจาก store


const DRAWER_WIDTH = 240;

interface gridVal {
    row: PoMaster
}

export default function OrderPage() {
    const router = useRouter();
    const pathName = usePathname();
    const _msg = new MsgAlert();
    const [loggedInRole, setLoggedInRole] = useState<number | null>(null);

    const setFromPage = useStoreData((state) => state.setFromPage)
    const [users, setUsers] = useState<Array<Users>>()
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
    const getRoleProps = (role: number) => {
        switch (role) {
            case 0:
                return { label: 'ผู้ใช้งาน', color: 'default' };
            case 1:
                return { label: 'หัวหน้างาน', color: 'primary' };
            case 2:
                return { label: 'ผู้พัฒนาระบบ', color: 'warning' };
            default:
                return { label: 'ไม่ทราบสิทธ์', color: 'error' };
        }
    };

    const [order, setOrder] = useState<{ id:string, order_no: string; }[]>([]);
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
         fetchOrder();
        setSearchTrigger(Date.now())
    }, [search])
const fetchOrder= async () => {
  try {
    const res = await axios.post(`${BASE_API}/po/getAllOrder`);
    if (res.data) {
      const data = res.data.map((item: any) => ({
        id: item.id,             // ✅ เพิ่ม id ที่ไม่ซ้ำ
        order_no: item.order_no, // ✅ ควรใช้ชื่อให้ตรงกับจริง
      }));
      setOrder(data);
    }
  } catch (err) {
    console.error('Failed to fetch orders:', err);
  }
};


    const deleteUser = async (userId: number) => {
        try {
            const isConfirmed = await _msg.confirm('คุณต้องการลบผู้ใช้งานใช่ไหม');
            if (isConfirmed) {
                const res = await axios.post(`${BASE_API}/getAllPOs`)
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
            // setDataLoading(true)
            // let startItem
            // let endItem
            // startItem = page * pageSize  // คำนวณ startItem และ endItem
            // endItem = startItem + pageSize - 1

            // let data = {}
            // let api = `${BASE_API}`

            // if (search != '') {
            //     api = api + `/search_users`
            //     data = {
            //         search,
            //         startItem,
            //         endItem
            //     }
            // } else {
            //     api = api + `/get_users_list`
            //     data = {
            //         startItem,
            //         endItem
            //     }
            // }
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
        {
            field: 'emp_id',
            headerName: 'Order',
            
            width: 130,
            align: 'center',
            headerAlign: 'center',
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            resizable: false,
            renderCell: (p: gridVal) => {
                return (

                    <span> {p.row.order_no} </span>

                )
            }
        },
        {
            field: 'users',
            headerName: 'Line',
            width: 50,
            align: 'center',
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            resizable: false,
            renderCell: (p: gridVal) => {
                return (
                    <span> {p.row.line} </span>

                )
            }
        },
        {
            field: 'username',
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
        {
            field: 'fullname',
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
                    <>
                        <span>
                            {p.row.buy_from_partner_code} 
                        </span>
                    </>
                )
            }
        },
        {
            field: 'srm_resp',
            headerName: 'Site',
            width: 150,
            align: 'center',
            headerAlign: 'center',
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            resizable: false,
            renderCell: (p: gridVal) => {
                return (
                    <>
                        <span> {p.row.site_code} </span>

                    </>
                )
            }
        },
        // {
        //     field: 'role',
        //     headerName: 'Item',
        //     width: 150,
        //     align: 'center',
        //     headerAlign: 'center',
        //     filterable: false,
        //     sortable: false,
        //     disableColumnMenu: true,
        //     resizable: false,
        //     renderCell: (p: gridVal) => {
               
        //         return (

        //            <span> {p.row.item_code} </span>

        //         )
        //     }
        // },
    {
  field: 'Details',
  headerName: 'Item Details',
  width: 200,
  renderCell: (p: gridVal) => (
    <div className="flex flex-col">
       <span>{p.row.item_code} - {p.row.item_description}</span>
    </div>
  )
} , {
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
                        InputLabelProps={{ shrink: true }}
                        />
                    )}
                    disableClearable={false}
                    openOnFocus
                    // filterOptions={(x) => x}
                    />
            </div>

            <div className="w-1/2">
                {/* <Autocomplete
                options={order} // หรือเปลี่ยนเป็น options อื่น เช่น `projects`
                getOptionLabel={(option) => option.order_no || ''}
                isOptionEqualToValue={(opt, val) => opt.id === val.id}
                value={order.find((d) => d.order_no === order_no) || null}
                onChange={(e, newValue) => {
                    setOrder_no(newValue?.order_no || '');
                }}
                renderInput={(params) => (
                    <TextField
                    {...params}
                    label="ค้นหา Order (อีกอัน)"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    />
                )}
                disableClearable={false}
                openOnFocus
                filterOptions={(x) => x}
                /> */}
            </div>
            </div>

                                    
              {/* <div className="flex justify-end gap-2 pb-2 px-4">
            //         <TextField
            //             value={search}
            //             onChange={(e) => setSearch(e.target.value)}
            //             size='medium'
            //             className='w-auto min-w-[600px]'
            //             label={'ค้นหา'}
            //             placeholder=''
            //             InputLabelProps={{
            //                 shrink: true
            //             }}>
            //         </TextField>
            //     </div> */}
              <Divider sx={{ borderColor: '#1976d2' }} />  
                <DataGrid
                    ref={dataGridRef}
                    style={{ width: isDrawerOpen ? `${dataGridWidth}px` : '100%' }} // ถ้าไม่มีค่า ใช้ 100% 
                    sx={{ border: 0 ,
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
    },    '& .MuiDataGrid-row:nth-of-type(odd)': {
  backgroundColor: '#ffffff',  // สีเทาอ่อน
},
'& .MuiDataGrid-row:nth-of-type(even)': {
  backgroundColor: '#ffffff',  // สีขาว
},
                 
                    }}
                    density={'comfortable'}
                    loading={dataLoading}
                    rows={users}
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