//import liraries
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import RefreshListView, {RefreshState} from '../../../component/base/RefreshListView';
import TabView from '../../../component/base/TabView';
import asset from '../../../config/asset';
import theme from '../../../config/theme';

const status = ['进行中', '未开始', '已结束'];
// create a component
class UserTest extends Component {

    static navigationOptions = ({navigation}) => {
		return {
            title: '我的考试',
            headerRight: () => {
                return (
                    <TouchableOpacity style={[styles.mr_15]} onPress={() => navigation.navigate('UserWrong')}>
                        <Text style={[styles.label_dgray]}>错题集</Text>
                    </TouchableOpacity>
                )
            }
		}
	};


    constructor(props) {
        super(props);

        this.page = 0;
        this.pages = 0;
        this.total = 0;
        this.items = [];

        this.state = {
            type: 0,
            refreshState: RefreshState.Idle,
        }

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    componentDidMount() {
        const {navigation} = this.props;
        this.focuSub = navigation.addListener('didFocus', (route) => {
            this._onHeaderRefresh();
        })
    }

    componentWillUnmount(){
        this.focuSub && this.focuSub.remove();
    }

    componentWillReceiveProps(nextProps) {
        const {paper, must} = nextProps;

        if (paper !== this.props.paper) {
            this.page = paper.page;
            this.pages = paper.pages;
            this.total = paper.total;
            this.items = this.items.concat(paper.items);
        }

        if (must !== this.props.must) {
            this.items = must;
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    _onHeaderRefresh() {
        const {actions} = this.props;
        const {type} = this.state;

        this.page = 0;
        this.pages = 0;
        this.total = 0;
        this.items = [];

        console.info('type===' + type);

        if (type == 0) {
            actions.exam.must();
        } else {
            actions.exam.userPaper(1, 0);
        }
        
        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
        const {actions} = this.props;
        const {type} = this.state;

        if (type == 0) {
            actions.exam.must();  
        } else {
            if (this.page < this.pages) {
                this.setState({refreshState: RefreshState.FooterRefreshing});
                this.page = this.page + 1;
                actions.exam.userPaper(1, this.page);
            } else {
                this.setState({refreshState: RefreshState.NoMoreData});
            }
        }
    }

    _renderItem(item) {
        const {navigation} = this.props;
        const {type} = this.state;
        const paper = item.item;

        if (type == 0) {
            return (
                <TouchableOpacity style={[styles.p_20, styles.row, styles.ai_ct, styles.jc_sb, styles.bg_white, styles.b_line]} disabled={paper.astatus > 0} onPress={() => navigation.navigate('Paper', {paper: paper, level_id: 0})}>
                    <View style={[styles.row, styles.ai_fs, styles.f6]}>
                        <Image source={{uri: paper.coverImg}} style={[styles.cover]}/>
                        <View style={[styles.ml_15]}>
                            <Text>[{status[paper.astatus]}] {paper.paperName} - {paper.paperTitleName}</Text>
                            <Text style={[styles.label_gray, styles.mt_5]}>{paper.beginTimeFt} - {paper.endTimeFT}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }

        if (!paper.paperDTO) return null;

        return (
            <TouchableOpacity style={[styles.p_20, styles.row, styles.ai_ct, styles.jc_sb, styles.bg_white, styles.b_line]} onPress={() => navigation.navigate('Paper', {paper: paper, level_id: 0})}>
                <View style={[styles.row, styles.ai_fs, styles.f6]}>
                    <Image source={{uri: paper.paperDTO.coverImg}} style={[styles.cover]}/>
                    <View style={[styles.ml_15]}>
                        <Text>{paper.paperName} - {paper.paperDTO.paperTitleName}</Text>
                        <Text style={[styles.label_gray, styles.mt_5]}>{paper.paperDTO.pubTimeFt}</Text>
                    </View>
                </View>
                <Text style={[styles.label_blue, styles.f1]}>{paper.status == 0 ? '未完成' : '成绩' + paper.score}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const {type} = this.state;

        return (
            <View style={styles.container}>
                <TabView items={['待考', '历史考试']} current={type} center={true} onSelected={(index) => {
                    console.info(index);
                    this.setState({
                        type: index
                    }, () => this._onHeaderRefresh());
                }}/>
                <RefreshListView
                    showsVerticalScrollIndicator={false}
                    data={this.items}
                    extraData={this.state}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this._onHeaderRefresh}
                    onFooterRefresh={this._onFooterRefresh}
                    ListEmptyComponent={() => {
                        return (
                            <View style={[styles.ai_ct, styles.jc_ct]}>
                                <Image source={asset.base.empty} style={[styles.empty, styles.mt_25]}/>
                            </View>
                        )
                    }}
                />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA'
    },
    cover: {
        width: 80,
        height: 60,
    }
});

export const LayoutComponent = UserTest;

export function mapStateToProps(state) {
    return {
        must: state.exam.must,
        paper: state.exam.paper,
    };
}