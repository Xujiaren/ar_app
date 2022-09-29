//import liraries
import React, { Component } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Swipeout from 'react-native-swipeout';

import RefreshListView, {RefreshState} from '../../component/base/RefreshListView';
import TabView from '../../component/base/TabView';
import NewsCell from '../../component/news/NewsCell';
import SpecialCell from '../../component/discovery/SpecialCell';
import VodCell from '../../component/course/VodCell';
import ArticleCell from '../../component/course/ArticleCell';
import AskCell from '../../component/user/AskCell';

import asset from '../../config/asset';
import theme from '../../config/theme';

// create a component
class UserCollect extends Component {

    static navigationOptions = {
        title:'我的收藏',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        this.page = 0;
        this.pages = 0;
        this.total = 0;
        this.items = [];

        this.state = {
            type: 0,
            keyword: '',
            refreshState: RefreshState.Idle,
        }

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    componentDidMount() {
        this._onHeaderRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {collect_course, collect_item} = nextProps;

        if (collect_course !== this.props.collect_course) {
            this.page = collect_course.page;
            this.pages = collect_course.pages;
            this.total = collect_course.total;
            this.items = this.items.concat(collect_course.items);
        }

        if (collect_item !== this.props.collect_item) {
            this.page = collect_item.page;
            this.pages = collect_item.pages;
            this.total = collect_item.total;
            this.items = this.items.concat(collect_item.items);
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    _onHeaderRefresh() {
        const {actions} = this.props;
        const {type, keyword} = this.state;

        this.page = 0;
        this.pages = 0;
        this.total = 0;
        this.items = [];

        if (type < 5) {
            let status = 0;
            let _type = type;

            if (_type == 3) {
                _type = 2;
                status = 1;
            } else if (_type == 4) {
                _type = 3;
            }

            actions.user.collectCourse(keyword, _type, status, this.page);
        } else if (type == 5) {
            actions.user.collectItem(keyword, 11, this.page);
        } else if (type == 6) {
            actions.user.collectItem(keyword, 15, this.page);
        } else if (type == 7) {
            actions.user.collectItem(keyword, 10, this.page);
        }

        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
        const {actions} = this.props;
        const {type, keyword} = this.state;

        if (this.page < this.pages) {
            this.setState({refreshState: RefreshState.FooterRefreshing});
            this.page = this.page + 1;

            if (type < 5) {
                let status = 0;
                let _type = type;

                if (_type == 3) {
                    _type = 2;
                    status = 1;
                } else if (_type == 4) {
                    _type = 3;
                }

                actions.user.collectCourse(keyword, _type, status, this.page);
            } else if (type == 5) {
                actions.user.collectItem(keyword, 11, this.page);
            } else if (type == 6) {
                actions.user.collectItem(keyword, 15, this.page);
            } else if (type == 7) {
                actions.user.collectItem(keyword, 10, this.page);
            }
        } else {
            this.setState({refreshState: RefreshState.NoMoreData});
        }
    }

    _renderItem(item) {
        const {navigation, actions} = this.props;
        const {type} = this.state;

        const data = item.item;

        let ctype = 3;
        let content_id = 0;
        if (type < 5) {
            content_id = data.courseId;
        } else if (type == 5) {
            ctype = 11;
            content_id = data.articleId;
        } else if (type == 6) {
            ctype = 15;
            content_id = data.articleId;
        } else if (type == 7) {
            ctype = 10;
            content_id = data.askId;
        }

        const swipeoutBtns = [
            {
                text: '取消收藏',
                onPress: () => {
					actions.user.uncollect({
						content_id: content_id,
						ctype: ctype,
						resolved: (data) => {
							this._onHeaderRefresh();
						},
						rejected: (msg) => {
						}
					})
				},
            }
        ];

        if (type == 1) {
            return (
                <Swipeout backgroundColor={'white'} right={swipeoutBtns}>
                    <VodCell course={data} onPress={() => navigation.navigate('Audio', {course: data})}/>
                </Swipeout>
            )
            
        }

        if (type == 2) {
            if (data.chapter > 0) return null;
            
            return (
                <Swipeout backgroundColor={'white'} right={swipeoutBtns}>
                    <VodCell course={data} onPress={() => navigation.navigate('Live', {course: data})}/>
                </Swipeout>
            )
            
        }

        if (type == 3) {
            return (
                <Swipeout backgroundColor={'white'} right={swipeoutBtns}>
                    <VodCell course={data} onPress={() => navigation.navigate('Vod', {course: data})}/>
                </Swipeout>
            )
            
        }

        if (type == 4) {
            return (
                <Swipeout backgroundColor={'white'} right={swipeoutBtns}>
                    <ArticleCell ttype={data.ttype}  course={data} onPress={() => navigation.navigate('Article', {course: data})}/>
                </Swipeout>
            )
        }

        if (type == 5) {
            return (
                <Swipeout backgroundColor={'white'} right={swipeoutBtns} autoClose={false}>
                    <NewsCell ttype={data.ttype} style={[styles.mb_15]} news={data} onPress={() => navigation.navigate('News', {news: data})}/>
                </Swipeout>
            )
        } else if (type == 6) {
            return (
                <Swipeout backgroundColor={'white'} right={swipeoutBtns}>
                    <SpecialCell special={data} onPress={() => navigation.navigate('Special', {special: data})}/>
                </Swipeout>
            )
        } else if (type == 7) {
            return (
                <Swipeout backgroundColor={'white'} right={swipeoutBtns}>
                    <AskCell ask={data} onPress={() => navigation.navigate('Ask', {ask: data})}/>
                </Swipeout>
            )
        }

        return (
            <Swipeout backgroundColor={'white'} right={swipeoutBtns}>
                <VodCell course={data} onPress={() => navigation.navigate('Vod', {course: data})}/>
            </Swipeout>
        )
    }

    render() {
        const {type, keyword} = this.state;

        return (
            <View style={styles.container}>
                <TabView items={['视频', '音频', '直播', '回播', '图文', '资讯', '专题', '问答']} current={type} onSelected={(index) => {
                    this.setState({
                        keyword: '',
                        type: index
                    }, () => this._onHeaderRefresh());
                }}/>
                <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.p_10]}>
                    <View style={[styles.bg_lgray, styles.f6, styles.circle_20]}>
                        <TextInput style={[styles.input, styles.p_10]}
                        placeholder={'请输入关键词'}
                        value={keyword}
                        onChangeText={(text) => {this.setState({keyword:text});}}
                        />
                    </View>
                    <TouchableOpacity style={[styles.f1, styles.ai_ct]} onPress={this._onHeaderRefresh}>
                        <Text>搜索</Text>
                    </TouchableOpacity>
                </View>
                <RefreshListView
                    contentContainerStyle={[styles.p_20]}
                    showsVerticalScrollIndicator={false}
                    data={this.items}
                    extraData={this.state}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this._onHeaderRefresh}
                    onFooterRefresh={this._onFooterRefresh}
                    ListEmptyComponent={() => {
                        if (this.state.refreshState == RefreshState.Idle) {
                            return (
                                <View style={[styles.ai_ct, styles.jc_ct]}>
                                    <Image source={asset.base.empty} style={[styles.empty, styles.mt_25]}/>
                                </View>
                            )
                        }

                        return null;
                    }}
                />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    search: {
        flex: 6
    },
});

export const LayoutComponent = UserCollect;

export function mapStateToProps(state) {
    return {
        collect_course: state.user.collect_course,
        collect_item: state.user.collect_item,
    };
}