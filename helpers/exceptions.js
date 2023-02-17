const exceptions = {
    UNIQUE:{code: 400, type:'unique', message:'Index must be unique'},
    INTERNAL:{code:500, type: 'internal', message: 'Internal Server error'},
    BAD:{code:400, type: 'bad', message: 'Bad Request'},
}
module.exports = exceptions