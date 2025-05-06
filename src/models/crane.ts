import { Bank } from "./bank"
import { Camera } from "./camera"
import { Site } from "./site"

export interface Crane {
    crane_id: number | string
    crane_name: string
    site_id: number
    path_opc: string
    delete_status:boolean
    id_wcs:string
    camera?:Array<Camera>
    bank?:Array<Bank>
}

