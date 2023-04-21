const pool = require("../../../config/database").default;
const { findUserById } = require("../User/userDao");
const promiseErrorHandle = require("../../../utils/promiseErrorHandle");

exports.createFolder = (req, res) => {
    const insertQuery = `INSERT INTO folders(users_num, name, password, thumbnail) VALUES($1, $2, $3, $4) RETURNING *`;

    const { user } = res.locals;

    pool.connect((err, client, release) => {
        if(err) {
            client?.release();
            return res.status(500).json({message: "Internal server error - Block 1"});
        }

        findUserById(client, user.id).then(userData => {
            if(!userData) {
                throw {code: 400, message: "Wrong userdata"}
            }

            const { name, password, thumbnail } = req.body;
            const { users_num } = userData.users_num;

            return client.query(insertQuery, [users_num, name, password, thumbnail]);
        }).then(result => {
            if(result.rows.length < 1) {
                throw {code: 500, message: "Internal server error - Block 2"};
            }

            return res.status(200).json({folder_num: result.rows[0].folder_num});
        }).catch(err => {
            return promiseErrorHandle(e, res);
        }).finally(() => {
            client.release();
        });
    });
}

exports.editFolder = (req, res) => {
    const checkQuery = `SELECT * FROM folders WHERE folder_num = $1 AND users_num = $2`;
    const editQuery = `UPDATE folders SET name = $1, password = $2, thumbnail = $3 WHERE folder_num = $4 AND users_num = $5`;

    const { user } = res.locals;

    pool.connect((err, client, release) => {
        if(err) {
            client?.release();
            return res.status(500).send({message: "Internal server error - Block 1"});
        }

        const { folder_num, name, password, thumbnail } = req.body;
        let users_num;

        findUserById(client, user.id).then(userData => {
            if(!userData) {
                throw {code: 401, message: "Wrong userdata"};
            }

            users_num = userData.users_num;

            return client.query(checkQuery, [folder_num, users_num])
        }).then(checkData => {
            if(checkData.rows.length < 1) {
                throw {code: 400, message: "Invalid folder number"};
            }

            return client.query(editQuery, [name, password, thumbnail, folder_num, users_num])
        }).then(insertResult => {
            if(insertResult.rows.length < 1) {
                throw {code: 500, message: "Internal server error - Block 2"};
            }

            return res.status(200).json({message: "Folder edited"});
        }).catch(e => {
            return promiseErrorHandle(e, res);
        }).finally(() => {
            client.release();
        });
    });
}

exports.deleteFolder = (req, res) => {
    const checkQuery = `SELECT * FROM memos WHERE folder_num = $1`;
    const deleteQuery = `DELETE FROM folders WHERE folders WHERE folder_num = $1 AND users_num = $2 RETURNING *`

    const { user } = res.locals;
    const { folder_num } = req.body;
    let users_num;

    pool.connect((err, client, release) => {
        if(err) {
            return res.status(500).json({message: "Internal server error - Block 1"});
        }

        findUserById(client, user.id).then(userData => {
            if(!userData) {
                throw {code: 401, message: "Wrong userdata"};
            }

            users_num = userData.users_num;

            return client.query(checkQuery, [folder_num])
        }).then(checkResult => {
            if(checkResult.rows.length > 0) {
                throw {code: 202, message: "Can't remove folder"}
            }

            return client.query(deleteQuery, [folder_num, users_num])
        }).then(deleteResult => {
            if(deleteResult.rows.length < 1) {
                throw {code: 500, message: "Internal server error - Block 2"};
            }

            return res.status(200).json({message: "Folder deleted"});
        }).catch(e => {
            return promiseErrorHandle(e, res);
        }).finally(() => {
            client.release();
        });
    });
}

