const exceptions = {
    UNIQUE:{code: 400, type:'unique', message:'Index must be unique'},
    INTERNAL:{code:500, type: 'internal', message: 'Internal Server error'}
}
module.exports = exceptions