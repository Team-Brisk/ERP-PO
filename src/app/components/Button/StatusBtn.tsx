import { ToggleButton } from "@mui/material";

interface Props {
    text: string
    isOk: boolean
}

export default function StatusBtn(props: Props) {
    return (
        // <ToggleButton
        //     sx={{
        //         pointerEvents: "none",
        //         '&:hover': { backgroundColor: 'transparent' },
        //         '&:focus': { outline: 'none', boxShadow: 'none' },
        //         '&:active': { backgroundColor: 'transparent' }
        //     }}
        //     className={`${(props.isOk)
        //         ? 'text-green-500 '
        //         : 'text-red-500'} w-full px-3 `}
        //     size="small"
        //     value={'unknow'}
        // >
        // </ToggleButton>
        <span className={`
                ${(props.isOk)
                ? 'text-green-600 '
                : 'text-red-400'} flex justify-start w-full`
        }>
            {props.text}
        </span>
    );
}