//import liraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import qs from 'query-string';
import Carousel, {Pagination} from 'react-native-snap-carousel';

import RefreshListView, {RefreshState} from '../../component/base/RefreshListView';
import TabView from '../../component/base/TabView';
import asset from '../../config/asset';
import theme from '../../config/theme';
import * as tool from '../../util/tool';

const status = ['审核中', '退群', '已踢出'];

// create a component
class GroupChannel extends Component {

    static navigationOptions = {
        title:'打卡社区',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        this.ads = [];

        this.page = 0;
        this.pages = 1;
        this.total = 0;
        this.items = [];

        this.state = {
            type: 0,
            refreshState: RefreshState.Idle,
            canPub: false,
            adIndex: 0,
        }

        this.onJump = this.onJump.bind(this);
        this.onExit = this.onExit.bind(this);
        
        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._renderAd = this._renderAd.bind(this);
    }

    componentDidMount() {
        const {navigation, actions} = this.props;
        actions.user.user();

        //navigation.navigate('PublishGroup');

        this.focuSub = navigation.addListener('didFocus', (route) => {
            this._onHeaderRefresh();
        })
    }

    componentWillUnmount(){
        this.focuSub && this.focuSub.remove();
    }

    componentWillReceiveProps(nextProps) {
        const {user, group_ad, index, user_group} = nextProps;

        if (user !== this.props.user) {
            this.setState({
                canPub: user.canPubGroup,
            })
        }

        if (group_ad !== this.props.group_ad) {
            this.ads = group_ad;
        }

        if (index !== this.props.index) {
            this.items = this.items.concat(index.items);
            this.total = index.total;
            this.pages = index.pages;
            this.page = index.page;
        }

        if (user_group !== this.props.user_group) {
            this.items = this.items.concat(user_group.items);
            this.total = user_group.total;
            this.pages = user_group.pages;
            this.page = user_group.page;
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    _onHeaderRefresh() {
        const {actions} = this.props;
        const {type} = this.state;

        this.page = 0;
        this.pages = 1;
        this.total = 0;
        this.items = [];

        actions.config.groupAd();

        if (type == 0) {
            actions.group.index(0);
        } else {
            actions.group.user(1, 0);
        }

        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
        const {actions} = this.props;
        const {type} = this.state;

        if (this.page < this.pages) {
            this.setState({refreshState: RefreshState.FooterRefreshing});
            this.page = this.page + 1;
            if (type == 0) {
                actions.group.index(this.page);
            } else {
                actions.group.user(-1, this.page);
            }
        } else {
            this.setState({refreshState: RefreshState.NoMoreData});
        }
    }

    onJump(link) {
        const {navigation} = this.props;

        let data = qs.parseUrl(link);

        let page = '';
        let args = {};
        if (link.substring(0, 4) === 'http') {
            page = 'Web';
            args = {link: link};
        } else if (data.url.indexOf('courseDesc') !== -1) {
            const courseId = data.query['course_id'];
            page = 'Vod';
            args = {course: {courseId: courseId, courseName: ''}};
        } else if (data.url.indexOf('liveDesc') !== -1) {
            const courseId = data.query['course_id'];
            page = 'Live';
            args = {course: {courseId: courseId, courseName: ''}};
        } else if (data.url.indexOf('consultDesc') !== -1) {
            const courseId = data.query['course_id'];
            page = 'Article';
            args = {course: {courseId: courseId, courseName: ''}};
        } else if (data.url.indexOf('audioDeSC') !== -1) {
            const courseId = data.query['course_id'];
            page = 'Audio';
            args = {course: {courseId: courseId, courseName: ''}};
        } else if (data.url.indexOf('groupDesc') !== -1) {
            const activityId = data.query['group_id'];
            page = 'Group';
            args = {group: {activityId: activityId}};
        } else if (data.url.indexOf('articleDeSC') !== -1) {
            const articleId = data.query['article_id'];
            page = 'News';
            args = {news: {articleId: articleId}};
        } else if (data.url.indexOf('activityDeSC') !== -1) {
            const activityId = data.query['activity_id'];
            page = 'Activity';
            args = {activity: {activityId: activityId}};
        }
        
        navigation.navigate(page, args);
    }

    onExit(activity_id) {
        const {actions} = this.props;

        Alert.alert('打卡社区', '确定退出该活动？', [
            {text: '确认', onPress: () => {
                actions.group.exit({
                    activity_id: activity_id,
                    resolved: (data) => {
                        this._onHeaderRefresh();
                    },
                    rejected: (msg) => {
                        
                    },
                })
            }},
            {text: '取消', onPress: () => {
            }, style: 'cancel'}
        ]);
    }

    _renderItem(item) {
        const {navigation, user} = this.props;
        const {type} = this.state;
        const group = item.item;

        if (type == 1) {
            return (
                <View style={[styles.pt_10, styles.pb_10, styles.b_line]} >
                    <TouchableOpacity style={[styles.row]} onPress={() => navigation.navigate('Group', {group: group})}>
                        <Image source={{uri: group.activityImg}} style={[styles.thumb, styles.bg_l1gray]}/>
                        <View style={[styles.cell, styles.pl_10, styles.jc_sb]}>
                            <Text>{group.title}</Text>
                            <Text numberOfLines={1} style={[styles.label_gray, styles.label_12, styles.mt_5]}>{group.content}</Text>
                            <Text style={[styles.label_gray, styles.mt_5]}>{tool.ts2dt(group.beginTime)}-{tool.ts2dt(group.endTime)}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.mt_10]}>
                        <Text style={[styles.label_dgray]}>{group.commentNum}人打卡</Text>
                        {user.userId != group.userId ?
                        <TouchableOpacity style={[styles.btn_blue]} disabled={group.menberStatus != 1} onPress={() => this.onExit(group.activityId)}>
                            <Text style={[styles.label_blue]}>{status[group.menberStatus]}</Text>
                        </TouchableOpacity>
                        : null}
                    </View>
                    
                </View>
            )
        }

        return (
            <TouchableOpacity style={[styles.pt_10, styles.pb_10, styles.b_line]} onPress={() => navigation.navigate('Group', {group: group})}>
                <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
                    <View style={[styles.row, styles.ai_ct]}>
                        <Image source={{uri: group.avatar}} style={[styles.avatar, styles.bg_l1gray]}/>
                        <Text style={[styles.ml_10]}>{group.userName}</Text>
                    </View>
                    <Text style={[styles.label_dgray]}>{group.commentNum}人打卡</Text>
                </View>
                <View style={[styles.row, styles.mt_10]}>
                    <Image source={{uri: group.activityImg}} style={[styles.thumb, styles.bg_l1gray]}/>
                    <View style={[styles.cell, styles.pl_10, styles.jc_sb]}>
                        <Text>{group.title}</Text>
                        <Text numberOfLines={1} style={[styles.label_gray, styles.label_12, styles.mt_5]}>{group.content}</Text>
                        <Text style={[styles.label_gray, styles.mt_5]}>{tool.ts2dt(group.beginTime)}-{tool.ts2dt(group.endTime)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _renderAd(item, index) {
        const ad = item.item;
        return (
            <TouchableOpacity onPress={() => this.onJump(ad.link)}>
                <Image source={{uri: ad.fileUrl}} style={[styles.ad, styles.bg_l1gray, styles.circle_5]}/>
            </TouchableOpacity>
            
        )
    }

    render() {
        const {navigation} = this.props;
        const {type, adIndex, canPub} = this.state;

        return (
            <View style={styles.container}>
                <View style={[styles.ad_container]}>
                    <Carousel
                        autoplay={true}
                        loop={true}
                        containerCustomStyle={styles.m_20}
                        ref={(c) => { this._carousel = c; }}
                        data={this.ads}
                        renderItem={this._renderAd}
                        sliderWidth={theme.window.width - 40}
                        itemWidth={theme.window.width - 40}
                        onSnapToItem = {(index) => this.setState({adIndex: index})}
                    />
                    <Pagination
                        dotsLength={this.ads.length}
                        activeDotIndex={adIndex}
                        containerStyle={styles.ad_page}
                        dotStyle={styles.ad_dot}
                    />
                </View>
                <TabView items={['推荐活动', '我的打卡']} center={true} current={type} onSelected={(index) => {
                    this.setState({
                        type: index
                    }, () => {
                        this._onHeaderRefresh();
                    })
                }}/>
                <RefreshListView
                    contentContainerStyle={styles.p_20}
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
                {canPub ?
                <TouchableOpacity style={[styles.bg_blue, styles.circle_5, styles.p_15, styles.m_20, styles.ai_ct]} onPress={() => {
                    navigation.navigate('PublishGroup')
                }}>
                    <Text style={[styles.label_white]}>发布打卡活动</Text>
                </TouchableOpacity>
                : null}
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    ad_container: {
        
    },
    ad: {
        width: theme.window.width - 40,
        height: (theme.window.width - 40) * 0.39,
    },
    ad_page: {
        position: "absolute",
        bottom: 20,
        left: 0,
        right: 0,
        paddingVertical: 10,
    },
    ad_dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.92)'
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    thumb: {
        width: 120,
        height: 70,
    },
    cell: {
        width: theme.window.width - 160,
        height: 70,
    }
});

export const LayoutComponent = GroupChannel;

export function mapStateToProps(state) {
    return {
        group_ad: state.config.group_ad,
        index: state.group.index,
        user_group: state.group.user_group,
        user: state.user.user,
    };
}