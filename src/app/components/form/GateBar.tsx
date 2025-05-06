import { useState, useEffect } from "react";

interface GateBarProps {
    password: string;
    confPassword: string;
    empId: string
    onUpdate: (isValid: boolean, status: boolean) => void;
}



const GateBar: React.FC<GateBarProps> = ({ password, confPassword, onUpdate, empId }) => {

    useEffect(() => {
        console.log("Password: ", password);
        console.log("ConfirmPassword: ", confPassword);
    }, [password, confPassword]);

    const [errors, setErrors] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const validatePassword = (pwd: string, confirmPwd: string, empI: string) => {
        let errorList: string[] = [];
        let status = true;
        if (empI.length < 7) {
            errorList.push("รหัสพนักงานต้องมีความยาว 7 ตัวอักษร");
            status = false;
        }
        else if (!pwd) {
            // errorList.push("กรุณากรอกรหัสผ่าน");
            status = false;
        } else if (pwd.length < 6) {
            errorList.push("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
            status = false;
        } else if (!/[A-Z]/.test(pwd)) {
            errorList.push("รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัวอักษร (A-Z), (a-z).");
            status = false;
        } else if (!/[a-z]/.test(pwd)) {
            errorList.push("รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัวอักษร (a-z).");
            status = false;
        } else if (!/[0-9]/.test(pwd)) {
            errorList.push("รหัสผ่านต้องมีตัวเลขรวมอยู่ด้วยอย่างน้อย 1 ตัวเลข(0-9).");
            status = false;
        } else if (!/[!@#$%^&*(),.?\":{}|<>_]/.test(pwd)) {
            errorList.push("รหัสผ่านต้องมีอักขระพิเศษอย่างน้อย 1 อักขระ (!@#$%^&* etc).");
            status = false;
        } else if (pwd !== confirmPwd) {
            errorList.push("รหัสผ่านไม่ตรงกัน");
            status = false;
        }


        // อัปเดต state
        setErrors(errorList);
        setSuccessMessage(errorList.length === 0 ? "รหัสผ่านตรงกัน" : null);
        onUpdate(errorList.length === 0, status);
    };

    useEffect(() => {
        validatePassword(password, confPassword, empId);
    }, [password, confPassword]);

    return (
        <div className='flex justify-start px-1 items-center"'>
            {errors.length > 0 && (
                <ul className="text-red-400 text-sm">
                    {errors.map((err, index) => (
                        <li key={index}>{err}</li>
                    ))}
                </ul>
            )}
            {successMessage && <p className="text-green-400  text-sm">{successMessage}</p>}
        </div>
    );
};

export default GateBar;
