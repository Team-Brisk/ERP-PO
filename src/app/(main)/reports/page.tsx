'use client'
import { errorMessage, successMessage } from "@/utils/messageAlert";
import axios from "@/app/config/axiosConfig";
import { useEffect, useState } from "react";
import { BASE_API } from "../api";
import { useRouter } from "next/navigation";
import { useStoreData } from "@/app/hooks/useStoreData";
import type { Reports, RpResult } from "@/models/srmReport";
import { Credential } from "@/models/users";
import { Button, Chip, Divider, IconButton, Paper, TextField, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import SelectCraneMenu from "@/app/components/form/SelectCraneMenu";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useDateConverter } from "@/utils/dateConverter";
import FindInPageIcon from '@mui/icons-material/FindInPage';
import MuiReportTable from "@/app/components/dataTable/MuiReportTable";
import type { TypeOrderSrm } from "@/app/components/form/OrderTypeSelect";
import SelectRpResult from "@/app/components/form/SelectRpResult";
import ClearIcon from '@mui/icons-material/Clear';
import OrderTypeSelect from "@/app/components/form/OrderTypeSelect";
import Container from "@/app/components/layout/Container";

export default function Reports() {
    const setPageTitle = useStoreData((state) => state.setPageTitle)
    const router = useRouter()

    const [reports, setReports] = useState<Array<Reports>>()

    // credential data
    const [credential, setCredential] = useState<Credential | null>(null)
    const [userId, setUserId] = useState<number | null>(null)
    const [companyId, setCompanyId] = useState<number>()

    // data table 
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [isFirstLoad, setIsFirstLoad] = useState<boolean>(false)
    const pageSize = [25, 50, 100, 500]
    const [pageSizeSl, setPageSizeSl] = useState<number>(pageSize[0])
    const [startItem, setStartItem] = useState<number>()
    const [endItem, setEndItem] = useState<number>()
    const [totalItem, setTotalItem] = useState<number>(0)

    // filter
    const [search, setSearch] = useState<string>('')
    const [orderType, setOrderType] = useState<TypeOrderSrm>('NoSelect')
    const [dateFilter, setDateFilter] = useState<any>(null)
    const [srm, setSrm] = useState<number | null>(null)
    const [rpResult, setRpResult] = useState<RpResult | string>('ยังไม่เลือก')

    useEffect(() => {
        setPageTitle('รายงานการตรวจสอบ')
        document.title = 'รายงานการตรวจสอบ'
        const credential = JSON.parse(localStorage.getItem('Credential')!) as Credential
        if (!credential) {
            router.push('/login');
            return;
        }

        setCredential(credential)
        setUserId(credential.userData.user_id)

        const getReport = async () => {
            try {
                const data = {
                    startItem: 0,
                    endItem: 200,
                    userId: credential?.userData.user_id
                }
                const res = await axios.post(`${BASE_API}/get_reports`, data)
                if (res.status === 200) {
                    setReports(res.data.reports);
                } else {
                    throw new Error(res.data.msg)
                }
            } catch (err: any) {
                errorMessage(err)
            }
        }

        getReport()
    }, [])

    const clearFilter = async () => {
        setRpResult('ยังไม่เลือก')
        setSrm(null)
        setDateFilter(null)
        setOrderType('NoSelect')
        setSearch('')
    }

    return (
        <Container>
            <Paper
                sx={{ height: 'calc(100vh) - 100px' }}
                className="flex-1 p-4"
            >
                <div className="w-full grid grid-cols-4 gap-4">
                    <TextField
                        value={search}
                        onChange={(v) => {
                            setSearch(v.target.value)
                        }}
                        label={'บาร์โค้ด'}
                        size={'medium'}
                        slotProps={{
                            inputLabel: { shrink: true }
                        }}
                    ></TextField>

                    <OrderTypeSelect
                        isClear={orderType === null}
                        onUpdate={(v: TypeOrderSrm) => {
                            setOrderType(v)
                        }}
                    ></OrderTypeSelect>

                    <SelectRpResult
                        onUpdate={(v: RpResult | string) => {
                            setRpResult(v)
                        }}
                    >
                    </SelectRpResult>

                    <SelectCraneMenu
                        selectSize="medium"
                        siteId={54}
                        isSrmp={false}
                        onUpdate={(e) => {
                            setSrm(e.craneId)
                        }}
                    >
                    </SelectCraneMenu>
                    <LocalizationProvider dateAdapter={AdapterDayjs}  >
                        <DatePicker
                            value={dateFilter}
                            onChange={(newValue) => {
                                console.log(String(newValue));
                                setDateFilter(newValue)
                            }}
                            className='w-full bg-white'
                            slotProps={{
                                textField: { size: 'medium' }
                            }}
                            label={'วันที่'} />
                    </LocalizationProvider>
                    <div className="w-full">
                        <div className="w-fill flex flex-row gap-4 items-end justify-between" >
                            <Tooltip
                                title={'เคลียร์ Filter'}
                                placement="right"
                            >
                                <ToggleButton
                                    size="small"
                                    className="w-fit"
                                    value="clear"
                                    onClick={() => { clearFilter() }}
                                >
                                    <ClearIcon></ClearIcon>
                                </ToggleButton>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </Paper>
            <MuiReportTable
                filterDate={dateFilter}
                filterSearch={search}
                filterSRM={srm}
                filterOrderType={orderType}
                filterResult={rpResult}
            ></MuiReportTable>
        </Container>


    );
} 