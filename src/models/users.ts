export interface Users {
    user_id: number
    employee_id: string
    user_name: string
    first_name: string
    last_name: string
    password: string
    profile_picture: string
    company_id: number
    role: 0 | 1 | 2
    srm_resp: string
}

// 2 developer ,1 admin , 0 client 
export type Role = any


export interface Credential {
    role: any
    token: string,
    userData: Users
}