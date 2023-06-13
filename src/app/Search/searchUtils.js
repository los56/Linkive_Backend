export function searchTitle(keyword, memos) {
    const result = [];

    for(let i = 0;i < memos.length;i++) {
        if(memos[i].title.includes(keyword)) {
            result.push(memos[i]);
        }
    }

    return result;
}

export function searchFolder(keyword, memos) {
    const result = [];

    for(let i = 0;i < memos.length;i++) {
        if(memos[i].folder_name?.includes(keyword)) {
            result.push(memos[i]);
        }
    }

    return result;
}

export function searchContent(keyword, memos) {
    const result = [];

    for(let i = 0;i < memos.length;i++) {
        const content = memos[i].content.arr;
        for(let j = 0;j < content.length;j++) {
            if(content[j].type == "text") {
                if(content[j].value.includes(keyword)) {
                    result.push(memos[i]);
                    break;
                }
            }
        }
    }

    return result;
}

export function searchPlace(keyword, memos) {
    const result = [];

    for(let i = 0;i < memos.length;i++) {
        const content = memos[i].content.arr;
        for(let j = 0;j < content.length;j++) {
            if(content[j].type == "place") {
                if(content[j].road_address?.includes(keyword) || content[j].land_address?.includes(keyword)) {
                    result.push(memos[i]);
                    break;
                }
            }
        }
    }

    return result;
}

export function searchAll(keyword, memos) {
    const result = {};

    result.title = searchTitle(keyword, memos);
    result.content = searchContent(keyword, memos);
    result.folder = searchFolder(keyword, memos);
    result.place = searchPlace(keyword, memos);

    return result;
}
