const fs = require('fs');

exports.upload = (req, res) => {
    console.log(req.file);
    return res.send(req.file);
}

exports.delete = (req, res) => {
    fs.unlink(`static/${req.body.filename}`, err => {
        if(err) {
            return res.status(402).json({"message": "Image delete error"});
        }
        return res.status(200).json({"message": "Image deleted"});
    });
}

