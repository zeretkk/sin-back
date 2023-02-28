class HTTPException extends Error {
    status
    trace
    constructor(status, message, trace = []) {
        super(message)
        this.status = status
        this.trace = trace
    }
    static Unauthorized() {
        return new HTTPException(401, 'Unauthorized Exception')
    }
    static BadRequest(message, errors) {
        return new HTTPException(400, message, errors)
    }
    static Internal(errors) {
        return new HTTPException(500, 'Internal Server error', errors)
    }
    static NotFound() {
        return new HTTPException(404, 'Resource Not Found')
    }
}

function exceptionMiddleware(err, req, res, next) {
    console.log(err)
    if (err instanceof HTTPException) {
        if (err.status === 401) {
            res.clearCookie('refreshToken')
        }
        return res.status(err.status).json({ message: err.message, errors: err.trace })
    }
    return res.status(500).json({ message: 'Internal Server Error' })
}

module.exports = { HTTPException, exceptionMiddleware }
