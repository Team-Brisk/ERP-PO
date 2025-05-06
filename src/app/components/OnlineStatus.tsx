
'use client'
interface OnlineStatusProps {
    status: 1 | 0
}

/**
 * 
 * @param status ส่งสถานะ 0 หรีือ 1 มาซึ่งเป็นสถานะการทำงานของ camera ใน site งานของ crane นั้นๆ 
 * @returns 
 */
export default function OnlineStatus(props: OnlineStatusProps) {
    return (
        <div>
            {(props.status === 1) ? (
                <div className='w-full h-full obj-center text-green-600'>
                    กำลังใช้งาน
                    {/* <span className="relative flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500"></span>
                    </span> */}
                </div>
            ) : (
                <div className='w-full h-full obj-center text-red-600'>
                    ว่าง
                    {/* <span className="relative flex h-5 w-5">
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-red-400"></span>
                    </span> */}
                </div>
            )}
        </div>
    );
}