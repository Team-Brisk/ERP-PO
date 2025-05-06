import { Crane } from "./crane";
import { Site } from "./site";
import { Users } from "./users";
export type RpResult = 'ยังไม่เลือก' | 'สำเร็จ' | 'ไม่สำเร็จ'
export interface Reports {
    crane: Crane;
    crane_id: number;
    date_time: string;
    id: number;
    img_barcode: string | null;
    img_bcode_detect: string | null;
    img_bcode_number: string | null;
    img_bcode_status: string | null;
    img_obj: string;
    img_obj_detect: string | null;
    img_shift_cm: string | null;
    img_shift_direction: string;
    img_shift_pix: string;
    in_bank: number;
    in_bay: number;
    in_level: number;
    in_path_opc: string;
    opc_crr_status: {
        d147: string | null,
        d148: string | null,
        d149: string | null,
        dist_x: string | null,
        dist_y: string | null
    }
    order_type: string;
    rp_status: Exclude<RpResult, 'ยังไม่เลือก'>;
    rp_status_desc: string | null;
    site: Site;
    site_id: number;
    user_id: number;
    users: Users;
    wcs_asrs: string;
    wcs_bank: number;
    wcs_barcode_number: string;
    wcs_bay: number;
    wcs_height: string | null;
    wcs_length: string | null;
    wcs_level: number;
    wcs_log_rack: string | null;
    wcs_weight: string | null;
    wcs_width: string | null;
    img_log_rack: string;
    img_crane: string
    img_site: string
    wcs_crane: string | null;
    wcs_site: string | null;
    sum_total:number | null;
    sum_success : number |null;
    sum_fail : number | null;
    group_queue: number | null;
}