'use client'
import { MuiTheme } from "@/plugins/mui";
import { ThemeProvider } from "@emotion/react";

interface Props { }

export default function AppProvider({ children, }: Readonly<{ children: React.ReactNode }>) {
    return (
        <ThemeProvider theme={MuiTheme}>
            {children}
        </ThemeProvider>
    );
}