import { useStoreData } from "@/app/hooks/useStoreData";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";

interface PageChangeEvent {
    currentPage: number
    startItem: number
    endItem: number
}

interface MyPaginationProps {
    pageSize: Array<number>
    currentPage: number
    totalItem: number
    onPageSizeChange: (pageSize: number) => void
    onPageChange: (event: PageChangeEvent) => void
    propsChecker?: boolean
}

/**
 * Props ที่ต้องส่งมา
 * @param pageSize ส่งข้อมูลจำนวนรายการที่ต้องการแสดงมาเป็น Array<number>
 * @param currentPage ส่งหน้าปัจจุบันมาเพื่อคำนวนณ startItem และ endItem แล้วส่งกลัไปที่ parent
 * @param totalItem ส่งข้อมูลจำนวนรายการทั้งหมดมาเพื่อคำนวณ totalPage
 * @param onPageSizeChange (ใช้กรณีที่ parent มี search) เป็นฟังก์ชันที่จะส่งค่าจำนวนรายการที่ต้องการแสดงออกไปที่ parent เพื่อคำนวณ start item กับ end item ใหม่ที่ parent ในกรณีที่ search กำลังทำงาน 
 * @param onPageChange เป็นฟังก์ชันที่จะส่งค่า current page , start item และ end item ออกไปให้ parent 
 * @returns 
 */
export default function MyPagination(props: MyPaginationProps) {
    const paginationPage = useStoreData((state) => state.paginationPage); // ดึงค่าปัจจุบัน
    const setPaginationPage = useStoreData((state) => state.setPaginationPage); // ฟังก์ชันสำหรับตั้งค่า

    const [pageSizeSl, setPageSizeSl] = useState<number>(paginationPage)
    const [totalPage, setTotalPage] = useState<number>(Math.ceil(props.totalItem / props.pageSize[0]))
    const [currentPage, setCurrentPage] = useState<number>(props.currentPage)

    const startItem = (currentPage - 1) * pageSizeSl
    const endItem = startItem + (pageSizeSl - 1)

    useEffect(() => {
        if (props.propsChecker === true) {
            console.log(props);
        }
    }, [props])

    // update total page when page size changed
    useEffect(() => {
        setCurrentPage(1)
        setTotalPage(Math.ceil(props.totalItem / pageSizeSl))
    }, [pageSizeSl, props.totalItem])

    // send data change to parent
    useEffect(() => {
        // console.log('onPageChange');
        props.onPageChange({ currentPage, startItem, endItem })
    }, [currentPage, pageSizeSl])

    useEffect(() => {
        setPaginationPage(pageSizeSl)
    }, [pageSizeSl])


    useEffect(() => {
        setCurrentPage(props.currentPage)
    }, [props.currentPage])

    const nextPage = async () => {
        if (currentPage < totalPage) {
            setCurrentPage(currentPage + 1)
        }
    }

    const PreviosePage = async () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    return (

        <div className='w-full flex flex-row justify-end gap-2'>
            <FormControl className='w-24 shadow-xl'>
                <InputLabel size='small' id="selectLabel" className="text-orange">Size</InputLabel>
                <Select
                    value={pageSizeSl}
                    onChange={(e) => {
                        setPageSizeSl(Number(e.target.value))
                        props.onPageSizeChange((Number(e.target.value)))
                    }}
                    size='small'
                    labelId="selectLabel"
                    id="selectLabel"
                    color='primary'
                    label="Size"
                    className="w-full bg-white text-orange"
                >
                    {
                        props.pageSize.map((size) => (
                            <MenuItem className="text-orange" value={size} key={size}>
                                {size}
                            </MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            <div className='h-[40px] obj-center text-orange px-5 border-2 rounded-md bg-white shadow-xl'>
                Page {currentPage} of {totalPage} - Total item : {props.totalItem}
            </div>
            <div onClick={() => { PreviosePage() }}
                className={(currentPage === 1) ? 'btn-pagination-disabled' : 'btn-pagination'}>
                Previouse Page
            </div>
            <div onClick={() => { nextPage() }}
                className={(currentPage === totalPage) ? 'btn-pagination-disabled' : 'btn-pagination'}>
                Next Page
            </div>
        </div>

    )
}