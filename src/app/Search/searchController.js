const {getMemoListWithFolderName} = require("../Memo/memoUtils");
const {findUserById} = require('../User/userDao');
const pool = require('../../../config/database').default;

const {searchTitle, searchFolder, searchContent, searchAll} = require('./searchUtils');
const promiseErrorHandle = require("../../../utils/promiseErrorHandle");
const {search} = require("../../../build/server/968511344226b44c5b19f30fa4b346b7fabf165e69f8ff599563bb18cad0eafe/usr/src/app/src/app/Search/searchController");

exports.search = (req, res) => {
    const { keyword, method } = req.body;

    if(!keyword) {
        return res.status(400).json({message: "Need keyword"});
    }

    pool.connect((err, client, release) => {
        if(err) {
            client?.release();
            return res.status(500).json({message: "Internal server error"});
        }

        const { user } = res.locals;
        let users_num;

        findUserById(client, user.id).then(userData => {
            users_num = userData.users_num;

            return getMemoListWithFolderName(client, users_num);
        }).then(memoList => {
            let searchResult;

            if(method?.toLowerCase() == 'title') {
                searchResult = searchTitle(keyword, memoList);
            } else if(method?.toLowerCase() == 'folder') {
                searchResult = searchFolder(keyword, memoList);
            } else if(method?.toLowerCase() == 'content') {
                searchResult = searchContent(keyword, memoList);
            } else if(method?.toLowerCase() == 'place') {
                searchResult = searchPlace(keyword, memoList);
            } else {
                searchResult = searchAll(keyword, memoList);
            }

            return res.status(200).json({searchResult: searchResult});
        }).catch(e => {
            promiseErrorHandle(e, res);
        }).finally(() => {
            client?.release();
        });
    })
}