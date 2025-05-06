import Swal, { SweetAlertIcon, SweetAlertPosition } from 'sweetalert2'

interface msgOption {
    title: string
    msg?: string
    icon?: SweetAlertIcon
    position?: SweetAlertPosition
    confirmBtn?: boolean
    cancelBtn?: boolean
    closeBtn?: boolean
    confirmText?: string
    cancelText?: string
    timer?: number | undefined
    progressbar?: boolean
    width?: string
}

interface lightBoxOption {
    imageURL: string
    imageWidth?: string
}

// icon
// - success
// - error
// - warning : (!)
// - info  : (!) กลับหัว
// - question : (?)

// position
// - center
// - center-start
// - center-end
// - top
// - top-start
// - top-end
// - bottom
// - bottom-start
// - buttom-end

function convertTime(timer: number): number {
    return timer * 1000
}

export default class MsgAlert {

    confirmBtn: boolean = true
    cancelBtn: boolean = true

    // default alert
    default_msg(Option: msgOption) {
        let timer: number | boolean
        timer = 10000
        let icon: SweetAlertIcon = 'success'
        let position: SweetAlertPosition = 'center'
        let cancelButtonText: string = 'Close'

        if (Option.confirmBtn === undefined) this.confirmBtn = false
        if (Option.cancelBtn === undefined) this.cancelBtn = false

        if (Option.icon) icon = Option.icon
        if (Option.icon === 'error') this.cancelBtn = true
        if (Option.icon === 'error') timer = 0

        if (Option.confirmBtn === false) this.confirmBtn = Option.confirmBtn
        if (Option.confirmBtn === true) this.confirmBtn = Option.confirmBtn

        if (Option.timer) timer = convertTime(Option.timer)
        if (Option.timer === 0) timer = NaN
        if (Option.position) position = Option.position

        if (Option.cancelText) this.cancelBtn = true
        if (Option.cancelText) cancelButtonText = Option.cancelText
        if (Option.confirmText) this.confirmBtn = true

        Swal.fire({
            position: position,
            icon: icon,
            title: Option.title,
            text: Option.msg,
            showConfirmButton: this.confirmBtn,
            showCancelButton: this.cancelBtn,
            confirmButtonText: Option.confirmText,
            cancelButtonText: cancelButtonText,
            timer: timer,
            timerProgressBar: Option.progressbar
        })
    }

    // toast alert
    toast_msg(Option: msgOption) {
        let timer: number | undefined = 5000
        let icon: SweetAlertIcon = 'success'
        let position: SweetAlertPosition = 'bottom-end'
        let cancelButtonText: string = 'Close'
        let backgroundColor: string = ''
        let width = undefined

        if (Option.confirmBtn === undefined) this.confirmBtn = false
        if (Option.cancelBtn === undefined) this.cancelBtn = false

        if (Option.icon) icon = Option.icon
        if (Option.icon === 'error') timer = 0

        if (Option.icon === 'success') backgroundColor = '#22c55e'
        if (Option.icon === 'error') backgroundColor = '#ef4444'
        if (Option.icon === 'warning') backgroundColor = '#eab308'
        if (Option.icon === 'info') backgroundColor = '#06b6d4'
        if (Option.icon === 'question') backgroundColor = '#64748b'

        if (Option.confirmBtn === false) this.confirmBtn = Option.confirmBtn
        if (Option.confirmBtn === true) this.confirmBtn = Option.confirmBtn

        if (Option.timer) timer = convertTime(Option.timer)
        if (Option.timer === undefined) timer = undefined
        if (Option.position) position = Option.position

        if (Option.cancelText) this.cancelBtn = true
        if (Option.cancelText) cancelButtonText = Option.cancelText
        if (Option.confirmText) this.confirmBtn = true

        if (Option.width) width = Option.width

        Swal.mixin({
            toast: true,
            position: position,
            timer: timer,
            timerProgressBar: Option.progressbar,
            showCancelButton: this.cancelBtn,
            showConfirmButton: this.confirmBtn,
            background: backgroundColor,
            showCloseButton: true,
            icon: undefined,
            // iconHtml:'<i class="v-icon mdi mdi-calendar-star-outline"></i>',
            iconColor: 'white',
            color: 'white',
            width: width,
            customClass: {
                popup: 'toast-message'
            },
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        }).fire({
            title: Option.title,
            text: Option.msg,
            icon: Option.icon,
            timerProgressBar: Option.progressbar
        })
    }

    // confirm msg
    confirm(msg: string, icon?: SweetAlertIcon, showCancelButton?: boolean, confirmButtonText?: string) {
        if (!icon) { icon = 'warning' }
        if (showCancelButton === undefined) { showCancelButton = true }
        if (!confirmButtonText) { confirmButtonText = 'ยืนยัน' }
        return new Promise((resolve, reject) => {
            Swal.fire({
                title: msg,
                icon: icon,
                allowOutsideClick: false,
                showCancelButton: showCancelButton,
                showConfirmButton: true,
                cancelButtonColor: '#9ca3af',
                confirmButtonColor: '#212121',
                cancelButtonText: 'ยกเลิก',
                confirmButtonText: confirmButtonText,
            }).then((afterClick) => {
                if (afterClick.isConfirmed === true) {
                    resolve(true)
                }
            })
        })
    }

    // light box
    lightBox(url: string, width?: string) {
        let defaultWidth: string = '600px'
        if (width) defaultWidth = width

        Swal.fire({
            width: defaultWidth,
            // imageWidth: '100%',
            // imageHeight: '100%',
            imageUrl: url,
            showConfirmButton: false,
            background: 'rgba(0, 0, 0, 0)',
            backdrop: 'rgba(0, 0, 0, 0.9)',
        })
    }
}