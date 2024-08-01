class CustomResponse {
    constructor(statusCode = 200, message = "success", data = []) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = true;
    }
}
export { CustomResponse };
