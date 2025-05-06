import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MsgAlert from "@/utils/sweetAlert";
import { useRouter } from "next/navigation";

export default function LogoutBtn() {
    const _msg = new MsgAlert()
    const router = useRouter()

    const logout = () => {
        _msg.confirm('ต้องการออกจากระบบใช่ไหม', 'question').then((isConfirmed) => {
            if (isConfirmed) {
                _msg.toast_msg({
                    title: 'ออกจากระบบเรียบร้อย',
                    icon: 'success',
                    timer: 5,
                    progressbar: true,
                });
                localStorage.removeItem('Credential');
                setTimeout(() => {
                    router.push('/login');
                }, 500);
            }
        });
    };

    return (
        <>
            <ToggleButton
                value="center"
                onClick={() => { logout() }}
            >
                <ExitToAppIcon />
            </ToggleButton>
        </>
    );
} 