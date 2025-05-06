import HomeIcon from '@mui/icons-material/Home';
import WarningIcon from '@mui/icons-material/Warning';
import { ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import axios from '@/app/config/axiosConfig';
import { BASE_API } from '../../(main)/api';
import { errorMessage } from '@/utils/messageAlert';

interface Props {
    pathOpc: string
    size?: 'small' | 'medium' | 'large'
    isDisable?: boolean
    children?: React.ReactNode;
}

export default function SRMCommandBtn(props: Props) {
    // manual order srm
    /**
     * @param command 2 : Home , 9 : Clear Alarm 
     */
    const orderSrm = async (command: 2 | 9) => {
        try {
            console.log(command, props);

            const res = await axios.post(`${BASE_API}/command_opc`, {
                command: command,
                pathOpc: props.pathOpc
            })
        } catch (err: any) {
            console.log("Error submitting command:", err);
            errorMessage({ message: 'Failed to submit command' + String(err) })
        }
    }

    return (
        <>
            <ToggleButtonGroup
                size={props.size ? props.size : 'medium'}
                value={null}
                exclusive
                disabled={!!!props.pathOpc || props.pathOpc === '' || props.pathOpc === 'Unfound' || props.isDisable}
            >
                <Tooltip title={`สั่งกลับ Home`} placement='top'>
                    <span>
                        <ToggleButton
                            size={props.size ? props.size : 'medium'}
                            onClick={() => orderSrm(2)} value="home"  >
                            <HomeIcon />
                        </ToggleButton>
                    </span>
                </Tooltip>
                <Tooltip title="เคลียสถานะผิดปกติ" placement='top'>
                    <span>
                        <ToggleButton
                            size={props.size ? props.size : 'medium'}
                            onClick={() => orderSrm(9)} value="clear"  >
                            <WarningIcon />
                        </ToggleButton>
                    </span>
                </Tooltip>
            </ToggleButtonGroup>
        </>
    )
}