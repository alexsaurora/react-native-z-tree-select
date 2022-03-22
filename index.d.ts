import { Component, ReactElement } from 'react';
import { StyleProp, TextStyle } from 'react-native';

export type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

export interface TreeItem {
	id: string;
	name: string;
	parentId: string;
	children?: TreeItem[];
	checkAble?: boolean;//是否可选，若不可选则背景颜色默认置灰，点击选择后默认不进行高亮展示
}

export interface LeafClickProps {
	item: TreeItem;
	routes: Omit<TreeItem, 'children'>;
	currentNode: any;
}

export interface ItemLeafStyle {
	backgroudColor?:string,
	fontSize?:string | number,
	color?:string,
}

export interface TreeSelectProps {
	data: TreeItem[];//树型结构数据
	selectType?: 'single' | 'multiple',//选择类型：单选/多选
	onClick?: (p: LeafClickProps) => void;//节点点击事件
	onClickLeaf?: (p: LeafClickProps) => void;//叶子节点点击事件
	isOpen?: boolean;//是否默认打开所有节点，优先级高于openIds，当true时忽略openIds
	openIds?: TreeItem['id'][];//指定默认打开的节点id
	isShowTreeId?: boolean;//指定是否显示节点id
	itemStyle?: (e:TreeItem) =>any;//指定item项的样式,其中包含三个子项backgroudColor：背景的颜色, fontSize：字体大小, color：字体的颜色，可根据TreeItem数据进行自定义展示
	selectedItemStyle?: (e:TreeItem) =>any;//指定点击按钮选中时的样式,其中包含三个子项backgroudColor：选中时的颜色, fontSize：选中时的字体大小, color：选中时字体的颜色，可根据TreeItem数据进行自定义展示
	treeNodeStyle?: {//指定节点处的图标样式，包含两个属性openIcon，closeIcon,支持传icon和image类型
		openIcon?: ReactElement;
		closeIcon?: ReactElement;
	};
	searchAble?:boolean,//是否打开节点搜索栏
	leafCanBeSelected?:boolean,//指定只能够选择叶子节点
	defaultSelectedId?:Array<any>,//指定默认选中的节点id
	lazySelectedId?:Array<any>,//分步加载数据时，需要更新的当前选择节点
}

declare class TreeSelect extends Component<TreeSelectProps, {}> {}

export default TreeSelect;
