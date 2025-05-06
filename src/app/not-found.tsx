import './styles/tailwind.css'

export default function Custom404() {
    return (
        <div className="w-full min-h-screen h-full obj-center">
            <div className='w-[600px] rounded-lg pt-8 pb-4 px-10 flex flex-col justify-center items-center gap-10'>
                <span className='text-5xl text-orange-500 font-extralight'>
                    404 - Not Found
                </span>
            </div>
        </div>
    )
}