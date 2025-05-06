import '@/app/styles/loading-dot.css'
import '@/app/styles/tailwind.css'
export function SelectLoaderDot() {
    return (
        <>
            <div className="w-full obj-center">
                <div className="max-h-[50px] max-w-[50px] loader-dot"></div>
            </div>
        </>
    )
}