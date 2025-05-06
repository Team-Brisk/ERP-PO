import { ToggleButton } from "@mui/material";

interface Props {
    bank: string
    bay: string
    level: string
}

export default function ShowLocationBtn({ bank, bay, level }: Props) {
    return (
        <div className="flex flex-row gap-4">
            <ToggleButton
                sx={{
                    pointerEvents: "none",
                    '&:hover': { backgroundColor: 'transparent' },
                    '&:focus': { outline: 'none', boxShadow: 'none' },
                    '&:active': { backgroundColor: 'transparent' }
                }}
                size="small"
                className="px-4"
                value={'unknow'}
            >
                <span>
                    Bank: {bank} - Level: {level} - Bay: {bay}
                </span>
            </ToggleButton>

        </div>
    );
}