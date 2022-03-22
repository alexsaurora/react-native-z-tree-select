import React, {useEffect, useRef, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList, TextInput, Keyboard
} from 'react-native';
import {breadthFirstRecursion, filterSearchData} from '../utils/menutransform';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TreeSelectProps} from '../index';
import _ from 'lodash';


const TreeSelect = (props: TreeSelectProps) => {
    const {
        defaultSelectedId = [], selectType, isOpen = false, data, openIds = [], leafCanBeSelected, onClick, onClickLeaf,
        isShowTreeId = false, selectedItemStyle, itemStyle, treeNodeStyle, searchAble,lazySelectedId = []
    } = props;

    const [nodesStatus, setNodeStatus] = useState<Map<any, any>>();
    const [currentNode, setCurrentNode] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [treeData, setTreeData] = useState([]);

    const searchInputRef = useRef(null);

    useEffect(() => {

        setCurrentNode(initCurrentNode());

        setNodeStatus(initNodesStatus());

        if (props.data) {
            setTreeData(data);
        }

    }, [data]);



    useEffect(() => {
        if (lazySelectedId.length>0 && currentNode!==null &&lazySelectedId.indexOf(currentNode)<0 && nodesStatus !==undefined) {
            let newNodesStatus = _.cloneDeep(nodesStatus);
            newNodesStatus.set(currentNode, !(newNodesStatus.get(currentNode)));
            setNodeStatus(newNodesStatus);
        }

    }, [lazySelectedId]);


    const initCurrentNode = () => {
        if (selectType === 'multiple') {
            return defaultSelectedId || [];
        }
        return defaultSelectedId && defaultSelectedId[0] || null;
    };

    const initNodesStatus = () => {
        const nodesStatus = new Map();
        if (!isOpen) {
            if (openIds && openIds.length) {
                for (let id of openIds) { // eslint-disable-line
                    const routes = _find(data, id);
                    routes.map(parent => nodesStatus.set(parent.id, true));
                }
            }
            // 设置默认选中时父节点的展开操作
            if (defaultSelectedId && defaultSelectedId.length) {
                for (let id of defaultSelectedId) { // eslint-disable-line
                    const routes = _find(data, id);
                    routes.map(parent => nodesStatus.set(parent.id, true));
                }
            }
            return nodesStatus;
        }
        breadthFirstRecursion(data).map(item => nodesStatus.set(item.id, true));
        return nodesStatus;
    };

    const _find = (data, id) => {
        const stack = [];
        let going = true;

        const walker = (childrenData, innerId) => {
            childrenData.forEach(item => {
                if (!going) {
                    return;
                }
                stack.push({
                    id: item.id,
                    name: item.name,
                    parentId: item.parentId,
                });
                if (item['id'] === innerId) {
                    going = false;
                } else if (item['children']) {
                    walker(item['children'], innerId);
                } else {
                    stack.pop();
                }
            });
            if (going) {
                stack.pop();
            }
        };

        walker(data, id);
        return stack;
    };


    const _onPressCollapse = ({e, item}) => {
        const routes = _find(data, item.id);
        let newNodesStatus = _.cloneDeep(nodesStatus);
        let finalCurrentNode;
        newNodesStatus.set(item && item.id, !nodesStatus.get(item && item.id)); // toggle
        // 计算currentNode的内容
        if (selectType === 'multiple') {
            const tempCurrentNode = currentNode.includes(item.id) ?
                currentNode.filter(nodeid => nodeid !== item.id) : currentNode.concat(item.id);
            if (leafCanBeSelected) {
                setNodeStatus(newNodesStatus);
            }
            finalCurrentNode = tempCurrentNode;
        } else {
            if (leafCanBeSelected) {
                setNodeStatus(newNodesStatus);
            }
            finalCurrentNode = item.id;
        }
        setCurrentNode(finalCurrentNode);
        setNodeStatus(newNodesStatus);
        if (onClick && typeof onClick === 'function') {
            onClick({
                item,
                routes,
                currentNode: finalCurrentNode,
            });
        }
    };

    const _onClickLeaf = ({e, item}) => { // eslint-disable-line
        const routes = _find(data, item.id);
        let finalCurrentNode;
        if (selectType === 'multiple') {
            const tempCurrentNode = currentNode.includes(item.id) ?
                currentNode.filter(nodeid => nodeid !== item.id) : currentNode.concat(item.id);

            finalCurrentNode = tempCurrentNode;
        } else {
            finalCurrentNode = item.id;
        }

        setCurrentNode(finalCurrentNode);

        if (onClick && typeof onClick === 'function') {
            onClick({
                item,
                routes,
                currentNode: finalCurrentNode,
            });
        }
        if (onClickLeaf && typeof onClickLeaf === 'function') {
            onClickLeaf && onClickLeaf({
                item,
                routes,
                currentNode: finalCurrentNode,
            });
        }

    };

    const renderTreeNodeIcon = (isOpen) => {
        const collapseIcon = isOpen ? {
            borderRightWidth: 5,
            borderRightColor: 'transparent',
            borderLeftWidth: 5,
            borderLeftColor: 'transparent',
            borderTopWidth: 10,
            borderTopColor: 'black',
        } : {
            borderBottomWidth: 5,
            borderBottomColor: 'transparent',
            borderTopWidth: 5,
            borderTopColor: 'transparent',
            borderLeftWidth: 10,
            borderLeftColor: 'black',
        };
        const openIcon = treeNodeStyle && treeNodeStyle.openIcon;
        const closeIcon = treeNodeStyle && treeNodeStyle.closeIcon;

        return openIcon && closeIcon ?
            <View>{isOpen ? openIcon : closeIcon}</View> :
            <View style={[styles.collapseIcon, collapseIcon]}/>;
    };

    const renderRow = ({item}) => {
        const {backgroudColor, fontSize, color} = itemStyle(item) && itemStyle(item);
        const openIcon = treeNodeStyle && treeNodeStyle.openIcon;
        const closeIcon = treeNodeStyle && treeNodeStyle.closeIcon;

        const selectedBackgroudColor = selectedItemStyle(item) && selectedItemStyle(item).backgroudColor;
        const selectedFontSize = selectedItemStyle(item) && selectedItemStyle(item).fontSize;
        const selectedColor = selectedItemStyle(item) && selectedItemStyle(item).color;
        const isCurrentNode = selectType === 'multiple' ? currentNode.includes(item.id) : (currentNode === item.id);

        if (item && item.children && item.children.length) {
            const isOpen = nodesStatus && nodesStatus.get(item && item.id) || false;
            return (
                <View>
                    <TouchableOpacity
                        onPress={(e) => _onPressCollapse({e, item})}>
                        <View style={{
                            flexDirection: 'row',
                            backgroundColor: !leafCanBeSelected && isCurrentNode ? selectedBackgroudColor || (item.checkAble ? '#FFEDCE' : '#fff') : backgroudColor || '#fff',
                            marginBottom: 2,
                            height: 30,
                            alignItems: 'center',
                        }}
                        >
                            {renderTreeNodeIcon(isOpen)}
                            {
                                isShowTreeId && <Text style={{
                                    fontSize: 14,
                                    marginLeft: 4,
                                }}>{item.id}</Text>
                            }
                            <Text
                                style={[styles.textName, !leafCanBeSelected && isCurrentNode ?
                                    {
                                        fontSize: selectedFontSize,
                                        color: selectedColor,
                                    } : {
                                        fontSize,
                                        color: color || (item.checkAble ? '#000000' : '#ccc'),
                                    }]}>{item.name}</Text>
                        </View>
                    </TouchableOpacity>
                    {
                        !isOpen ? null :
                            <FlatList
                                keyExtractor={(childrenItem, i) => i.toString()}
                                style={{flex: 1, marginLeft: 15}}
                                onEndReachedThreshold={0.01}
                                {...props}
                                getItemLayout={(data, index) => (
                                    {length: 30, offset: 30 * index, index}
                                )}
                                data={item.children}
                                extraData={{nodesStatus, currentNode}}
                                renderItem={renderRow}
                            />
                    }
                </View>
            );
        }
        return (
            <TouchableOpacity onPress={(e) => _onClickLeaf({e, item})}>
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: isCurrentNode ? selectedBackgroudColor || (item.checkAble ? '#FFEDCE' : '#fff') : backgroudColor || '#fff',
                    marginBottom: 2,
                    height: 30,
                    alignItems: 'center',
                }}
                >
                    <Text
                        style={[styles.textName, isCurrentNode ?
                            {
                                fontSize: selectedFontSize,
                                color: selectedColor,
                            } : {
                                fontSize,
                                color: color || (item.checkAble ? '#000000' : '#ccc'),
                            }]}
                    >{item.name}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const onSearch = () => {
        searchInputRef.current.blur();
        Keyboard.dismiss();
        let defaultData = _.cloneDeep(data);
        let result = filterSearchData(defaultData, searchValue);
        setTreeData(result);
    };


    const renderSearchBar = () => {
        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderRadius: 5,
                borderColor: '#aaa',
                marginHorizontal: 10,
            }}>
                <TextInput
                    style={{height: 38, paddingHorizontal: 5, flex: 1}}
                    value={searchValue}
                    autoCapitalize="none"
                    underlineColorAndroid="transparent"
                    autoCorrect={false}
                    blurOnSubmit
                    clearButtonMode="while-editing"
                    placeholder="搜索节点名称"
                    placeholderTextColor="#e9e5e1"
                    onChangeText={(text) => setSearchValue(text)}
                    ref={searchInputRef}
                />
                <TouchableOpacity onPress={onSearch}>
                    <Ionicons name="ios-search"
                              style={{fontSize: 25, marginHorizontal: 5}}/>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {
                searchAble ? renderSearchBar() : null
            }
            <FlatList
                keyExtractor={(item, i) => i.toString()}
                style={{
                    flex: 1,
                    marginVertical: 5,
                    paddingHorizontal: 15,
                }}
                onEndReachedThreshold={0.01}
                getItemLayout={(data, index) => (
                    {length: 30, offset: 30 * index, index}
                )}
                {...props}
                data={treeData}
                extraData={{currentNode, nodesStatus}}
                renderItem={renderRow}
            />
        </View>
    );
};

export default TreeSelect;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    textName: {
        fontSize: 14,
        marginLeft: 5,
    },
    contentContainer: {
        paddingBottom: 20,
        backgroundColor: 'white',
    },
    collapseIcon: {
        width: 0,
        height: 0,
        marginRight: 2,
        borderStyle: 'solid',
    },
});
