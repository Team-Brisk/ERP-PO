'use client'

import { Button, Card, FormControl, TextField } from '@mui/material';
import '../../styles/tailwind.css'
import { BASE_API } from '@/app/(main)/api';
import { useEffect, useState } from 'react';
import MsgAlert from '@/utils/sweetAlert';
import axios from 'axios';
import Image from 'next/image'
import { checkConfirmPassword, CheckField, checkEmployeeId } from '@/utils/FieldCheck'
import GateBar from "@/app/components/form/GateBar";
import { useRouter } from 'next/navigation';
export default function ForgotPassword() {

    const router = useRouter()
    const _msg = new MsgAlert()


    const [username, setUsername] = useState<string>('')
    const [firstname, setFirstname] = useState<string>('')
    const [lastname, setLastname] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confPassword, setConfPassword] = useState<string>('')
    const [employeeId, setEmployeeId] = useState<string>('')
    const [selectCompany, setSelectCompany] = useState<number>(0)

    const [loading, setLoading] = useState(false)


    useEffect(() => {
        document.title = 'Register'
        getCompany()
    }, [])


    const getCompany = async () => {
        try {
            const res = await axios.get(`${BASE_API}/get_companies`);
            const companies = res.data.company_data;
            if (companies.length > 0) {
                setSelectCompany(companies[0].company_id);
            }
            console.log(companies);
        } catch (err) {
            console.error(err);
        }
    };



    const handlePasswordUpdate = (status: boolean) => {
        console.log("Validation Result:", status);

    };

    const register = async () => {
        try {
            setLoading(true)
            const isEmployeeIdCorrect = await checkEmployeeId(employeeId) as CheckField
            if (isEmployeeIdCorrect.status === false) {
                return _msg.default_msg({ title: 'Error Employee ID', msg: String(isEmployeeIdCorrect.msg), icon: 'error' })
            }
            const isPasswordCorrect = await checkConfirmPassword(password, confPassword) as CheckField

            if (isPasswordCorrect.status === false) {
                return _msg.default_msg({ title: 'Error Password!', msg: String(isPasswordCorrect.msg), icon: 'error' })
            }

            const data = {
                username: username,
                password: password,
                companyId: selectCompany,
                employeeId: employeeId,
                firstname: firstname,
                lastname: lastname
            }

            const res = await axios.post(`${BASE_API}/register`, data)
            if (res.status === 201) {
                _msg.toast_msg({ title: res.data.msg, icon: 'success', progressbar: true, timer: 3 })
                setUsername('')
                setEmployeeId('')
                setConfPassword('')
                setPassword('')
                setLastname('')
                setFirstname('')
            } else if (res.status === 409) {
                _msg.default_msg({ title: res.data.msg, icon: 'success' })
            } else {
                throw new Error(res.data.msg)
            }

        } catch (err: any) {
            console.log(err);
            if (err.status === 409) {
                _msg.default_msg({ title: `Cann't Register`, msg: err.response.data.msg, icon: 'error' })
            } else {
                _msg.default_msg({ title: 'Something Wrong!', msg: String(err), icon: 'error' })
            }
        } finally {
            setLoading(false)
        }
    }
    const toLoginPage = () => {
        router.push('./login')
    }


    return (
        <div className='w-full min-h-screen h-full max-h-screen obj-center overflow-hidden '>
            <div className='container h-full flex flex-row justify-center items-center '>
                <Card className='w-[450px] h-auto p-4 bg-white flex flex-col gap-4'>
                    <FormControl className='flex flex-col gap-3 w-full'>
                        <div className='w-full flex flex-col justify-center items-center p-6'>
                            <Image
                                alt='amw logo'
                                width={100}
                                height={100}
                                className='w-full h-full'
                                src={'/logo/logo-horizontal.png'}
                            ></Image>
                            <span className='w-full text-center text-lg'>สมัครสมาชิก</span>
                        </div>
                        <TextField
                            value={employeeId}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value) && value.length <= 7) {
                                    setEmployeeId(value);
                                }

                            }}
                            color='primary'
                            placeholder=''
                            label={'รหัสพนักงาน'}
                            slotProps={{
                                inputLabel: { shrink: true }
                            }}

                        ></TextField>
                        <TextField

                            value={username}
                            onChange={(e) => { setUsername(e.target.value) }}
                            color='primary'
                            placeholder=''
                            className=' border-orange text-orange'
                            label={'ชื่อผู้ใช้งาน'}
                            slotProps={{
                                inputLabel: { shrink: true }
                            }}
                        ></TextField>
                        <TextField
                            value={firstname}
                            onChange={(e) => { setFirstname(e.target.value) }}
                            color='primary'
                            label={'ชื่อจริง'}
                            slotProps={{
                                inputLabel: { shrink: true }
                            }}

                        ></TextField>
                        <TextField
                            value={lastname}
                            onChange={(e) => { setLastname(e.target.value) }}
                            color='primary'
                            label={'นามสกุล'}
                            slotProps={{
                                inputLabel: { shrink: true }
                            }}

                        ></TextField>
                        <TextField
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                            color='primary'
                            type='password'
                            label={'รหัสผ่าน'}
                            slotProps={{
                                inputLabel: { shrink: true }
                            }}
                        ></TextField>
                        <TextField
                            value={confPassword}
                            onChange={(e) => { setConfPassword(e.target.value) }}
                            color='primary'
                            type='password'
                            label={'ยืนยันรหัสผ่าน'}
                            slotProps={{
                                inputLabel: { shrink: true }
                            }}
                        ></TextField>
                        <div className={
                            `${(!password) ? 'hidden' : null}`
                        }>
                            <GateBar
                                password={password}
                                confPassword={confPassword}
                                empId={employeeId}
                                onUpdate={handlePasswordUpdate}
                            />
                        </div>
                        <button
                            onClick={toLoginPage}
                            className='w-auto sm:text-right text-gray-500 hover:text-gray-600 hover:-translate-y-1 duration-200 cursor-pointer'>
                            กลับไปหน้าเข้าสู่ระบบ
                        </button>

                    </FormControl>
                    <div className=''>
                        <Button
                            loading={loading}
                            variant='outlined'
                            color='inherit'
                            className='w-full p-2'
                            onClick={() => {
                                register()
                            }}
                        >
                            สมัครสมาชิก
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
        // <div className='w-full min-h-screen h-full max-h-screen obj-center overflow-hidden '>
        //     <div className='container h-full flex flex-row justify-center items-center '>
        //         <div className='w-full h-full flex flex-col'>
        //             <div className='w-full px-10 lg:px-0 lg:w-[550px] bg-white '>
        //                 <div className='w-full font- mb-10 text-center text-4xl text-orange'>
        //                     REGISTER
        //                 </div>
        //                 <FormControl className='flex flex-col gap-4 w-full'>
        //                     <TextField
        //                         value={employeeId}

        //                         onChange={(e) => {
        //                             const value = e.target.value;
        //                             if (/^\d*$/.test(value) && value.length <= 7) {
        //                                 setEmployeeId(value);
        //                             }

        //                         }

        //                         }
        //                         // onBlur={handleBlur}

        //                         color='primary'
        //                         className=' border-orange text-orange'
        //                         placeholder='e.g. 6700884 , 6700636'
        //                         label={'Employee ID'}

        //                         InputLabelProps={{
        //                             shrink: true
        //                         }}

        //                     ></TextField>
        //                     {/* <FormControl>
        //                         <InputLabel id="company-select-label">Company</InputLabel>
        //                         <Select
        //                             id="company-select-label"
        //                             label="Company"
        //                             labelId="company-select-label"
        //                             value={selectCompany}
        //                             onChange={(e) => { setSelectCompany(Number(e.target.value)) }}
        //                             disabled
        //                         >
        //                             {
        //                                 companyData.map((company) => (
        //                                     <MenuItem value={company.company_id} key={company.company_id}>
        //                                         {company.company_name}
        //                                     </MenuItem>
        //                                 ))
        //                             }
        //                         </Select>
        //                     </FormControl> */}
        //                     <TextField
        //                         value={username}
        //                         onChange={(e) => { setUsername(e.target.value) }}
        //                         color='primary'
        //                         placeholder='Enter your username'
        //                         className=' border-orange text-orange'
        //                         label={'Username'}
        //                         InputLabelProps={{
        //                             shrink: true
        //                         }}
        //                     ></TextField>
        //                     <TextField
        //                         value={firstname}
        //                         onChange={(e) => { setPFirstname(e.target.value) }}
        //                         color='primary'
        //                         placeholder='Enter your FirstName'
        //                         className=' border-orange text-orange'
        //                         label={'FirstName'}
        //                         InputLabelProps={{
        //                             shrink: true
        //                         }}

        //                     ></TextField>
        //                     <TextField
        //                         value={lastname}
        //                         onChange={(e) => { setPLastname(e.target.value) }}
        //                         color='primary'
        //                         placeholder='Enter your LastName'
        //                         className=' border-orange text-orange'
        //                         label={'LastName'}
        //                         InputLabelProps={{
        //                             shrink: true
        //                         }}

        //                     ></TextField>
        //                     <TextField
        //                         value={password}
        //                         onChange={(e) => { setPassword(e.target.value) }}
        //                         color='primary'
        //                         type='password'
        //                         className=' border-orange text-orange'
        //                         label={'Password'}
        //                         InputLabelProps={{
        //                             shrink: true
        //                         }}
        //                     ></TextField>
        //                     <TextField
        //                         value={confPassword}
        //                         onChange={(e) => { setConfPassword(e.target.value) }}
        //                         color='primary'
        //                         type='password'
        //                         className=' border-orange text-orange'
        //                         label={'Confirm Password'}
        //                         InputLabelProps={{
        //                             shrink: true
        //                         }}
        //                     ></TextField>

        //                     <GateBar
        //                         password={password} confPassword={confPassword} empId={employeeId}
        //                         onUpdate={handlePasswordUpdate} />

        //                     <div className='w-full flex flex-col'>
        //                         <div className='w-full flex flex-col sm:flex-row justify-between items-center'>
        //                             <Link href={'./login'} className='w-auto sm:text-right text-orange hover:-translate-y-1 duration-200'>
        //                                 กลับไปหน้าเข้าสู่ระบบ
        //                             </Link>
        //                         </div>
        //                     </div>

        //                 </FormControl>
        //                 <div className='mt-5 mb-5 flex justify-center items-center h-screen"'>
        //                     <button
        //                         onClick={
        //                             () => { register() }}
        //                         className='bg-orange text-black px-16 py-3 text-center 
        //                         bg-orange-100 rounded-md border border-gray-900 hover:bg-orange-300 transition duration-300'>
        //                         REGISTER
        //                     </button>
        //                 </div>
        //             </div>
        //         </div >
        //     </div >
        // </div >
    );
}