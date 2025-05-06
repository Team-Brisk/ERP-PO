
'use client'

import * as React from 'react';

import { useState, useEffect, useCallback } from 'react';
import { BASE_API } from '@/app/(main)/api';
import { useParams, useRouter } from 'next/navigation';

import axios from '@/app/config/axiosConfig';
import GateBar from "@/app/components/form/GateBar";
import PersonIcon from '@mui/icons-material/Person';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MuiReportTable from '@/app/components/dataTable/MuiReportTable';
import CircularProgress from '@mui/material/CircularProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Autocomplete, Card, IconButton, InputAdornment, Popover, TextField, Button, Divider } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/CloudUpload";
import MsgAlert from '@/utils/sweetAlert';
import { checkEmployeeId, CheckField } from '@/utils/FieldCheck';

import { errorMessage, successMessage } from '@/utils/messageAlert';
import { Credential } from '@/models/users';
import { useStoreData } from '@/app/hooks/useStoreData';

const roles = [
    { id: "0", label: "ผู้ใช้งาน" },
    { id: "1", label: "หัวหน้างาน" },
    { id: "2", label: "ผู้พัฒนาระบบ" },
];

export default function UserDetail() {
    const userId = useParams().userId

    const [userDetail, setUserDetail] = useState({
        userId: '',
        employeeId: '',
        companyId: '',
        userName: '',
        firstname: '',
        lastname: '',
        role: '',
        srmResp: '',
        profile_picture: '',
    });
    const _msg = new MsgAlert()
    const [tempUserDetail, setTempUserDetail] = useState(userDetail);
    const [activeTab, setActiveTab] = useState(0);


    const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [loggedInRole, setLoggedInRole] = useState<number | null>(null);
    const setPageTitle = useStoreData((state) => state.setPageTitle)


    const router = useRouter();


    const srmOptions = Array.from({ length: 8 }, (_, i) => `LINE0${i + 1}-MP`);

    const fetchUserDetail = useCallback(async () => {
        try {
            const res = await axios.post(`${BASE_API}/get_user_detail`, { userId })

            if (res.status === 200) {
                const user = res.data.userDetail[0];

                const newUserDetail = {
                    userId: user.user_id ?? "",
                    employeeId: user.employee_id ?? "",
                    companyId: user.company_id ?? "",
                    userName: user.user_name ?? "",
                    firstname: user.first_name ?? "",
                    lastname: user.last_name ?? "",
                    role: user.role?.toString() ?? "",
                    srmResp: user.srm_resp ?? "",
                    profile_picture: user.profile_picture ?? "",
                };

                setUserDetail(newUserDetail);
                setTempUserDetail(newUserDetail);
            } else {
                throw new Error("ไม่พบข้อมูล userDetail");
            }
        } catch (error: any) {
            console.log('Hello', error);
            errorMessage(error)
        }
    }, [router]);

    useEffect(() => {
        fetchUserDetail();
    }, [fetchUserDetail]);

    useEffect(() => {
        document.title = 'บัญชีผู้ใช้งาน'
        setPageTitle('บัญชีผู้ใช้งาน')
        const credentialString = localStorage.getItem('Credential');
        if (credentialString) {
            const credential = JSON.parse(credentialString);
            const { role } = credential?.userData || {};
            setLoggedInRole(parseInt(role, 10)); // Parse as integer for easier comparison
        }
    }, []);

    const handleSaveChanges = useCallback(async () => {
        try {
            const isEmployeeIdCorrect = await checkEmployeeId(tempUserDetail.employeeId) as CheckField
            if (isEmployeeIdCorrect.status === false) {
                return _msg.default_msg({ title: 'Error Employee ID', msg: String(isEmployeeIdCorrect.msg), icon: 'error' })
            }

            const credentialString = localStorage.getItem('Credential');
            if (!credentialString) throw new Error("ไม่พบข้อมูลผู้ใช้");

            const credential = JSON.parse(credentialString);
            const token = credential?.token;
            if (!token) throw new Error("ไม่พบ Token");

            let updatedData = {
                userId: tempUserDetail.userId,
                username: tempUserDetail.userName,
                firstname: tempUserDetail.firstname,
                lastname: tempUserDetail.lastname,
                employeeId: tempUserDetail.employeeId,
                companyId: tempUserDetail.companyId,
                role: tempUserDetail.role,
                srmResp: tempUserDetail.srmResp,
                profile_picture: tempUserDetail.profile_picture,
            };

            setIsLoading(true);
            const res = await axios.post(`${BASE_API}/update_user`, updatedData, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });

            if (res.status === 200) {
                let localData = JSON.parse(localStorage.getItem('Credential')!) as Credential
                if (Number(userId) === Number(localData.userData.user_id)) {
                    localData.userData = res.data.user_data
                    localStorage.setItem('Credential', JSON.stringify(localData))
                }

                successMessage("บันทึกข้อมูลสำเร็จ!");
                setUserDetail(tempUserDetail);
                await fetchUserDetail();
            } else {
                throw new Error(res.data.msg || "ไม่สามารถบันทึกข้อมูลได้");
            }
        } catch (error) {
            console.error(" Error:", error);
        } finally {
            setIsLoading(false);
        }
    }, [tempUserDetail, fetchUserDetail]);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (isLoading) return;



            setUserDetail((prev) => ({
                ...prev,
                employeeId: userDetail.employeeId,
                userName: userDetail.userName
            }));

            successMessage("บันทึก Draft สำเร็จ!");
        }
    };


    // about password
    const handleCheckCurrentPassword = async (password: string) => {
        setCurrentPassword(password);

        if (password.length === 0) {
            setIsCurrentPasswordValid(false);
            setError("กรุณากรอกรหัสผ่านปัจจุบัน");
            return;
        }

        await verifyCurrentPassword(password);
    };

    const handlePasswordValidation = (status: boolean) => {
        console.log("Password validation:", status);
        setIsPasswordValid(status);
    };

    const resetPassword = async () => {
        try {
            const credentialString = localStorage.getItem("Credential");
            if (!credentialString) {
                setError("ไม่พบข้อมูลผู้ใช้");
                return;
            }

            const credential = JSON.parse(credentialString);
            const userId = parseInt(credential?.userData?.user_id, 10);
            const token = credential?.token;

            if (!token) {
                console.log("Token ไม่ถูกต้อง หรือหมดอายุ");
                setError("Session หมดอายุ กรุณาเข้าสู่ระบบใหม่");
                return;
            }

            if (!userId || !currentPassword || !newPassword || newPassword !== confirmPassword) {
                setError("กรุณากรอกข้อมูลให้ครบทุกช่อง และตรวจสอบว่ารหัสผ่านตรงกัน");
                return;
            }

            const response = await axios.post(
                `${BASE_API}/forgot_password`,
                { userId, currentPassword, password: newPassword },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                successMessage("เปลี่ยนรหัสผ่านสำเร็จ!");

                localStorage.removeItem("Credential");

                const newCredential = {
                    ...credential,
                    token: response.data.token
                };
                localStorage.setItem("Credential", JSON.stringify(newCredential));


                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setError("");
                setIsCurrentPasswordValid(false);

                setTimeout(() => {
                    localStorage.clear();
                    window.location.href = "/login";
                }, 1500);
            }
            else {
                setError(response.data.msg || "ไม่สามารถเปลี่ยนรหัสผ่านได้");
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            setError("เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
        }
    };

    const handlePasswordChange = () => {
        if (!isPasswordValid) {
            setError("รหัสผ่านใหม่ไม่เป็นไปตามเงื่อนไข");
            return;
        }
        if (!newPassword || !confirmPassword) {
            setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน");
            return;
        }

        resetPassword();
    };

    const verifyCurrentPassword = async (password: string) => {
        try {
            const credentialString = localStorage.getItem("Credential");
            if (!credentialString) {
                setError("ไม่พบข้อมูลผู้ใช้");
                return;
            }

            const credential = JSON.parse(credentialString);
            const userId = parseInt(credential?.userData?.user_id, 10);


            // ตรวจสอบข้อมูลก่อนส่ง
            if (!userId || !password) {
                setError("กรุณากรอกรหัสผ่าน");
                return;
            }

            console.log("🔍 Sending request to verify password:", { userId, password });

            const response = await axios.post(
                `${BASE_API}/verify_password`,
                { userId, password },
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("API Response:", response.data);

            if (response.data.isValid) {
                setIsCurrentPasswordValid(true);
                setError("");
            } else {
                setIsCurrentPasswordValid(false);
                setError(response.data.msg || "รหัสผ่านปัจจุบันไม่ถูกต้อง");
            }
        } catch (error) {
            console.warn("Error verifying password:", error);

            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.msg || "เกิดข้อผิดพลาดในการตรวจสอบรหัสผ่าน");
            } else {
                setError("เกิดข้อผิดพลาดที่ไม่คาดคิด");
            }
        }
    };

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClickOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };



    const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];
            if (!file) {
                return; // ถ้าไม่มีไฟล์ที่เลือกก็ไม่ทำอะไร
            }

            const credentialString = localStorage.getItem('Credential');
            if (!credentialString) throw new Error("ไม่พบข้อมูลผู้ใช้");

            const credential = JSON.parse(credentialString);
            const token = credential?.token;
            const userId = userDetail.userId;

            if (!token || !userId) throw new Error("ไม่พบ Token หรือ User ID");

            const formData = new FormData();
            formData.append("file", file);
            formData.append("userId", userId.toString());

            // ส่งไปยัง API
            const response = await axios.post(`${BASE_API}/upload_profile_picture`, formData, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200) {
                successMessage('อัปโหลดรูปโปรไฟล์สำเร็จ')
                await fetchUserDetail(); // โหลดข้อมูลใหม่
            } else {
                throw new Error(response.data.msg || "ไม่สามารถอัปโหลดรูปภาพได้");
            }
        } catch (error: any) {
            errorMessage(error)
        }
    };

    const handleDeleteProfilePicture = async () => {
        try {
            const isConfirmed = await _msg.confirm('Do you want to delete Profile Picture');
            if (!isConfirmed) {
                return;
            }
            const credentialString = localStorage.getItem("Credential");
            if (!credentialString) throw new Error("ไม่พบข้อมูลผู้ใช้");

            const credential = JSON.parse(credentialString);
            const token = credential?.token;
            const userId = userDetail.userId;

            if (!token || !userId) throw new Error("ไม่พบ Token หรือ User ID");

            const response = await axios.post(`${BASE_API}/delete_profile_picture`, { userId }, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });

            if (response.status === 200) {
                successMessage("ลบรูปโปรไฟล์สำเร็จ!");
                fetchUserDetail(); // โหลดข้อมูลใหม่
                setAnchorEl(null);
            } else {
                throw new Error(response.data.msg || "ไม่สามารถลบรูปโปรไฟล์ได้");
            }


        } catch (error: any) {
            errorMessage({ message: error });
        }
    };

    return (
        <>
            {userDetail.userId && (
                < div className="flex justify-center gap-4 items-start p-4">
                    <Card className="p-4 w-2/3 max-w-lg min-h-[calc(100vh-100px)] flex flex-col">
                        {/* รูปโปรไฟล์ */}
                        <div className="flex flex-col items-center">
                            <div className="w-40 h-40 relative text-center rounded-full border-2 cursor-pointer flex justify-center items-center">
                                {/* โปรไฟล์ */}

                                <div className="absolute w-40 h-40 z-40 text-center rounded-full overflow-hidden border-2 border-gray-500 
                                cursor-pointer flex justify-center items-center"

                                >
                                    {userDetail?.profile_picture ? (
                                        <div className="h-full w-full relative z-0">
                                            <img
                                                src={userDetail.profile_picture}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <PersonIcon className="text-gray-600 text-4xl" />
                                    )}
                                </div>


                                <button
                                    onClick={handleClickOpen}
                                    aria-label="Edit profile picture"
                                    className="absolute bottom-1 right-1 z-50 bg-orange-500 rounded-full h-8 w-8 flex justify-center items-center cursor-pointer hover:bg-orange-600 shadow-md"
                                >
                                    <EditIcon fontSize="medium" className="text-white" />
                                </button>

                                {/* <div ref={targetRef} className="absolute top-8 right-0 w-48 h-20"></div> */}

                                <Popover
                                    open={Boolean(anchorEl)}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "right",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    className="shadow-lg"
                                >
                                    <div className="p-4 flex flex-col items-center ">
                                        <label htmlFor="file-upload">
                                            <Button
                                                startIcon={<UploadIcon />}
                                                variant="contained"
                                                fullWidth
                                                component="span"
                                                className="mb-2 bg-orange-500 rounded-3xl hover:bg-orange-600"
                                            >
                                                อัปโหลดรูปใหม่
                                            </Button>
                                        </label>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handleProfilePictureChange}
                                        />
                                        <Button
                                            startIcon={<DeleteIcon />}
                                            variant="outlined"
                                            color="error"
                                            fullWidth
                                            onClick={handleDeleteProfilePicture}
                                        >
                                            ลบรูปภาพ
                                        </Button>
                                    </div>
                                </Popover>
                            </div>

                            {/* File Input */}
                            <input
                                id="file-input"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleProfilePictureChange}
                            />
                        </div>
                        <div className="flex items-center justify-start">
                            <Tabs
                                value={activeTab}
                                onChange={(event, newValue) => setActiveTab(newValue)}
                                className="mb-4"
                            >
                                <Tab label="ข้อมูลผู้ใช้" className="" />
                                <Tab label="รหัสผ่าน" className="" />
                            </Tabs>
                        </div>
                        <Divider></Divider>
                        {activeTab === 0 && (
                            <div className='flex flex-col gap-4'>
                                {/* Employee ID */}
                                <TextField
                                    size='medium'
                                    value={tempUserDetail.employeeId !== "" ? tempUserDetail.employeeId : ""}
                                    onChange={(e) => {
                                        const valuex = e.target.value;
                                        if (e.target.value.length <= 7 && /^\d*$/.test(valuex)) {
                                            setTempUserDetail({ ...tempUserDetail, employeeId: e.target.value });
                                        }
                                    }}
                                    color='primary'
                                    className=' border-orange text-orange w-full '
                                    label={'Employee ID'}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                ></TextField>

                                {/* UserName */}
                                <TextField
                                    size='medium'
                                    value={tempUserDetail.userName !== "" ? tempUserDetail.userName : ""}
                                    onChange={(e) => setTempUserDetail({ ...tempUserDetail, userName: e.target.value })}
                                    color='primary'
                                    className=' border-orange text-orange w-full '
                                    label={'User Name'}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                ></TextField>

                                {/* Fisrt Name */}
                                <TextField
                                    size='medium'
                                    value={tempUserDetail.firstname !== "" ? tempUserDetail.firstname : ""}
                                    onChange={(e) => setTempUserDetail({ ...tempUserDetail, firstname: e.target.value })}
                                    color='primary'
                                    className=' border-orange text-orange w-full '
                                    label={'First Name'}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                ></TextField>


                                {/* Last Name */}
                                <TextField
                                    size='medium'
                                    value={tempUserDetail.lastname !== "" ? tempUserDetail.lastname : ""}
                                    onChange={(e) => setTempUserDetail({ ...tempUserDetail, lastname: e.target.value })}
                                    color='primary'
                                    className=' border-orange text-orange w-full '
                                    label={'Last Name'}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                ></TextField>

                                {/* Role */}
                                <Autocomplete
                                    size='medium'
                                    options={roles}
                                    getOptionLabel={(option) => option.label}
                                    value={roles.find((role) => role.id === tempUserDetail.role) || null}
                                    onChange={(event, newValue) =>
                                        setTempUserDetail({ ...tempUserDetail, role: newValue ? newValue.id : "" })
                                    }
                                    renderInput={(params) => (
                                        <TextField {...params} label="Role" variant="outlined" className="w-full" />
                                    )}
                                    disabled={loggedInRole === 0}
                                    className=""
                                />

                                {/* SRM Responsibility */}
                                <Autocomplete
                                    size='medium'
                                    options={srmOptions}
                                    value={tempUserDetail.srmResp || null}
                                    onChange={(event, newValue) =>
                                        setTempUserDetail({ ...tempUserDetail, srmResp: newValue ?? "" })
                                    }
                                    renderInput={(params) => (
                                        <TextField {...params} label="SRM Responsibility" variant="outlined" className="w-full" />
                                    )}
                                    disabled={loggedInRole === 0}
                                    className=""
                                />

                                {/* Save Button */}
                                <Button
                                    loading={isLoading}
                                    className='w-full flex flex-row justify-center items-center gap-2'
                                    variant='outlined'
                                    size='large'
                                    onClick={handleSaveChanges}
                                    color='primary'
                                >
                                    <span>
                                        บันทึกข้อมูล
                                    </span>
                                </Button>
                            </div>
                        )}

                        {/* Password */}
                        {activeTab === 1 && (
                            <div className="space-y-4">
                                <TextField
                                    size='medium'
                                    type={isPasswordVisible ? "text" : "password"}
                                    label="รหัสผ่านปัจจุบัน"
                                    variant="outlined"
                                    value={currentPassword}
                                    onChange={(e) => {
                                        setCurrentPassword(e.target.value);
                                        handleCheckCurrentPassword(e.target.value);
                                    }}
                                    onKeyDown={handleKeyPress}
                                    fullWidth
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setIsPasswordVisible(!isPasswordVisible)} edge="end">
                                                        {isPasswordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                                {isCurrentPasswordValid && (
                                    <>
                                        {/* New Password */}
                                        <TextField
                                            size='medium'
                                            type={isPasswordVisible ? "text" : "password"}
                                            label="New Password"
                                            variant="outlined"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            fullWidth
                                            margin="normal"
                                            slotProps={{
                                                input: {
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => setIsPasswordVisible(!isPasswordVisible)} edge="end">
                                                                {isPasswordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                },
                                            }}
                                        />

                                        {/* Confirm New Password */}
                                        <TextField
                                            size='medium'
                                            type={isPasswordVisible ? "text" : "password"}
                                            label="Confirm New Password"
                                            variant="outlined"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            fullWidth
                                            margin="normal"
                                            slotProps={{
                                                input: {
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => setIsPasswordVisible(!isPasswordVisible)} edge="end">
                                                                {isPasswordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                },
                                            }}
                                        />

                                        {/* เช็ค Password Strength */}
                                        {error && <p className="text-red-400 text-sm px-1">{error}</p>}
                                        <GateBar password={newPassword} confPassword={confirmPassword} empId={tempUserDetail.employeeId} onUpdate={handlePasswordValidation} />

                                        {/* ปุ่มเปลี่ยนรหัสผ่าน */}
                                        <Button
                                            className='w-full flex flex-row justify-center items-center gap-2'
                                            variant='outlined'
                                            size='large'
                                            disabled={isLoading}
                                            onClick={handlePasswordChange}
                                            color='warning'
                                        >
                                            {(isLoading) && <CircularProgress size="20px" />}
                                            <span>
                                                บันทึกรหัสผ่าน
                                            </span>
                                        </Button>
                                    </>
                                )}

                            </div>
                        )}

                    </Card >
                    {/* {userDetail.userId && <MuiReportTable userId={userDetail.userId} />} */}
                </div >
            )}
        </>
    );
} 
