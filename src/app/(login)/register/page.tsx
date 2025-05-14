'use client';

import {
  Button,
  Card,
  FormControl,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import MsgAlert from '@/utils/sweetAlert';
import axios from 'axios';
import { BASE_API } from '@/app/(main)/api';
import { checkConfirmPassword, CheckField, checkEmployeeId } from '@/utils/FieldCheck';
import GateBar from '@/app/components/form/GateBar';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const router = useRouter();
  const _msg = new MsgAlert();

  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [selectCompany] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'ลงทะเบียน';
  }, []);

  const handlePasswordUpdate = (status: boolean) => {
    console.log('Password Valid:', status);
  };

  const register = async () => {
    try {
      setLoading(true);

      const isEmployeeIdCorrect = await checkEmployeeId(employeeId) as CheckField;
      if (!isEmployeeIdCorrect.status) {
        return _msg.default_msg({ title: 'Error Employee ID', msg: String(isEmployeeIdCorrect.msg), icon: 'error' });
      }

      const isPasswordCorrect = await checkConfirmPassword(password, confPassword) as CheckField;
      if (!isPasswordCorrect.status) {
        return _msg.default_msg({ title: 'Error Password!', msg: String(isPasswordCorrect.msg), icon: 'error' });
      }

      const data = {
        username,
        password,
        companyId: selectCompany,
        employeeId,
        dept_code: firstname,
        role_code: lastname,
      };

      const res = await axios.post(`${BASE_API}/register`, data);
      if (res.status === 201) {
        _msg.toast_msg({ title: res.data.msg, icon: 'success', progressbar: true, timer: 3 });
        setUsername('');
        setEmployeeId('');
        setConfPassword('');
        setPassword('');
        setLastname('');
        setFirstname('');
      } else if (res.status === 409) {
        _msg.default_msg({ title: res.data.msg, icon: 'warning' });
      } else {
        throw new Error(res.data.msg);
      }
    } catch (err: any) {
      _msg.default_msg({
        title: 'Something Wrong!',
        msg: err?.response?.data?.msg || String(err),
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-100 px-4">
      <Card className="w-[450px] h-auto p-4 rounded-xl shadow-xl bg-white border border-gray-200">
        <div className="flex flex-col items-center gap-2 mb-6">
         
          <Typography variant="h4" color="primary" gutterBottom>
   ลงทะเบียน
</Typography>
        </div>

        <FormControl className="flex flex-col gap-4">
          {/* <TextField
            label="รหัสพนักงาน"
            value={employeeId}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value) && value.length <= 7) {
                setEmployeeId(value);
              }
            }}
            size="small"
            fullWidth
          /> */}
          <TextField
            label="ชื่อผู้ใช้งาน"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="หน่วยงาน"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="ตำเเหน่ง"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="รหัสผ่าน"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="ยืนยันรหัสผ่าน"
            type="password"
            value={confPassword}
            onChange={(e) => setConfPassword(e.target.value)}
            size="small"
            fullWidth
          />

          {!!password && (
            <GateBar
              password={password}
              confPassword={confPassword}
              empId={employeeId}
              onUpdate={handlePasswordUpdate}
            />
          )}

          <div className="text-right text-sm">
            <button
              onClick={() => router.push('/login')}
              className="text-gray-500 hover:text-blue-700 transition hover:underline"
            >
              กลับไปหน้าเข้าสู่ระบบ
            </button>
          </div>

          <Button
            variant="contained"
            fullWidth
            onClick={register}
            disabled={loading}
            sx={{
              mt: 1,
              py: 1.4,
              fontWeight: 600,
              fontSize: '1rem',
              backgroundColor: '#1D4ED8',
              '&:hover': { backgroundColor: '#1E40AF' },
              borderRadius: 2,
            }}
            endIcon={loading && <CircularProgress color="inherit" size={20} />}
          >
            {loading ? 'กำลังสมัคร...' : 'ลงทะเบียน'}
          </Button>
        </FormControl>
      </Card>
    </div>
  );
}
