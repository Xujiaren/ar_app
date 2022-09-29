//import liraries
import React, { Component } from 'react';
import { View, Image, TouchableOpacity, ScrollView, RefreshControl, Text, StyleSheet, Linking, Platform, Modal, DeviceEventEmitter, BackHandler, Alert, PermissionsAndroid } from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import JAnalytics from 'janalytics-react-native';
import JPush from 'jpush-react-native';
import store from 'react-native-simple-store';

import qs from 'query-string';

import HudView from '../../component/base/HudView';
import NavCell from '../../component/base/NavCell';

import VVodCell from '../../component/course/VVodCell';
import VodCell from '../../component/course/VodCell';
import ArticleCell from '../../component/course/ArticleCell';

import ActivityCell from '../../component/discovery/ActivityCell';
import SpecialCell from '../../component/discovery/SpecialCell';

import NewsCell from '../../component/news/NewsCell';

import config from '../../config/param';
import asset from '../../config/asset';
import iconMap from '../../config/font';
import theme from '../../config/theme';

// create a component
class Home extends Component {

    constructor(props) {
        super(props);

        this.ads = [];
        this.pop_ads = [];
        this.lives = [];

        this.index = [];

        this.recomms = [];

        let agree = true;

        if (Platform.OS === 'android' && global.agree == 0) {
            agree = false;
        }

        this.state = {
            unread: 0,
            live_index: 0,
            adIndex: 0,
            keyword: '',
            
            agree: agree,

            pop: false,
            popIndex: 0,

            isRefreshing: false,
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.onAction = this.onAction.bind(this);
        this.onJump = this.onJump.bind(this);

        this.onAgree = this.onAgree.bind(this);
        this.onPop = this.onPop.bind(this);
        this.onExitPop = this.onExitPop.bind(this);

        this.handleBackButtonPressAndroid = this.handleBackButtonPressAndroid.bind(this);
        this._handleOpenURL = this._handleOpenURL.bind(this);

        this._renderAd = this._renderAd.bind(this);
        this._renderPopAd = this._renderPopAd.bind(this);
        this.renderLive = this.renderLive.bind(this);
        this.renderVod = this.renderVod.bind(this);
        this.renderNews = this.renderNews.bind(this);
        this.renderTeacher = this.renderTeacher.bind(this);
        this.renderArticle = this.renderArticle.bind(this);
        this.renderAudio = this.renderAudio.bind(this);
        this.renderActivity = this.renderActivity.bind(this);
        this.renderSpecial = this.renderSpecial.bind(this);
        this.renderRecomm = this.renderRecomm.bind(this);
    }

    componentDidMount() {
        const {navigation, actions} = this.props;
        //navigation.navigate('Teacher', {teacher: {teacherId: 7}});

        Linking.addEventListener('url', (event) => {
            const url = event.url;
            this._handleOpenURL(url);
        });

        Linking.getInitialURL().then(url => {
            this._handleOpenURL(url);
        });

        this.focuSub = navigation.addListener('didFocus', (route) => {
            if (Platform.OS === 'android' && global.agree == 0) {
                this.setState({
                    agree: false,
                })
            }

            this.onRefresh();
        })

        this.shareSub = DeviceEventEmitter.addListener('shared', (data) => {
            actions.user.log({
                log_type: 1,
                type: 1,
                device_id: 0,
                intro: '分享' + data.title,
                content_id: data.id,
                param: '',
                from: global.os,
                resolved: (data) => {

                },
                rejected: (msg) => {

                }
            })
        });
        
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonPressAndroid)
        }

