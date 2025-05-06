import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import React from 'react'
import GradeIcon from '@mui/icons-material/Grade';

export default function ProfileBtn(props: { isAdmin?: boolean }) {
    return (
        <ToggleButton value="phanuphun namwong" className='flex flex-row'>
            <GradeIcon color='warning'></GradeIcon>
            <span className='px-4'>
                ภานุพันธ์ นามวงษ์
            </span>
        </ToggleButton>
    );
}
