# react-native-z-tree-select
一个好用的react-native树选择组件，支持单选/多选，支持分步加载，支持树中的单项自定义判断是否可选，支持自定义图标，支持节点搜索。

灵感来源于https://github.com/suwu150/react-native-tree-select这个项目，但是发现这个项目已经不再维护了，一些业务需要无法满足，所以对它做了一些改造，增加了自定义判断是否可选、支持分步加载、节点搜索的功能。



#### 一、安装使用

```shell
npm install react-native-z-tree-select --save
```

#### 二、属性与数据结构

组件props属性：

```typescript
export interface TreeSelectProps {
	data: TreeItem[];//树型结构数据
	selectType?: 'single' | 'multiple',//选择类型：单选/多选
	onClick?: (p: LeafClickProps) => void;//节点点击事件
	onClickLeaf?: (p: LeafClickProps) => void;//叶子节点点击事件
	isOpen?: boolean;//是否默认打开所有节点，优先级高于openIds，当true时忽略openIds
	openIds?: TreeItem['id'][];//指定默认打开的节点id
	isShowTreeId?: boolean;//指定是否显示节点id
	itemStyle?: (e:TreeItem) =>object;//指定item项的样式,其中包含三个子项backgroudColor：背景的颜色, fontSize：字体大小, color：字体的颜色，可根据TreeItem数据进行自定义展示
	selectedItemStyle?: (e:TreeItem) =>object;//指定点击按钮选中时的样式,其中包含三个子项backgroudColor：选中时的颜色, fontSize：选中时的字体大小, color：选中时字体的颜色，可根据TreeItem数据进行自定义展示
	treeNodeStyle?: {//指定节点处的图标样式，包含两个属性openIcon，closeIcon,支持传icon和image类型
		openIcon?: ReactElement;
		closeIcon?: ReactElement;
	};
	searchAble?:boolean,//是否打开节点搜索栏
	leafCanBeSelected?:boolean,//指定只能够选择叶子节点
	defaultSelectedId?:Array<any>,//指定默认选中的节点id
	lazySelectedId?:Array<any>,//分步加载数据时，需要更新的当前选择节点
}
```

数据结构：

```typescript
export interface TreeItem {
	id: string;
	name: string;
	parentId: string;
	children?: TreeItem[];
	checkAble?: boolean;//是否可选，若不可选则背景颜色默认置灰，点击选择后默认不进行高亮展示
}
```

#### 三、示例

```typescript
import ZTreeSelect from 'react-native-tree-select';

<ZTreeSelect
    data={deptAndUser}
    // lazySelectedId={[currentId]}
    isShowTreeId={false}
    selectType="single"
    itemStyle={(item) => {
      return {
        // backgroudColor:'#fff',
        fontSize: 14,
        // color: item.checkAble ? '#000000' : '#ccc'
      }
    }}
    selectedItemStyle={(item) => {
      return {
        // backgroudColor:  item.checkAble ? '#f7d79b' : '#fff',
        fontSize: 14,
        // color: '#171e99'
      }
    }}
    onClick={(item) => {
      console.log('当前选中的节点：', item);
      setSelectParams(item);
      //分步加载使用下面的内容进行数据请求和处理
      // if (!item.item.children) {
      //     loadData(item.currentNode);
      // }else{
      //     setCurrentId(item.currentNode)
      // }

    }}
    onClickLeaf={() => {
    }}
    searchAble={true}
/>
```



