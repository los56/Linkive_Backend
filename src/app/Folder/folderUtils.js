export function getFolderList(client, userNum) {
    const query = `SELECT * FROM folders WHERE users_num = $1`;

    if(!client) {
        return null;
    }

    return new Promise((resolve, reject) => {
        client.query(query, [userNum]).then(result => {
            const folderList = result.rows;

            for(let i = 0;i < folderList.length;i++) {
                if(folderList[i].password) {
                    folderList[i].isLocked = true;
                } else {
                    folderList[i].isLocked = false;
                }
                delete folderList[i].password;
            }
            resolve(result.rows);
        }).catch(e => {
            reject(e);
        });
    });
}

export function getFolderInfo(client, userNum, folderNum) {
    const query = `SELECT * FROM folders WHERE users_num = $1 AND folder_num = $2`;
    const memoQuery = `SELECT * FROM memos WHERE folder_num = $1`;

    if(!client) {
        return null;
    }

    return new Promise((resolve, reject) => {
        Promise.all([
            client.query(query, [userNum, folderNum]),
            client.query(memoQuery, [folderNum])
        ]).then(values => {
            const [folderInfo, memoList] = values;

            if(folderInfo.rows.length < 1) {
                throw {code: 200, message: "Can't find folder"};
            }

            const target = folderInfo.rows[0];

            if(target.password) {
                target.isLocked = true;
            } else {
                target.isLocked = false;
            }

            if(memoList.rows.length > 0) {
                target.memoCount = memoList.rows.length;
            }

            resolve(target);
        }).catch(e => {
            reject(e);
        })
    });
}