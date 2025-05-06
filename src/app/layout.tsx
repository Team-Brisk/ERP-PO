'use client'
import React from 'react'
import { ThemeProvider } from '@mui/material/styles';
import { MuiTheme } from '../plugins/mui'
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang='en'>
            <body className='bg-gray-50' suppressHydrationWarning={true}>
                <ThemeProvider theme={MuiTheme} >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}
