import MsgAlert from "@/utils/sweetAlert";

const _msg = new MsgAlert()

export function successMessage(msg: string) {
    _msg.toast_msg(
        {
            title: msg,
            progressbar: true,
            timer: 5,
            icon: 'success',
            width: '450px'
        }
    )
}
export function warningMessage(msg: string) {
    _msg.toast_msg(
        {
            title: msg,
            progressbar: true,
            timer: undefined,
            icon: 'warning',
            width: '450px'
        }
    )
}

export function errorMessage(props: { title?: string, message: string }) {
    _msg.toast_msg({
        icon: 'error',
        title: props.title || 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง',
        progressbar: true,
        timer: 10,
        width: '450px'
        
    })
   
}
export function warningMessageTime(msg: string) {
    _msg.toast_msg(
        {
            title: msg,
            progressbar: true,
            timer: 5,
            icon: 'warning',
            width: '450px'
        }
    )
}

export function errorMessagefeedback({ title = 'ข้อผิดพลาด', message }: { title?: string, message: string }) {
    _msg.toast_msg({
        icon: 'error',
        title: `${title}: ${message}`,  
        progressbar: true,
        timer: 10,
        width: '450px'
    });
}