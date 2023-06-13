const pool = require("../../../config/database").default;
const { findUserById } = require("../User/userDao");
const promiseErrorHandle = require("../../../utils/promiseErrorHandle");

const bcrypt = require('bcrypt');

const { getFolderList, getFolderInfo } = require('./folderUtils');
const {getMemoList} = require("../Memo/memoUtils");

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

            const { name, thumbnail } = req.body;
            let { password } = req.body;
            const users_num = userData.users_num;

            if(password) {
                password = bcrypt.hashSync(password, 5);
            }

            return client.query(insertQuery, [users_num, name, password, thumbnail]);
        }).then(result => {
            if(result.rows.length < 1) {
                throw {code: 500, message: "Internal server error - Block 2"};
            }

            return res.status(200).json({folder_num: result.rows[0].folder_num});
        }).catch(e => {
            return promiseErrorHandle(e, res);
        }).finally(() => {
            client.release();
        });
    });
}

exports.editFolder = (req, res) => {
    const checkQuery = `SELECT * FROM folders WHERE folder_num = $1 AND users_num = $2`;
    const editQuery = `UPDATE folders SET name = $1, password = $2, thumbnail = $3 WHERE folder_num = $4 AND users_num = $5`;
    const editWOQuery = `UPDATE folders SET name = $1, thumbnail = $2 WHERE folder_num = $3 AND users_num = $4`

    const { user } = res.locals;

    pool.connect((err, client, release) => {
        if(err) {
            client?.release();
            return res.status(500).send({message: "Internal server error - Block 1"});
        }

        const { folder_num, name, thumbnail } = req.body;
        let { password } = req.body;
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

            if(checkData.rows[0].password) {
                const { prev_password } = req.body;
                if(!prev_password) {
                    throw {code: 401, message: "Need previous password"};
                }
                if(!bcrypt.compareSync(prev_password, checkData.rows[0].password)) {
                    throw {code: 401, message: "Password mismatch"};
                }
            }

            if(password) {
                password = bcrypt.hashSync(password, 5);
                return client.query(editQuery, [name, password, thumbnail, folder_num, users_num]);
            }

            return client.query(editWOQuery, [name, thumbnail, folder_num, users_num]);
        }).then(insertResult => {
            // if(insertResult.rows.length < 1) {
            //     throw {code: 500, message: "Internal server error - Block 2"};
            // }

            return res.status(200).json({message: "Folder edited"});
        }).catch(e => {
            return promiseErrorHandle(e, res);
        }).finally(() => {
            client.release();
        });
    });
}

exports.deleteFolder = (req, res) => {
    const checkMemoQuery = `SELECT * FROM memos WHERE folder_num = $1`;
    const checkPasswordQuery = `SELECT * FROM folders WHERE users_num = $1 AND folder_num = $2`;
    const deleteQuery = `DELETE FROM folders WHERE folder_num = $1 AND users_num = $2 RETURNING *`

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

            return client.query(checkMemoQuery, [folder_num])
        }).then(checkResult => {
            if (checkResult.rows.length > 0) {
                throw {code: 202, message: "Can't remove folder"}
            }

            return client.query(checkPasswordQuery, [users_num, folder_num])
        }).then(checkPasswordResult => {
            if(checkPasswordResult.rows.length < 1) {
                throw {code: 500, message: "Can't find folder"};
            }

            if (checkPasswordResult.rows[0].password) {
                const { password } = req.body;
                if (!password) {
                    throw {code: 401, message: "Need password"};
                }
                if (!bcrypt.compareSync(password, checkPasswordResult.rows[0].password)) {
                    throw {code: 401, message: "Password mismatch"};
                }
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

exports.requestFolderList = (req, res) => {
    const getListQuery = 'SELECT * FROM folders WHERE users_num = $1';
    const { user } = res.locals;

    pool.connect((err, client, release) => {
       if(err) {
           client?.release();
           return res.status(500).json({message: "Internal server error"});
       }

       let users_num, folderList;

       findUserById(client, user.id).then(userData => {
           if(!userData) {
               throw {code: 401, message: "Wrong userdata"}
           }

           users_num = userData.users_num

           return getFolderList(client, users_num);
       }).then(listData => {
            if(listData.length < 1) {
                throw {code: 401, message: "Can't find folders or server error"}
            }
            folderList = listData;
            return getMemoList(client, users_num);
       }).then(memoResult => {
            let memoList = memoResult;
            for(let i = 0;i < folderList.length;i++) {
                for(let j = 0;j < memoList.length;j++) {
                    folderList[i].memoCount = 0;

                    if(folderList[i].folder_num == memoList[j].folder_num) {
                        folderList[i].memoCount += 1;
                    }
                }
            }
            return res.status(200).json({folderList: folderList});
       }).catch(e => {
           return promiseErrorHandle(e, res)
       }).finally(() => {
           client.release();
       });
    });
}

exports.requestFolderInfo = (req, res) => {
    const { user } = res.locals;
    const { folder_num } = req.body;

    pool.connect((err, client, release) => {
        if(err) {
            client?.release();
            return res.status(500).json({message: "Internal server error"})
        }

        findUserById(client, user.id).then(userData => {
            if(!userData) {
                throw {code: 401, message: "Wrong userdata"};
            }

            return getFolderInfo(client, userData.users_num, folder_num);
        }).then(folderInfo => {
            return res.status(200).json({folder_info: folderInfo});
        }).catch(e => {
            promiseErrorHandle(e, res);
        }).finally(() => {
            client?.release();
        });
    });
}