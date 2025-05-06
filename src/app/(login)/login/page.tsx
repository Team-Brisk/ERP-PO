'use client'

import { Button, Card, Checkbox, FormControl, TextField } from '@mui/material';
import '../../styles/tailwind.css'
import '../../styles/bgPattern.css'
import { BASE_API } from '@/app/(main)/api';
import { useState, useEffect } from 'react';
import MsgAlert from '@/utils/sweetAlert';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import Cookies from "js-cookie";
import Image from 'next/image'



export default function LoginPage() {

    const router = useRouter()
    const _msg = new MsgAlert()

    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [remember, setRemember] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        document.title = 'Login'
    }, [])

    const login = async () => {
        try {
            setLoading(true)
            if (username.trim() === '' || password.trim() === '') {
                return _msg.default_msg({ title: 'Incorrect!', msg: `username and password can't be empty`, icon: 'error' })
            }

            const res = await axios.post(`${BASE_API}/login`, {
                username: username,
                password: password,
                remember: remember
            })

            if (res.status === 200) {
                localStorage.setItem('Credential', JSON.stringify(res.data.loginData))
                Cookies.set('Credential', JSON.stringify(res.data.loginData), {
                    expires: 7, // กำหนดอายุ Cookie (7 วัน)
                    path: '/',  // ทำให้ Cookie ใช้ได้ทุกหน้าในเว็บไซต์
                });
                axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
                _msg.toast_msg({ title: res.data.msg, progressbar: true, timer: 5, icon: 'success' })
                router.push('./srm-status')
            } else if (res.status === 401) {
                console.log(res.status);
                _msg.default_msg({ title: res.data.msg })
            }
        } catch (err: any) {
            if (err.status === 401) {
                return _msg.default_msg({ title: 'Incorrect!', msg: `Your username or password incorrect. plese try again.`, icon: 'error' })
            }
            _msg.default_msg({ title: 'Something Wrong!', msg: String(err), icon: 'error' })
        } finally {
            setLoading(false)
        }
    }

    const toRegisterPage = () => {
        router.push('./register')
    }
    return (
        <div className='w-full min-h-screen h-full max-h-screen obj-center overflow-hidden '>
            <div className='container h-full flex flex-row justify-center items-center '>
                <Card className='w-[450px] h-auto p-4 bg-white flex flex-row gap-4'>
                    <div className='w-full flex flex-col gap-6 justify-center items-start h-full'>
                        <FormControl onKeyDown={(e) => { if (e.key === 'Enter') login(); }}
                            className='flex flex-col gap-4 w-full h-full justify-between'>
                            <div className='w-full flex flex-col gap-4 justify-center items-center p-6'>
                                <Image
                                    alt='amw logo'
                                    width={100}
                                    height={100}
                                    className='w-full h-full'
                                    src={'/logo/logo-horizontal.png'}
                                ></Image>
                                <span className='w-full text-center text-lg'>เข้าสู่ระบบตรวจสอบสินค้า</span>
                            </div>
                            <div className='flex flex-col mt-10 gap-4 w-full h-full '>
                                <TextField
                                    value={username}
                                    onChange={(e) => { setUsername(e.target.value) }}
                                    className=' border-orange text-orange'
                                    label={`ชื่อผู้ใช้งาน`}
                                    slotProps={{
                                        inputLabel: { shrink: true }
                                    }}
                                ></TextField>
                                <TextField
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value) }}
                                    color='primary'
                                    type='password'
                                    className=' border-orange text-orange'
                                    label={'รหัสผ่าน'}
                                    slotProps={{
                                        inputLabel: { shrink: true }
                                    }}
                                ></TextField>
                                <div className='w-full flex flex-col'>
                                    <div className='w-full flex flex-row justify-between items-center'>
                                        <div className='flex-1 flex justify-start items-center'>
                                            <Checkbox
                                                color='default'
                                                checked={remember}
                                                onChange={() => setRemember(!remember)}
                                            /> <span className='text-black'>จดจำฉัน</span>
                                        </div>
                                        <button
                                            onClick={toRegisterPage}
                                            className='w-auto sm:text-right text-gray-500 hover:text-gray-600 hover:-translate-y-1 duration-200 cursor-pointer bg-transparent border-none p-0'>
                                            สมัครสมาชิก
                                        </button>

                                    </div>
                                    <span className='w-full font-extralight text-gray-500 px-2'>
                                        * หากลืมรหัสผ่านกรุณาติดต่อเจ้าหน้าที่
                                    </span>
                                </div>
                            </div>
                            <div className='mt-10'>
                                <Button
                                    loading={loading}
                                    variant='outlined'
                                    color='inherit'
                                    size='small'
                                    className='w-full p-2'
                                    onClick={() => {
                                        login()
                                    }}
                                >
                                    เข้าสู่ระบบ
                                </Button>
                            </div>
                        </FormControl>
                        {/* <div className='w-full justify-start items-center'>
                            <Divider></Divider>
                            <span></span>
                        </div> */}
                    </div>
                </Card>
            </div >
        </div >
    );
}