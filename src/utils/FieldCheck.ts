export interface CheckField {
    status: boolean,
    msg?: string
}

export const checkConfirmPassword = async (password: string, confPassword: string) => {
    if (password.length < 6) return { status: false, msg: 'Password length should be at least 6 characters. ' }
    if (password !== confPassword) return { status: false, msg: 'Password is not match!' }
    if ((password.trim() === '' || confPassword.trim() === '')) return { status: false, msg: `Password and Confirm password can't be empty.` }

    return { status: true }
}

export const checkEmployeeId = async (employeeId: string) => {
    if (employeeId.trim() === '') return { status: false, msg: `Employee ID Can't be empty` }
    if (employeeId.length < 7) return { status: false, msg: 'Employee ID must be 7 characters long  ' }
    if (employeeId.length > 7) return { status: false, msg: 'Employee ID must be 7 characters long ' }

    return { status: true }
}
