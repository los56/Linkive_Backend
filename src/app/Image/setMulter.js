const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'static/');
    },
    filename: (req, file, callback) => {
        let fileName = file.originalname;

        for(let i = fileName.length - 1;i >= 0;i--) {
            if(fileName[i] == '.') {
                fileName = fileName.slice(0, i) + '_' + Date.now() + fileName.slice(i);
                break;
            }
        }
        callback(null, fileName);
    }
})
const upload = multer({storage: storage});

module.exports = upload;