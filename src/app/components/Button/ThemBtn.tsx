import Brightness5Icon from '@mui/icons-material/Brightness5';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
export default function ThemeBtn() {
    return (
        <>
            <ToggleButtonGroup
                value={null}
                exclusive
            >
                {/* <ToggleButton value="left">
                    <TipsAndUpdatesIcon />
                </ToggleButton>
                <ToggleButton value="center">
                    <Brightness5Icon />
                </ToggleButton>
                <ToggleButton value="right">
                    <DarkModeIcon />
                </ToggleButton> */}
            </ToggleButtonGroup>
        </>
    );
} 