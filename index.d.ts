import { Component, ReactElement } from 'react';
import { StyleProp, TextStyle } from 'react-native';

export type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

export interface TreeItem {
	id: string;
	name: string;
	parentId: string;
	children?: TreeItem[];
	checkAble?: boolean;
}

export interface LeafClickProps {
	item: TreeItem;
	routes: Omit<TreeItem, 'children'>;
	currentNode: any;
}

export interface TreeSelectProps {
	data: TreeItem[];
	selectType?: 'single' | 'multiple',
	onClick?: (p: LeafClickProps) => void;
	onClickLeaf?: (p: LeafClickProps) => void;
	isOpen?: boolean;
	openIds?: TreeItem['id'][];
	isShowTreeId?: boolean;
	itemStyle?: (e:TreeItem) =>object;
	selectedItemStyle?: (e:TreeItem) =>object;
	treeNodeStyle?: {
		openIcon?: ReactElement;
		closeIcon?: ReactElement;
	};
	searchAble?:boolean,
	leafCanBeSelected?:boolean,
	defaultSelectedId?:Array<any>,
	lazySelectedId?:Array<any>,
}

declare class TreeSelect extends Component<TreeSelectProps, {}> {}

export default TreeSelect;
