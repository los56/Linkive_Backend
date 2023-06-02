const pool = require("../../../config/database").default;
const { findUserById } = require("../User/userDao");
const promiseErrorHandle = require("../../../utils/promiseErrorHandle");

exports.createPagesheet = (req, res) => {
    const insertQuery = `INSERT INTO pagesheets(users_num, name, layout) VALUES ($1, $2, $3) RETURNING pagesheet_num`

    const { user } = res.locals;

    pool.connect((err, client, release) => {
       if(err) {
           client?.release();
           return res.status(500).json({message: "Internal server error - Block 1"});
       }

       let users_num;
       const { name, layout } = req.body;

       findUserById(client, user.id).then(userData => {
           if(!userData) {
               throw {code: 401, message: "Wrong userdata"};
           }

           users_num = userData.users_num;

           return client.query(insertQuery, [users_num, name, layout]);
       }).then(queryResult => {
           if(queryResult.rows.length < 1) {
                throw {code: 500, message: "Internal server error - Block 2"};
           }

           return res.status(200).json({pagesheet_num: queryResult.rows[0].pagesheet_num});
       }).catch(e => {
           return promiseErrorHandle(e, res);
       }).finally(() => {
           client?.release();
       });
    });
};

exports.editPagesheet = (req, res) => {
    const editQuery = `UPDATE pagesheets SET name = $1, layout = $2 WHERE users_num = $3 AND pagesheet_num = $4 RETURNING *`;

    let users_num;
    const { user } = res.locals;
    const { name, layout, pagesheet_num } = req.body;

    pool.connect((err, client, release) => {
        if(err) {
            client?.release();
            return res.status(500).json({message: "Internal sever error - Block 1"});
        }

        findUserById(client, user.id).then(userData => {
            if(!userData) {
                throw {code: 401, message: "Wrong userdata"};
            }

            users_num = userData.users_num;
            return client.query(editQuery, [name, layout, users_num, pagesheet_num]);
        }).then(editResult => {
            if(editResult.rows.length < 1) {
                throw {code: 400, message: "Can't find pagesheet"};
            }

            return res.status(200).json({message: "Pagesheet edited"});
        }).catch(e => {
            promiseErrorHandle(e, res);
        }).finally(() => {
            client?.release();
        });
    });
};

exports.deletePagesheet = (req, res) => {
    const deleteQuery = `DELETE FROM pagesheets WHERE pagesheet_num = S1 AND users_num = $2 RETURNING *`

    const { user } = res.locals;
    const { pagesheet_num } = req.body;

    let users_num;

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

            return client.query(deleteQuery, [pagesheet_num, users_num]);
        }).then(deleteResult => {
            if(deleteResult.rows.length < 1) {
                throw {code: 400, message: "Can't find pagesheet"};
            }

            return res.status(200).json({message: "Pagesheet deleted"});
        }).catch(e => {
            promiseErrorHandle(e, res);
        }).finally(() => {
            client?.release();
        });
    })
};

exports.getPagesheet = (req, res) => {
    const requestQuery = `SELECT pagesheet_num, name, layout FROM pagesheets WHERE users_num = $1 OR users_num = 0`

    const { user } = res.locals;

    pool.connect((err, client, release) => {
        if(err) {
            client?.release();
            return res.status(500).json({message: "Internal server error - Block 1"});
        }

        findUserById(client, user.id).then(userData => {
            if(!userData) {
                throw {code: 401, message: "Wrong userdata"};
            }

            return client.query(requestQuery, [userData.users_num]);
        }).then(getResult => {
            if(getResult.rows.length < 1) {
                throw {code: 400, message: "Can't find pagesheets"};
            }

            return res.status(200).json({pagesheets: getResult.rows});
        }).catch(e => {
            promiseErrorHandle(e, res);
        }).finally(() => {
            client?.release();
        })
    })
}