'use client'

import { Autocomplete, Button, Card, CircularProgress, FormControl, TextField, Typography } from '@mui/material';
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
    const [departments, setDepartments] = useState<{ dept_code: string; dept_name: string }[]>([]);
    const [deptCode, setDeptCode] = useState('');
    const [roleCode, setRoleCode] = useState('');

    useEffect(() => {
        document.title = 'Register'
        // getCompany()
        fetchDepartments();
    }, [])
    const fetchDepartments = async () => {
        try {
            const res = await axios.get(`${BASE_API}/departments`);
            if (res.data) {
                setDepartments(res.data.map((item: any) => ({
                    dept_code: item.dept_code,
                    dept_name: item.dept_name,
                })));
            }
        } catch (err) {
            console.error('Failed to fetch departments:', err);
        }
    };

    // const getCompany = async () => {
    //     try {
    //         const res = await axios.get(`${BASE_API}/get_companies`);
    //         const companies = res.data.company_data;
    //         if (companies.length > 0) {
    //             setSelectCompany(companies[0].company_id);
    //         }
    //         console.log(companies);
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };



    const handlePasswordUpdate = (status: boolean) => {
        console.log("Validation Result:", status);

    };

    const register = async () => {
        try {
            setLoading(true)
            // const isEmployeeIdCorrect = await checkEmployeeId(employeeId) as CheckField
            // if (isEmployeeIdCorrect.status === false) {
            //     return _msg.default_msg({ title: 'Error Employee ID', msg: String(isEmployeeIdCorrect.msg), icon: 'error' })
            // }
            const isPasswordCorrect = await checkConfirmPassword(password, confPassword) as CheckField

            if (isPasswordCorrect.status === false) {
                return _msg.default_msg({ title: 'Error Password!', msg: String(isPasswordCorrect.msg), icon: 'error' })
            }

            const data = {
                username: username,
                password: password,
                dept_code: deptCode,
                role_code: roleCode
            }

            const res = await axios.post(`${BASE_API}/register`, data)
            if (res.status === 201) {
                _msg.toast_msg({ title: res.data.msg, icon: 'success', progressbar: true, timer: 3 })
                setUsername('')
                setRoleCode('')
                setConfPassword('')
                setPassword('')
                setDeptCode('')

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
        <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-100 px-4">
            <div className='container h-full flex flex-row justify-center items-center '>
                <Card className='w-[450px] h-auto p-4 bg-white flex flex-col gap-4'>
                    <FormControl className='flex flex-col gap-3 w-full'>
                        <div className='w-full flex flex-col justify-center items-center p-6'>
                            {/* <Image
                                alt='amw logo'
                                width={100}
                                height={100}
                                className='w-full h-full'
                                src={'/logo/logo-horizontal.png'}
                            ></Image> */}
                            <Typography variant="h4" color="primary" gutterBottom>
                                ลงทะเบียน
                            </Typography>
                        </div>
                        {/* <TextField
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

                        ></TextField> */}
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

                        <Autocomplete
                            options={departments}
                            getOptionLabel={(option) => option.dept_name || ''}
                            value={
                                departments.find((d) => d.dept_code === deptCode) || null // ให้ตั้งค่า deptCode ตรงนี้
                            }
                            onChange={(e, newValue) => {
                                setDeptCode(newValue?.dept_code || ''); // ตั้งค่า deptCode
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="หน่วยงาน" fullWidth slotProps={{
                                    inputLabel: { shrink: true }
                                }} />
                            )}
                        />
                        <TextField

                            value={roleCode}
                            onChange={(e) => { setRoleCode(e.target.value) }}
                            color='primary'
                            placeholder=''
                            className=' border-orange text-orange'
                            label={'ตำเเหน่ง'}
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

    );
}