import { useEffect } from 'react'
import { create } from 'zustand'

interface UseBreakpoint {
    breakpoint: string
    setBreakpoint: (bp: string) => void
}

export const useBpStore = create<UseBreakpoint>((set) => ({
    breakpoint: 'xl',
    setBreakpoint: (bp: string) => { set({ breakpoint: bp }) }
}))

export const useBreakpoint = () => {
    const { breakpoint, setBreakpoint } = useBpStore()

    useEffect(() => {
        const breakpoints = {
            sm: '(max-width: 640px)',
            md: '(min-width: 641px) and (max-width: 768px)',
            lg: '(min-width: 769px) and (max-width: 1024px)',
            xl: '(min-width: 1025px)',
        };

        // สร้างฟังก์ชันเช็ค breakpoint และอัพเดต state
        const handleBreakpointChange = () => {
            for (const [key, query] of Object.entries(breakpoints)) {
                if (window.matchMedia(query).matches) {
                    setBreakpoint(key);  // อัพเดต breakpoint เมื่อขนาดหน้าจอตรงกับ query
                }
            }
        };

        // เรียกใช้ฟังก์ชันตรวจสอบ breakpoint ในครั้งแรก
        handleBreakpointChange();

        // ฟังการเปลี่ยนแปลงของหน้าจอทุกครั้งที่ขนาดหน้าจอเปลี่ยน
        window.addEventListener('resize', handleBreakpointChange);

        // ลบ event listener เมื่อ component ถูกลบ
        return () => {
            window.removeEventListener('resize', handleBreakpointChange);
        };
    }, [setBreakpoint]);

    return breakpoint;
}

export default useBreakpoint;