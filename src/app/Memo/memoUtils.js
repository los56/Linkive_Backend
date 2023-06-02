const { getFolderList } = require('../Folder/folderUtils');

export function getMemoList(client, userID) {
    const query = `SELECT * FROM memos WHERE owner = $1`;

    return new Promise((resolve, reject) => {
        if(!client || !userID) {
            reject();
        }

        client.query(query, [userID]).then(result => {
            resolve(result.rows);
        }).catch(e => {
            reject(e);
        })
    })
}

export function getMemoListWithFolderName(client, userID) {
    return new Promise((resolve, reject) => {
        if(!client || !userID) {
            reject();
        }

        Promise.all([
            getMemoList(client, userID),
            getFolderList(client, userID)
        ]).then(values => {
            const [memoList, folderList] = values;
            let folderOrdered = {}
            for(let i = 0;i < folderList.length;i++)
            {
                folderOrdered[folderList[i].folder_num.toString()] = folderList[i];
            }

            let memoNotProtected = [];
            for(let i = 0;i < memoList.length;i++) {
                if(memoList[i].folder_num) {
                    memoList[i].folder_name = folderOrdered[memoList[i].folder_num].name;
                    if(!folderOrdered[memoList[i].folder_num].isLocked) {
                        memoNotProtected.push(memoList[i]);
                    }
                } else {
                    memoNotProtected.push(memoList[i]);
                }
            }

            resolve(memoNotProtected);
        }).catch(e => {
            reject(e);
        });
    });
};

// export function checkMemoContent(content) {
//     const types = ['text', 'image', ]
//
//     content = content.arr;
//     for(let i = 0;i < content.length;i++) {
//         let flag = false;
//         if(content[i].key)
//     }
// }