import { Crane } from "./crane"

export interface Site {
    site_id: number | string
    site_name: string
    delete_status: boolean
    crane?: Array<Crane>
}
