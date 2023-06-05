function promiseErrorHandle(e, res) {
    console.error(e);
    if(e.hasOwnProperty('name')) {
        return res.status(500).json({message: "Internal Server Error"});
    } else {
        let code = e.code;
        delete e.code;
        return res.status(code).json(e);
    }
}

module.exports = promiseErrorHandle;