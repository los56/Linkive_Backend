const pool = require("../../../config/database").default;
const { findUserById } = require("../User/userDao");
const promiseErrorHandle = require("../../../utils/promiseErrorHandle");

const bcrypt = require('bcrypt');

exports.createMemo = (req, res) => {
    const insertQuery = `INSERT INTO memos(owner, link, title, content, date_created, folder_num) VALUES ($1, $2, $3, $4, NOW(), $5) RETURNING memo_num`

    const { user } = res.locals;
    const { link, title, content, folder_num } = req.body;

    pool.connect((err, client, release) => {
        if(err) {
            client.release();
            return res.status(500).json({message: "Internal Server Error - Block 1"});
        }

        const getOwnerData = findUserById(client, user.id);
        getOwnerData.then(ownerData => {
            if(!ownerData) {
                client.release();
                return res.status(401).json({message: "Wrong Userdata"});
            }
            const owner = ownerData.users_num;

            client.query(insertQuery, [owner, link, title, content, folder_num] ,(err, result) => {
                client.release();
                if(err) {
                    console.error(err);
                    return res.status(500).json({message: "Internal Server Error - Block 2"});
                }
                return res.status(200).json({"memo_num": result.rows[0].memo_num});
            })
        })
    });
}

exports.editMemo = (req, res) => {
    const searchQuery = `SELECT * FROM memos WHERE memo_num = $1 AND owner = $2`;
    const editQuery = `UPDATE memos SET link = $1, title = $2, content = $3, folder_num = $4 WHERE memo_num= $5 AND owner = $6 RETURNING memo_num`

    const { memo_num, link, title, content, folder_num } = req.body;
    const { user } = res.locals;

    pool.connect((err, client, release) => {
        if(err) {
            client.release();
            return res.status(500).json({message: "Internal Server Error - Block 1"});
        }

        const getOwnerData = findUserById(client, user.id);
        getOwnerData.then(ownerData => {
            if(!ownerData) {
                client.release();
                return res.status(401).json({message: "Wrong Userdata"});
            }
            const owner = ownerData.users_num;

            client.query(searchQuery, [memo_num, owner]).then(result => {
                if(result.rows.length > 0) {
                    return client.query(editQuery, [link, title, content, folder_num, memo_num, owner]);
                } else {
                    throw {code: 401, message: "Permission Denied"};
                }
            }).then(result => {
                if(result.rows.length > 0) {
                    return res.status(200).json({message: "Memo edited"});
                } else {
                    throw {code: 500, message: "Error"}
                }
            }).catch(e => {
                return promiseErrorHandle(e, res);
            }).finally(() => {
                client.release();
            });
        });
    });
}

exports.deleteMemo = (req, res) => {
    const deleteQuery = `DELETE FROM memos WHERE memo_num = $1 AND owner = $2 RETURNING *`;

    const { user } = res.locals;
    const { memo_num } = req.body;

    pool.connect((err, client, release) => {
        if(err) {
            client.release();
            return res.status(500).json({message: "Internal Server Error - Block 1"});
        }

        const getOwnerData = findUserById(client, user.id);

        getOwnerData.then(ownerData => {
            if(!ownerData) {
                client.release();
                return res.status(401).json({message: "Wrong User Data"});
            }

            const owner = ownerData.users_num;

            client.query(deleteQuery, [memo_num, owner], (err, result) => {
                client.release();
                if(err) {
                    return res.status(500).json({message: "Internal Server Error"});
                }
                if(result.rows.length < 1) {
                    return res.status(401).json({message: "Permission Denied"});
                }
                return res.status(200).json({message: "Memo deleted"});
            });
        })
    });
}


const { getFolderList } = require('../Folder/folderUtils');
const { getMemoListWithFolderName } = require('../Memo/memoUtils');

exports.requestMemo = (req, res) => {
    const { user } = res.locals;
    let users_num, folderList, memoList;

    pool.connect((err, client, release) => {
       if(err) {
           client?.release();
           return res.status(500).json({message: "Internal server error - Block 1"});
       }

       findUserById(client, user.id).then(userData => {
           if (!userData) {
               throw {code: 401, message: "Wrong userdata"};
           }

           users_num = userData.users_num;
           return getMemoListWithFolderName(client, users_num);
       }).then(memoList => {
           return res.status(200).json({memoList: memoList});
       }).catch(e => {
           return promiseErrorHandle(e, res);
       }).finally(() => {
           client.release();
       });
    });
}

exports.detailMemo = (req, res) => {
    const getQuery = `SELECT * FROM memos WHERE owner = $1 AND memo_num = $2`;
    const getFolderName = `SELECT * FROM folders WHERE users_num = $1 AND folder_num = $2`;

    const { user } = res.locals;
    const memo_num = req.params.id;

    let users_num;

    pool.connect((err, client, release) => {
        if(err) {
            client?.release();
            return res.status(500).json({message: "Internal server error"});
        }

        findUserById(client, user.id).then(userData => {
            if(!userData) {
                throw {code: 401, message: "Wrong userdata"};
            }

            users_num = userData.users_num;

            return client.query(getQuery, [userData.users_num, memo_num])
        }).then(getResult => {
            if(getResult.rows.length < 1) {
                throw {code: 404, message: "Memo not found"};
            }

            const resultMemo = getResult.rows[0];

            if(resultMemo.folder_num) {
                client.query(getFolderName, [users_num, resultMemo.folder_num]).then(folderRes => {
                    if(folderRes.rows.length < 1) {
                        return res.status(200).json(resultMemo);
                    }

                    resultMemo.folder_name = folderRes.rows[0].name;

                    return res.status(200).json(resultMemo);
                })
            } else {
                return res.status(200).json(resultMemo);
            }
        }).catch(e => {
            promiseErrorHandle(e, res);
        }).finally(() => {
            client?.release();
        })
    })
}

exports.getMemoInFolder = (req, res) => {
    const folderQuery = `SELECT * FROM folders WHERE users_num = $1 AND folder_num = $2`;
    const query = `SELECT * FROM memos WHERE owner = $1 AND folder_num = $2`;

    const folder_num = req.params.id;
    const { user } = res.locals;

    let users_num;

    if(!folder_num) {
        return res.status(404).json({message: "Page not found"});
    }

    pool.connect((err, client, release) => {
        if(err) {
            client?.release();
            return res.status(500).json({message: "Internal server error - Block 1"});
        }

        findUserById(client, user.id).then(userData => {
            if(!userData) {
                throw {code: 401, message: "Wrong userdata"};
            }

            users_num = userData.users_num;

            return client.query(folderQuery, [users_num, folder_num])
        }).then(getFolderResult => {
            if (getFolderResult.rows.length < 1) {
                throw {code: 400, message: "Can't find folder"};
            }
            console.log(getFolderResult.rows);
            if (getFolderResult.rows[0].password) {
                const {password} = req.body;
                if (!password) {
                    throw {code: 401, message: "Need password"};
                }
                if (!bcrypt.compareSync(password, getFolderResult.rows[0].password)) {
                    throw {code: 401, message: "Password mismatch"};
                }
            }

            return client.query(query, [users_num, folder_num])
        }).then(getResult => {
            if(getResult.rows.length < 1) {
                return res.status(200).json({folder_num: folder_num, memoList: []})
            }
            return res.status(200).json({folder_num: folder_num, memoList: getResult.rows});
        }).catch(e => {
            promiseErrorHandle(e, res);
        }).finally(() => {
            client?.release();
        });
    });
}