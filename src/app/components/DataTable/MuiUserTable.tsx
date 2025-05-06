'use clinet'

import { Users } from "@/models/users"
import { useEffect, useRef, useState } from "react"
import { Avatar, Button, Chip, Divider, Paper, TextField, ToggleButton, Tooltip } from "@mui/material";
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
// const currentUserRole = useStoreData((state) => state.currentUserRole); // สมมุติว่าดึงจาก store


const DRAWER_WIDTH = 240;

interface gridVal {
    row: Users
}

export default function MuiUserTable() {
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
        setSearchTrigger(Date.now())
    }, [search])

    const deleteUser = async (userId: number) => {
        try {
            const isConfirmed = await _msg.confirm('คุณต้องการลบผู้ใช้งานใช่ไหม');
            if (isConfirmed) {
                const res = await axios.post(`${BASE_API}/delete_user`, { userId: userId })
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
            setDataLoading(true)
            let startItem
            let endItem
            startItem = page * pageSize  // คำนวณ startItem และ endItem
            endItem = startItem + pageSize - 1

            let data = {}
            let api = `${BASE_API}`

            if (search != '') {
                api = api + `/search_users`
                data = {
                    search,
                    startItem,
                    endItem
                }
            } else {
                api = api + `/get_users_list`
                data = {
                    startItem,
                    endItem
                }
            }
            const res = await axios.post(`${api}`, data)
            if (loggedInRole) {
                if (res.status === 200 && loggedInRole === 1) {
                    setTotalItem(res.data.totalItem)
                    setUsers(res.data.usersData.filter((u: Users) => u.role !== 2));
                }
                else if (res.status === 200 && loggedInRole === 2) {
                    setTotalItem(res.data.totalItem)
                    setUsers(res.data.usersData)
                }
                else {
                    throw new Error(res.data.msg)
                }
            }
        } catch (err: any) {
            errorMessage({ message: err })
        } finally {
            setDataLoading(false)
        }
    }

    const cols: GridColDef[] = [
        {
            field: 'emp_id',
            headerName: 'รหัสพนักงาน',
            width: 130,
            align: 'center',
            headerAlign: 'center',
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            resizable: false,
            renderCell: (p: gridVal) => {
                return (

                    <span> {p.row.employee_id} </span>

                )
            }
        },
        {
            field: 'users',
            headerName: 'ผู้ใช้',
            width: 50,
            align: 'center',
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            resizable: false,
            renderCell: (p: gridVal) => {
                return (
                    <div className="obj-center h-full w-full">
                        <Tooltip
                            placement="top"
                            title={`${p.row.first_name} ${p.row.last_name}`}>
                            <Avatar alt={p.row.profile_picture} src={p.row.profile_picture}></Avatar>
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            field: 'username',
            headerName: 'ชื่อผู้ใช้งาน',
            width: 250,
            align: 'left',
            headerAlign: 'left',
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            resizable: false,
            renderCell: (p: gridVal) => {
                return (
                    <>
                        <span> {p.row.user_name} </span>
                    </>
                )
            }
        },
        {
            field: 'fullname',
            headerName: 'ชื่อ-นามสกุล',
            flex: 1,
            align: 'left',
            headerAlign: 'left',
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            resizable: false,
            renderCell: (p: gridVal) => {
                return (
                    <>
                        <span>
                            {p.row.first_name} {p.row.last_name}
                        </span>
                    </>
                )
            }
        },
        {
            field: 'srm_resp',
            headerName: 'เครนที่รับผิดชอบ',
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
                        <Chip
                            variant="outlined"
                            size="medium"
                            color={(p.row.srm_resp) ? 'info' : 'default'}
                            className="w-full"
                            label={(p.row.srm_resp) ? p.row.srm_resp : 'ยังไม่ถูกระบุ'}
                        />

                    </>
                )
            }
        },
        {
            field: 'role',
            headerName: 'สิทธิ์',
            width: 150,
            align: 'center',
            headerAlign: 'center',
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            resizable: false,
            renderCell: (p: gridVal) => {
                const { label, color } = getRoleProps(p.row.role);
                return (

                    <Chip
                        size="medium"
                        variant="outlined"
                        className="w-full"
                        label={label}
                        color={color as any}
                    />

                )
            }
        },
        {
            field: 'edit',
            headerName: 'จัดการ',
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
                        <div className="h-full w-full flex flex-row gap-2 py-1 justify-center items-center">
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                    setFromPage(pathName)
                                    router.push(`/user-details/${p.row.user_id}`);
                                }}
                            >
                                รายละเอียด
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => deleteUser(p.row.user_id)}
                            >
                                ลบ
                            </Button>
                        </div>
                    </>
                )
            }
        },
    ]

    return (
        <>
            <Paper
                // sx={{ height: 'calc(100vh - 100px)', }}
                className="min-w-0 w-full flex flex-col py-4 gap-2"
            >
                <div className="flex justify-end gap-2 pb-2 px-4">
                    <TextField
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        size='medium'
                        className='w-auto min-w-[600px]'
                        label={'ค้นหา'}
                        placeholder='กรอกชื่อผู้ใช้หรือรหัสพนักงาน'
                        InputLabelProps={{
                            shrink: true
                        }}>
                    </TextField>
                </div>
                <Divider></Divider>
                <DataGrid
                    ref={dataGridRef}
                    style={{ width: isDrawerOpen ? `${dataGridWidth}px` : '100%' }} // ถ้าไม่มีค่า ใช้ 100% 
                    sx={{ border: 0 }}
                    density={'comfortable'}
                    loading={dataLoading}
                    rows={users}
                    columns={cols}
                    getRowId={(row) => row.user_id}
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
        </>
    )
}