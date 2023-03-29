import pool from '../../../config/database';

exports.createMemo = (req, res) => {
    const insertQuery = `INSERT INTO memos(owner, link, title, content, date_created, users_num, folder_num) VALUES ($1, $2, $3, $4, NOW(), 0, $5) RETURNING memo_num`

    const owner = 1 // For test
    const { link, title, content, folder_num } = req.body;

    pool.connect((err, client, release) => {
        if(err) {
            return res.status(500).json({"message": "Internal Server Error - Block 1"});
        }

        client.query(insertQuery, [owner, link, title, content, folder_num] ,(err, result) => {
            client.release();
            if(err) {
                console.error(err);
                return res.status(500).json({"message": "Internal Server Error - Block 2"});
            }
            return res.status(200).json({"memo_num": result.rows[0].memo_num});
        })
    });
}

exports.editMemo = (req, res) => {
    const searchQuery = `SELECT * FROM memos WHERE memo_num = $1 AND owner = $2`;
    const editQuery = `UPDATE memos SET link = $1, title = $2, content = $3, folder_num = $4 WHERE memo_num= $5 AND owner = $6 RETURNING memo_num`

    const { memo_num, link, title, content, folder_num } = req.body;
    const owner = 1;

    pool.connect((err, client, release) => {
        if(err) {
            return res.status(500).json({"message": "Internal Server Error - Block 1"});
        }

        client.query(searchQuery, [memo_num, owner]).then(result => {
            if(result.rows.length > 0) {
                return client.query(editQuery, [link, title, content, folder_num, memo_num, owner]);
            } else {
                throw {"message": "Permission Denied"};
            }
        }).then(result => {
            if(result.rows.length > 0) {
                return res.status(200).json({"message": "Memo Edited"});
            } else {
                throw {"message": "Error"}
            }
        }).catch(e => {
            if(e.hasOwnProperty('name')) {
                return res.status(500).json({message: "Internal Server Error"});
            } else {
                return res.status(500).json(e);
            }
        }).finally(() => {
            client.release();
        });
    });
}

exports.deleteMemo = (req, res) => {
    const deleteQuery = `DELETE FROM memos WHERE memo_num = $1 AND owner = $2 RETURNING *`;

    const owner = 1;
    const { memo_num } = req.body;

    pool.connect((err, client, release) => {
        client.query(deleteQuery, [memo_num, owner], (err, result) => {
            client.release();
            if(err) {
                return res.status(500).json({"message": "Internal Server Error"});
            }
            if(result.rows.length < 1) {
                return res.status(500).json({"message": "Permission Denied"});
            }
            return res.status(200).json({"message": "Memo Deleted"});
        });
    });
}
