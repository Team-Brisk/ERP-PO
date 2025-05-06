import { errorMessage } from "./messageAlert";

function errorHandler(err: any) {
    if (err.response && err.response.status === 409) {
        errorMessage({ title: 'Conflict', message: err.response.data.msg });
    } else if (err.response && err.response.status === 500) {
        console.log(err.response);
        errorMessage({ title: err.response.data.msg, message: err.response.data.errMsg });
    } else if (err.response && err.response.status === 404) {
        errorMessage({ title: err.response.data.msg, message: err.response.data.errMsg });
    } else if (err.response && err.response.status === 503) {
        errorMessage({ title: err.response.data.msg, message: err.response.data.errMsg });
    }
    else {
        // กรณีอื่น ๆ
        errorMessage({ message: err.message || "An error occurred" });
    }
}

export default errorHandler