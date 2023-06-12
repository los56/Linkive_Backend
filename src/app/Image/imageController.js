const fs = require('fs');

exports.upload = (req, res) => {
    if (!req.file) {
        return res.status(500).json({
            message: "Upload Error"
        });
    }
    return res.status(200).json({
        file_info: req.file
    });
}

exports.delete = (req, res) => {
    //USE ONLY SERVER
    if(req.ip != '127.0.0.1' && req.ip != 'localhost') {
        return res.status(401).json({message: "Permission denied"})
    }

    fs.unlink(`static/${req.body.filename}`, err => {
        if(err) {
            return res.status(402).json({message: "Image delete error"});
        }
        return res.status(200).json({message: "Image deleted"});
    });
}

