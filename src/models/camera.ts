import { Crane } from "./crane"

export interface Camera {
    camera_id: number
    camera_url: string
    camera_activate: 1 | 0
    camera_direction: 'ขวา' | 'ซ้าย'
    crane_id: number
}
