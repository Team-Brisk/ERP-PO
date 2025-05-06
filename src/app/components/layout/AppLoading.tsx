import { CircularProgress } from '@mui/material'
import '../../styles/loading.css'
import '../../styles/tailwind.css'
export default function AppLoading() {
    return (
        <div className="min-h-[calc(100vh-128px)] w-full obj-center bg-gray-50">
            <CircularProgress size={50} />
        </div>
    )
}