function promiseErrorHandle(e, res) {
    console.error(e);
    if(e.hasOwnProperty('name')) {
        return res.status(500).json({message: "Internal Server Error"});
    } else {
        return res.status(500).json(e);
    }
}

module.exports = promiseErrorHandle;