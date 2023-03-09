exports.upload = (req, res) => {
    console.log(req.file);
    return res.send(req.file);
}

exports.delete = (req, res) => {

}

