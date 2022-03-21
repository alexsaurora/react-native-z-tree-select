/* eslint-disable */
export const breadthFirstRecursion = (treeData, params) => {
    /**
     *  树结构广度优先遍历
     * @param treeData 树形结构数组数据, type=array
     * @params params：参数,用于说明_menus中父子节点的名称, type=object
     * */
    params = {
        sortCodeName: params && params.sortCodeName ? params.sortCodeName : 'sortCode',
        parentName: params && params.parentName ? params.parentName : 'parent',
        childrenName: params && params.childrenName ? params.childrenName : 'children',
    };
    let childrenNodes = [],
        children = params.childrenName,
        nodes = treeData;
    for (let item in treeData) {
        if (treeData[item][children]) {
            let temp = treeData[item][children];
            childrenNodes = childrenNodes.concat(temp);
        }
    }
    if (childrenNodes.length > 0) {
        nodes = nodes.concat(breadthFirstRecursion(childrenNodes, params));
    }
    console.log('breadthFirstRecursion得到的值',nodes)
    return nodes;
};

// 搜索值是否在children中
const isInChildren = (childrenTreeData, searchValues) => {
    if (!childrenTreeData || childrenTreeData?.length === 0) {
        return false;
    }
    for (let i = 0; i < childrenTreeData.length; i++) {
        const node = childrenTreeData[i];
        if (node?.name?.indexOf(searchValues) > -1) {
            return true;
        }
        const result = isInChildren(node.children, searchValues);
        if (result) {
            return true;
        }
    }
    return false;
};

export const filterSearchData = (treeData, searchValue) => {
    let nodes = [];

    if (searchValue.length > 0) {
        treeData.map((oneData, item) => {
            if (treeData[item]['name'].indexOf(searchValue) > -1) {
                nodes.push(treeData[item]);
            } else if (treeData[item]['children']) {
                const isIn = isInChildren(treeData[item]['children'], searchValue);
                if (isIn) {
                    const children = filterSearchData(treeData[item]['children'], searchValue);
                    treeData[item]['children'] = children;
                    nodes.push(treeData[item]);
                }
            }
        });
    } else {
        nodes = treeData;
    }
    console.log('nodes--', nodes);
    return nodes;
};

const getDataTree = (list, parentId) => {
    var result = [];
    for (let i = 0; i < list.length; i++) {
        var item = list[i];
        if (item.parentId === parentId) {

            var children = getDataTree(list, item.itemId);
            if (children != null) {
                item['children'] = children;
            }

            result.push(item);
        }
    }
    if (result.length === 0) {
        return null;
    }
    return result;
};


