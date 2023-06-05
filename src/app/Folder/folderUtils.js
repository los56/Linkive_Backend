export function getFolderList(client, userID) {
    const query = `SELECT * FROM folders WHERE users_num = $1`;

    if(!client) {
        return null;
    }

    return new Promise((resolve, reject) => {
        client.query(query, [userID]).then(result => {
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