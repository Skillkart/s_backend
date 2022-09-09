class AppError extends Error{
    constructor(message, statusCode, res) {
        super(message);
        res.status(statusCode).json({
            status: "fail",
            messsage: message,
        })

    }
}
module.exports = AppError