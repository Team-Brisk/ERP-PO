import { Crane } from "./crane"
import { Site } from "./site"
import { Users } from "./users"

export interface Report {
    rp_status: string | null;
    rp_status_desc: string | null;
    order_type: string | null;
    user_id: string | number | null;
    site_id: string | number | null;
    crane_id: string | number | null;
    in_bank: number | null;
    in_bay: number | null;
    in_level: number | null;
    in_path_opc: string | null;
    date_time: string | null;
    img_obj: string | null;
    img_barcode: string | null;
    img_shift_pix: string | null;
    img_shift_cm: string | null;
    img_shift_direction: string | null;
    img_obj_detect: string | null;
    img_bcode_detect: string | null;
    img_bcode_number: string | number | null;
    img_bcode_status: string | null;
    wcs_asrs: string | null;
    wcs_bank: number | null;
    wcs_bay: number | null;
    wcs_level: number | null;
    wcs_barcode_number: string | number | null;
    wcs_log_rack: string | null;
    wcs_weight: number | null;
    wcs_width: number | null;
    wcs_length: number | null;
    wcs_height: number | null;
    opc_crr_status: {
        d147: string | null;
        d149: string | null;
        dist_x: string | null;
        dist_y: string | null;
    }
    sum_total : number | null;
    sum_success : number |null;
    sum_fail : number | null;
    group_queue: number | null;
}

export interface InputReport {
    bank: number
    barcode_id: string
    bay: number
    crane: Crane
    crane_id: number
    date_time: string
    in_id: number
    level: number
    path_opc: string
    site: Site
    site_id: number
}
export interface ReportDataResponse {
    bank: number
    barcode_detection: string
    barcode_number: string
    bay: number
    crane_id: number
    date_time: string
    input_id: number
    input_report: InputReport
    level: number
    log_rack: string
    object_product: string
    out_id: string
    weight: string
    height: string
    width: string
    length: string
}

// map from backend
export interface ReportDetailRes {
    crane: {
        crane_id: number,
        crane_name: string,
        delete_status: boolean,
        id_wcs: string,
        path_opc: string,
        site_id: number
    },
    imageDetection: {
        annotated_image: string,
        barcode_image: string,
        date_time: Date,
        formatted_pixel_shift: string
        img_id: number,
        shift_direction: string
    },
    input: {
        bank: number,
        barcode_id: string,
        bay: number,
        crane_id: number,
        date_time: string,
        in_id: number,
        level: string,
        path_opc: string,
        site_id: number
    },
    output: {
        bank: number;
        barcode_detection: string;
        barcode_number: string;
        bay: number;
        crane_id: number;
        date_time: string;
        input_id: number;
        level: number;
        log_rack: string;
        object_product: string;
        out_id: number;
    },
    productDetail: {
        weight: string
        height: string
        width: string
        length: string
    },
    site: {
        company_id: number;
        delete_status: boolean;
        site_id: number;
        site_name: string;
        user_id: number;
    }
    userData: Users
}