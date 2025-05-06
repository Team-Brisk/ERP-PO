import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { useState } from "react";

export default function FullScreenBtn() {
    const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
    const fullScreen = async (state: boolean) => {
        const doc = document.documentElement as HTMLHtmlElement;
        if (state) { doc.requestFullscreen() }
        else { document.exitFullscreen() }
        setIsFullScreen(state);
    };

    return (
        <>
            <ToggleButton
                onClick={() => fullScreen(!isFullScreen)}
                value="center"
            >
                {isFullScreen ? (
                    <FullscreenExitIcon />
                ) : (
                    <FullscreenIcon />
                )}
            </ToggleButton>
        </>
    );
} 