        this.onJiguan()
    }

    componentWillUnmount(){
        this.focuSub && this.focuSub.remove();

        this.shareSub && this.shareSub.remove();

        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonPressAndroid)
        } 
    }

    handleBackButtonPressAndroid() {
        if (!this.props.navigation.isFocused()) {
            // The screen is not focused, so don't do anything
            return false;
        }

        Alert.alert('纳视界', '确认退出纳视界?', [
            {
                text: '取消',
                onPress: () => {
                    return true;
                },
                style: 'cancel',
            },
            {
                text: '确认',
                onPress: () =>  BackHandler.exitApp(),
            }
        ])
        return true;
    }

    _handleOpenURL(url) {
        const {navigation} = this.props;

        if (url && url.length > 0) {
            const linkArrs = url.split("//");
            const linkArr = linkArrs[linkArrs.length - 1].split("/");
            const linkPage = linkArr[0];
            const ids = linkArr[1].split('_');

            const linkId = parseInt(ids[0]);

            if (ids.length == 3) {
                global.fromuid = parseInt(ids[1]);
                const utype = parseInt(ids[2]);

                if (utype != global.utype) {
                    global.utype = utype;
                    
                    this.onRefresh();
                }
            }

            if(linkPage === 'live') {
                const course = {courseId: linkId};
                navigation.navigate('Live', {course: course});
            } else if (linkPage  === 'vod') {
                const course = {courseId: linkId};
                navigation.navigate('Vod',{course: course});
            } else if (linkPage  === 'audio') {
                const course = {courseId: linkId};
                navigation.navigate('Audio',{course: course});
            } else if(linkPage === 'article') {
                const course = {courseId: linkId};
                navigation.navigate('Article', {course:course});
            } else if(linkPage  === 'news') {
                const news = {articleId: linkId};
                navigation.navigate('News', {news: news});
            } else if(linkPage  === 'special') {
                const special = {articleId: linkId};
                navigation.navigate('Special', {special: special});
            } else if(linkPage  === 'activity') {
                const activity = {activityId: linkId};
                navigation.navigate('Activity', {activity: activity});
            } else if(linkPage  === 'squad') {
                const squad = {squadId: linkId};
                navigation.navigate('Squad', {squad: squad});
            } else if(linkPage  === 'group') {
                const group = {activityId: linkId};
                navigation.navigate('Group', {group: group});
            } else if(linkPage  === 'ask') {
                const ask = {askId: linkId};
                navigation.navigate('Ask', {ask: ask});
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        const {config, index, live, ad, pop_ad, teacher, recomm, unread} = nextProps;

        if (config !== this.props.config) {
            this.setState({
                keyword: config.search_def,
            })
        }

        if (index !== this.props.index) {
            this.index = index;
        }

        if (ad !== this.props.ad) {
            this.ads = ad;
        }

        if (pop_ad !== this.props.pop_ad) {
            this.pop_ads = pop_ad;

            this.onPop();
        }

        if (live !== this.props.live && live.items) {
            this.lives = live.items;
        }

        if (teacher !== this.props.teacher) {
            this.teachers = teacher;
        }

        if (recomm !== this.props.recomm) {
            this.recomms = recomm;
        }

        if (unread !== this.props.unread) {
            this.setState({
                unread: unread.message + unread.remind,
            })
        }

        setTimeout(() => this.setState({isRefreshing: false}), 300);
    }

    onJiguan = () => {
        if (this.state.agree) {
            JAnalytics.crashLogON();
            JAnalytics.init({appKey: config.jpush});
        }
    }

    onRefresh() {
        const {actions} = this.props;
        actions.user.user();
        actions.config.ad(1);
        actions.config.podAd();
        actions.config.config();
        actions.site.index();
        actions.course.live(0, 0, 0);
        actions.course.recomm();

        this.setState({
            isRefreshing: true,
        })
    }

    onAction(action, args) {
        const {navigation, actions, user} = this.props;

        if (!user.userId) {
            navigation.navigate('Passport');
        } else if (action == 'Book') {
            
            let live = this.lives[args.index];

            if (live.book) {
                actions.user.unbook({
                    course_id: live.courseId,
                    resolved: (data) => {    
                        live.book = false;
                        live.bookNum--;
                        this.lives[args.index] = live;

                        JPush.deleteTag({
                            sequence: new Date().getTime(), 
                            tags: [(global.utype == 0 ? 'o' : 'i') + live.courseId]
                        });
    
                        this.setState({
                            live_index: args.index,
                        })
                    },
                    rejected: (msg) => {
    
                    }
                })
            } else {
                actions.user.book({
                    course_id: live.courseId,
                    resolved: (data) => {
                        Alert.alert('预约', '已成功预约，开播前15分钟将会收到我们的通知提醒。', [{ text: "好的", onPress: () => console.log("")}]);

                        JPush.addTags({
                            sequence: new Date().getTime(), 
                            tags: [(global.utype == 0 ? 'o' : 'i') + live.courseId]
                        });

                        live.book = true;
                        live.bookNum++;
                        this.lives[args.index] = live;
    
                        this.setState({
                            live_index: args.index,
                        })
                    },
                    rejected: (msg) => {
    
                    }
                })
            }

            
        } else {
            navigation.navigate(action);
        }
    }

    onJump(link) {
        const {navigation} = this.props;

        this.onExitPop();

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
        } else if (data.url.indexOf('groupDeSC') !== -1) {
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

    onPop() {

        if (this.pop_ads.length > 0) {
            const lastPopId = this.pop_ads[this.pop_ads.length - 1].billboardId;
            store.get("pop").then(data => {
                const popId = data || 0;

                if (lastPopId != popId) {
                    this.setState({
                        pop: true,
                    })
                }
            })
        }
    }
    
    onExitPop() {
        this.setState({
            pop: false,
        }, () => {
            if (this.pop_ads.length > 0) {
                const lastPopId = this.pop_ads[this.pop_ads.length - 1].billboardId;
                store.save("pop", lastPopId).then(data => {
                    
                })
            }
        })
        
    }

    onAgree() {
        global.agree = 1;
        store.save("agree", 1).then(data => {
            this.setState({
                agree: true
            })

            if (Platform.OS === 'android') {
                PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]).then(result => {
                    
                })
            }

            this.onJiguan()
        })
    }

    _renderAd(item, index) {
        const ad = item.item;
        return (
            <TouchableOpacity onPress={() => this.onJump(ad.link)}>
                <Image source={{uri: ad.fileUrl}} style={[styles.ad, styles.bg_l1gray, styles.circle_5]}/>
            </TouchableOpacity>
            
        )
    }

    _renderPopAd(item, index) {
        const ad = item.item;
        return (
            <TouchableOpacity onPress={() => this.onJump(ad.link)}>
                <Image source={{uri: ad.fileUrl}} style={[styles.pop_ad, styles.bg_l1gray]}/>
                <View style={[styles.p_10, styles.pl_20, styles.pr_20]}>
                    <Text style={[styles.label_16]}>{ad.billboardName}</Text>
                    <Text style={[styles.label_gray, styles.mt_10]}>{ad.content}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderLive() {
        const {navigation} = this.props;

        return this.lives.map((live, index) => {
            const on = live.liveStatus == 1;

            return (
                <View style={[styles.bg_white, styles.circle_5, styles.p_15, styles.shadow, styles.mt_15]} key={'live_' + index}>
                    {index == 0 ?
                    <View style={[styles.pb_15, styles.row, styles.ai_ct, styles.jc_sb]}>
                        <Text style={[styles.label_16, styles.label_bold]}>直播资源</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('LiveChannel')}>
                            <Text style={[styles.label_gray]}>查看全部<Text style={[styles.icon, styles.label_gray]}>{iconMap('right')}</Text></Text>
                        </TouchableOpacity>
                    </View> : null}
                    <View style={[styles.row, styles.jc_sb, styles.ai_ct, styles.pb_10, styles.b_line]}>
                        <Text style={styles.label_12, on && styles.label_blue}>{on ? '正在直播中' : live.beginTimeFt}</Text>
                        <Text style={[styles.label_12, styles.label_gray]}>{live.liveStatus == 0 ? live.bookNum + '人已预约' : live.onlineNum + '人正在上课'}</Text>
                    </View>
                    <TouchableOpacity style={[styles.mt_10]} onPress={() => navigation.navigate('Live', {course: live})}>
                        <Text numberOfLines={1}>{live.courseName}</Text>
                        <View style={[styles.row, styles.ai_fs, styles.jc_sb, styles.mt_5]}>
                            <Text style={[styles.label_12, styles.label_dgray, styles.live_info]} numberOfLines={2}>{live.summary}</Text>
                            {!on && live.liveStatus == 0 ?
                            <TouchableOpacity style={[styles.bg_l1gray, styles.p_5, styles.pl_15, styles.pr_15, styles.circle_5]} onPress={() => this.onAction('Book', {index: index})}>
                                <Text style={[styles.label_12, styles.label_blue, live.book && styles.label_dgray]}>{live.book ? '取消预约' : '预约'}</Text>
                            </TouchableOpacity>
                            :
                            <View style={[styles.bg_l1gray, styles.p_5, styles.pl_15, styles.pr_15, styles.circle_5]}>
                                <Text style={[styles.label_12, styles.label_blue]}>进入</Text>
                            </View>
                            }
                        </View>
                    </TouchableOpacity>
                </View>
            )
        })
    }

    renderVod(channel, key) {
        const {navigation} = this.props;

        if (channel.courseList.length == 0) return null;

        return (
            <View style={[styles.bg_white, styles.circle_5, styles.p_15, styles.pt_0, styles.shadow, styles.mt_15]} key={'channel_' + key}>
                <NavCell label={channel.channelName} onPress={() => navigation.navigate('CourseChannel', {channel: channel, ctype: 0})}/>
                <View style={[styles.row, styles.wrap]}>
                    {channel.courseList.map((course, index) => {
                        return (
                            <VVodCell key={"vod_" + key + '_' + index} style={[styles.vod, (index + 1) % 2 == 1 && styles.mr_20]} course={course} onPress={() => navigation.navigate('Vod', {course: course})}/>
                        )
                    })}
                </View>
            </View>
        )
    }

    renderNews(channel, key) {
        const {navigation} = this.props;

        if (channel.length == 0) return null;

        const data = channel.slice(0, 3);

        return (
            <View style={[styles.bg_white, styles.circle_5, styles.p_15, styles.pt_0, styles.shadow, styles.mt_15]} key={'news_' + key}>
                <NavCell label={'资讯'} onPress={() => navigation.navigate('NewsChannel')}/>
                {data.map((news, index) => {
                    return (
                        <NewsCell key={'news_' + key + '_' + index} ttype={news.ttype} news={news} style={[styles.mb_15]} onPress={() => navigation.navigate('News', {news: news})}/>
                    )
                })}
            </View>
        )
    }

    renderTeacher(teachers, index) {
        const {navigation} = this.props;

        if (teachers.length == 0) return null;

        return (
            <View style={[styles.bg_white, styles.circle_5, styles.p_15, styles.pt_0, styles.shadow, styles.mt_15]} key={'channel_' + index}>
                <NavCell label={'名师专区'} onPress={() => navigation.navigate('TeacherChannel')}/>
                <View style={[styles.row, styles.jc_sb]}>
                    {teachers.map((teacher, index) => {
                        return (
                            <TouchableOpacity key={'teacher_' + index} style={[styles.ai_ct]} onPress={() => navigation.navigate('Teacher', {teacher: teacher})}>
                                <Image source={{uri: teacher.teacherImg}} style={[styles.teacher_thumb, styles.circle_5]}/>
                                <Text style={[styles.mt_15]}>{teacher.teacherName}</Text>
                                <View style={[styles.teacher_follow, styles.mt_5]}>
                                    <Text style={[styles.label_12, styles.label_gray]}>{teacher.follow}人关注</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>
        )
    }

    renderArticle(channel, key) {
        const {navigation} = this.props;

        if (channel.courseList.length == 0) return null;

        return (
            <View key={'channel_' + key}>
                <NavCell label={channel.channelName} onPress={()=> navigation.navigate('ArticleChannel', {channel: channel})}/>
                <View>
                    {channel.courseList.map((course, index) => {
                        return (
                            <ArticleCell ttype={course.ttype} key={'article_' + key + '_' + index} course={course}  onPress={() => navigation.navigate('Article', {course: course})}/>
                        )
                    })}
                </View>
            </View>
        )
    }

    renderAudio(channel, key) {
        const {navigation} = this.props;

        if (channel.courseList.length == 0) return null;

        return (
            <View style={[styles.bg_white, styles.circle_5, styles.p_15, styles.pt_0, styles.shadow, styles.mt_15]} key={'channel_' + key}>
                <NavCell label={channel.channelName} onPress={() => navigation.navigate('CourseChannel', {channel: channel, ctype: 1})}/>
                <View>
                    {channel.courseList.map((course, index) => {
                        return (
                            <VodCell key={'audio_' + key + '_' + index} course={course} onPress={() => navigation.navigate('Audio', {course: course})}/>
                        )
                    })}
                </View>
            </View>
        )
    }

    renderActivity(channel, key) {
        const {navigation} = this.props;

        if (channel.length == 0) return null;

        return (
            <View style={[styles.bg_white, styles.circle_5, styles.p_15, styles.pt_0, styles.shadow, styles.mt_15]} key={'channel_' + key}>
                <NavCell label={'活动'} onPress={() => {
                    navigation.navigate('Discovery');
                    DeviceEventEmitter.emit('discover', 0);
                }}/>
                <View>
                    {channel.map((activity, index) => {
                        return (
                            <ActivityCell key={'activity_' + key + '_' + index} activity={activity} onPress={()=>navigation.navigate('Activity', {activity: activity})}/>
                        )
                    })}
                </View>
            </View>
        )
    }

    renderSpecial(channel, key) {
        const {navigation} = this.props;

        if (channel.length == 0) return null;

        return (
            <View style={[styles.bg_white, styles.circle_5, styles.p_15, styles.pt_0, styles.shadow, styles.mt_15]} key={'channel_' + key}>
                <NavCell label={'专题'} onPress={() => {
                    navigation.navigate('Discovery');
                    DeviceEventEmitter.emit('discover', 1);
                }}/>
                <View>
                    {channel.map((special, index) => {
                        return (
                            <SpecialCell key={'special_' + key + '_' + index} special={special} onPress={() => navigation.navigate('Special', {special: special})}/>
                        )
                    })}
                </View>
            </View>
        )
    }

    renderRecomm() {
        const {navigation} = this.props;

        return (
            <View>
                <NavCell label={'猜你喜欢'} theme={'refresh'}/>
                <View>
                    {this.recomms.map((course, index) => {
                        return (
                            <VodCell key={"audio_" + index} course={course} onPress={() => navigation.navigate('Vod', {course: course})}/>
                        )
                    })}
                </View>
            </View>
        )
    }

    render() {
        const {navigation} = this.props;
        const {keyword, unread, isRefreshing, adIndex, agree, pop, popIndex} = this.state;
        
        return (
            <View style={styles.container}>
                <View style={[styles.search_container, styles.row, styles.jc_sb, styles.ai_ct, styles.p_20, styles.pb_10, styles.bg_white]}>
                    <TouchableOpacity style={[styles.p_10, styles.circle_10, styles.search]} onPress={() => navigation.navigate('Search')}>
                        <Text style={[styles.label_lgray]}><Text style={[styles.icon]}>{iconMap('search')}</Text> {keyword.length > 0 ? keyword : '输入资源、讲师关键词等'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.p_10]} onPress={() => this.onAction('Message')}>
                        <Text style={[styles.icon, styles.label_18]}>{iconMap('xiaoxi')}</Text>
                        {unread > 0 ?
                        <View style={[styles.unread, styles.ai_ct]}>
                            <Text style={[styles.label_10, styles.label_white]}>{unread > 99 ? '99+' : unread}</Text>
                        </View>
                        : null}
                    </TouchableOpacity>
                </View>
                <ScrollView 
                    contentContainerStyle={[styles.p_20]} 
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={this.onRefresh}
                            tintColor="#00A6F6"
                            title="松开刷新"
                            titleColor="#999999"
                        />
                    }
                >
                    <View style={[styles.ad_container]}>
                        <Carousel
                            autoplay={true}
                            loop={true}
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
                    <TouchableOpacity style={[styles.row, styles.ai_ct, styles.jc_sb, styles.p_15, styles.bg_white, styles.shadow, styles.mt_15, styles.circle_5]} onPress={() => {
                        navigation.navigate('LiveChannel')
                    }}>
                        <Image source={{uri: asset.home.live}} style={[styles.liveback]}/>
                        <Text style={[styles.label_gray]}>查看全部<Text style={[styles.icon, styles.label_gray]}>{iconMap('right')}</Text></Text>
                    </TouchableOpacity>

                    {this.renderLive()}

                    {this.index.map((channel, index) => {
                        if (channel.type == 'channel' && channel.data) {
                            if (channel.data.ctype == 0) {
                                return this.renderVod(channel.data, index);
                            } else if (channel.data.ctype == 1) {
                                return this.renderAudio(channel.data, index);
                            } else if (channel.data.ctype == 2) {
                                
                            } else if (channel.data.ctype == 3) {
                                return this.renderArticle(channel.data, index);
                            }
                        } else if (channel.type == 'activity') {
                            return this.renderActivity(channel.data, index);
                        } else if (channel.type == 'column') {
                            return this.renderSpecial(channel.data, index);
                        } else if (channel.type == 'article') {
                            return this.renderNews(channel.data, index);
                        } else if (channel.type == 'teacher') {
                            return this.renderTeacher(channel.data, index);
                        }
                    })}
                {this.renderRecomm()}

                </ScrollView>

                <Modal visible={agree && pop} transparent={true} onRequestClose={() => {
                    this.onExitPop();
                }}>
                    <TouchableOpacity style={[styles.modal]} onPress={this.onExitPop}/>
                    <View style={[styles.pop, styles.circle_5, styles.bg_white, styles.overflow_h]}>
                        <View style={[styles.pop_container]}>
                            <Carousel
                                autoplay={false}
                                loop={true}
                                ref={(c) => { this._carousel = c; }}
                                data={this.pop_ads}
                                renderItem={this._renderPopAd}
                                sliderWidth={theme.window.width - 100}
                                itemWidth={theme.window.width - 100}
                                onSnapToItem = {(index) => this.setState({popIndex: index})}
                            />
                            <Pagination
                                dotsLength={this.pop_ads.length}
                                activeDotIndex={popIndex}
                                containerStyle={styles.ad_page}
                                dotStyle={styles.ad_dot}
                            />
                        </View>
                        <TouchableOpacity style={[styles.p_15, styles.ai_ct, styles.t_line]} onPress={this.onExitPop}>
                            <Text>关闭</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                <Modal visible={!agree} transparent={true} onRequestClose={() => {
                    
                }}>
                    <View style={[styles.modal]}/>
                    <View style={[styles.agree, styles.circle_5, styles.bg_white, styles.overflow_h]}>
                        <View style={[styles.p_20]}>
                            <Text style={[styles.label_16, styles.label_center]}>个人信息保护指引</Text>
                            <Text style={[styles.mt_10]}>
                                请充分阅读并理解{'\n'}
                                <TouchableOpacity onPress={()=> {
                                    this.setState({
                                        agree: true,
                                    }, () => {
                                        navigation.navigate('AboutContent', {type: 6});
                                    })
                                }}><Text style={[styles.label_blue]}>《用户服务使用协议》</Text></TouchableOpacity>
                                <TouchableOpacity onPress={()=> {
                                     this.setState({
                                        agree: true,
                                    }, () => {
                                        navigation.navigate('AboutContent', {type: 1});
                                    })
                                }}><Text style={[styles.label_blue]}>《隐私政策》</Text></TouchableOpacity>
                            </Text>
                            <Text style={[styles.mt_5]}>点击按钮代表你已同意前述协议及以下约定。</Text>
                            <Text>1、为向你提供学习相关基本功能，我们会收集、使用必要的信息；</Text>
                            <Text>2、为保障你的账户与使用安全，你需要授权我们获取你的设备权限，你有权拒绝或取消授权，取消后将不影响你使用我们提供的其他服务；</Text>
                            <Text>3、为了正常识别手机设备，运营商网络，保证账户安全，我们需要获取手机/电话权限；</Text>
                            <Text>4、未经你同意，我们不会从第三方处获取、共享或向其提供你的信息；</Text>
                        </View>
                        <View style={[styles.row, styles.ai_ct, styles.t_line]}>
                            <TouchableOpacity style={[styles.f1, styles.p_15, styles.ai_ct]} onPress={() => BackHandler.exitApp()}>
                                <Text style={[styles.label_gray]}>暂不使用</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.f1, styles.p_15, styles.ai_ct, styles.t_line]} onPress={this.onAgree}>
                                <Text>同意</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <HudView ref={'hud'} />
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
    search_container: {
        height: Platform.OS === 'android' ? 60 : 85,
        paddingTop: Platform.OS === 'android' ? 10 : 40,
    },
    search: {
        width: (theme.window.width - 40) * 0.9,
        backgroundColor: '#F7F7F8',
        height: 40,
    },
    ad_container: {
        
    },
    ad: {
        width: theme.window.width - 40,
        height: (theme.window.width - 40) * 0.39,
    },
    ad_page: {
        position: "absolute",
        bottom: 5,
        left: 0,
        right: 0,
        paddingVertical: 5,
    },
    ad_dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.92)'
    },
    liveback: {
        width: 58,
        height: 14,
    },
    live_info: {
        width: theme.window.width * 0.55,
    },
    vod: {
        width: (theme.window.width - 90) / 2,
    },
    teacher_thumb: {
        width: (theme.window.width - 100) / 3,
        height: (theme.window.width - 100) * 1.2 / 3
    },
    teacher_follow: {
        padding: 2,
        paddingLeft: 5,
        paddingRight: 5,
        borderColor: '#F0F0F0',
        borderWidth: 1,
        borderRadius: 10,
    },
    unread: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 2,
        minWidth: 25,
        backgroundColor: 'red',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white',
    },
    pop: {
        position: 'absolute',
        top: 100,
        left: 50,
        right: 50,
    },
    pop_ad: {
        width: theme.window.width - 100,
        height: (theme.window.width - 100) * 0.39,
    },
    agree: {
        position: 'absolute',
        top: 100,
        left: 50,
        right: 50,
    }
});

export const LayoutComponent = Home;

export function mapStateToProps(state) {
    return {
        ad: state.config.ad,
        pop_ad: state.config.pop_ad,
        config: state.config.config,
        index: state.site.index,
        live: state.course.live,
        recomm: state.course.recomm,
        user: state.user.user,
        unread: state.user.unread,
    };
}