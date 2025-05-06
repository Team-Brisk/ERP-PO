
'use client'
interface ActiveStatus {
    status: 1 | 0
}

/**
 * 
 * @param status ส่งสถานะ 0 หรีือ 1 มาซึ่งเป็นสถานะการทำงานของ camera ใน site งานของ crane นั้นๆ 
 * @returns 
 */
export default function CameraStatus(props: ActiveStatus) {
    return (
        <div>
            {(props.status === 1) ? (
                <div className='w-full h-full obj-center'>
                    <span className="relative flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-green-400"></span>
                    </span>
                </div>
            ) : (
                <div className='w-full h-full obj-center'>
                    <span className="relative flex h-5 w-5">
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-red-400"></span>
                    </span>
                </div>
            )}
        </div>
    );
}