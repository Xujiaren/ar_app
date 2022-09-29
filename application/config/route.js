import React, { Component } from 'react';
import { Image, Platform } from 'react-native';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import connectComponent from '../util/connect';

import asset from '../config/asset';

import * as Web from '../page/base/Web';
import * as Comment from '../page/base/Comment';
import * as PublishComment from '../page/base/PublishComment';

import * as Home from '../page/home/Home';
import * as Search from '../page/home/Search';

import * as CourseCategory from '../page/course/CourseCategory';
import * as CourseChannel from '../page/course/CourseChannel';
import * as Article from '../page/course/Article';
import * as ArticleChannel from '../page/course/ArticleChannel';
import * as Audio from '../page/course/Audio';
import * as Vod from '../page/course/Vod';
import * as Related from '../page/course/related';
import * as Live from '../page/course/Live';
import * as LiveChannel from '../page/course/LiveChannel';
import * as CourseOrder from '../page/course/CourseOrder';

import Discovery from '../page/discovery/Discovery';
import * as Activity from '../page/discovery/activity/Activity';
import * as ActivityJoin from '../page/discovery/activity/ActivityJoin';
import * as ActivityWork from '../page/discovery/activity/ActivityWork';
import * as ActivityPaper from '../page/discovery/activity/ActivityPaper';
import * as Special from '../page/discovery/special/Special';
import * as Squad from '../page/discovery/squad/Squad';

import * as News from '../page/news/News';
import * as NewsChannel from '../page/news/NewsChannel';

import * as Study from '../page/study/Study';
import * as Rank from '../page/study/Rank';
import * as Map from '../page/study/map/Map';
import * as MapChannel from '../page/study/map/MapChannel';
import * as Plan from '../page/study/plan/Plan';
import * as PlanChannel from '../page/study/plan/PlanChannel';
import * as Paper from '../page/study/paper/Paper';
import * as PaperDone from '../page/study/paper/PaperDone';

import * as Group from '../page/group/Group';
import * as GroupChannel from '../page/group/GroupChannel';
import * as GroupMember from '../page/group/GroupMember';
import * as PublishGroup from '../page/group/PublishGroup';
import * as GroupOn from '../page/group/GroupOn';

import * as Ask from '../page/ask/Ask';
import * as AskChannel from '../page/ask/AskChannel';
import * as PublishAsk from '../page/ask/PublishAsk';
import * as ReplyAsk from '../page/ask/ReplyAsk';
import * as InviteAsk from '../page/ask/InviteAsk';

import * as Teacher from '../page/teacher/Teacher';
import * as TeacherChannel from '../page/teacher/TeacherChannel';

import * as User from '../page/user/User';
import * as UserIntegral from '../page/user/UserIntegral';
import * as Recharge from '../page/user/Recharge';
import * as UserCert from '../page/user/UserCert';
import * as UserCollect from '../page/user/UserCollect';
import * as UserCourse from '../page/user/UserCourse';
import * as UserFollow from '../page/user/UserFollow';
import * as UserMedal from '../page/user/medal/UserMedal';
import * as MedalInfo from '../page/user/medal/MedalInfo';
import * as UserQr from '../page/user/UserQr';
import * as UserStudy from '../page/user/UserStudy';
import * as UserTask from '../page/user/UserTask';
import * as UserSquad from '../page/user/UserSquad';
import * as Passport from '../page/user/Passport';
import * as Account from '../page/user/Account';
import * as UserGrow from '../page/user/grow/UserGrow';
import * as UserRight from '../page/user/grow/UserRight';
import * as UserTest from '../page/user/exam/UserTest';
import * as UserWrong from '../page/user/exam/UserWrong';
import * as UserAsk from '../page/user/UserAsk';
import * as Message from '../page/user/message/Message';
import * as MessageInfo from '../page/user/message/MessageInfo';
import * as ApplyTeacher from '../page/user/teacher/ApplyTeacher';
import * as ApplyCorpTeacher from '../page/user/teacher/ApplyCorpTeacher';
import TeacherRule from '../page/user/teacher/TeacherRule';
import * as TeacherMedal from '../page/user/teacher/TeacherMedal';

import * as UserAddress from '../page/user/address/UserAddress';
import * as SaveAddress from '../page/user/address/SaveAddress';

import * as Lucky from '../page/user/lucky/Lucky';
import * as LuckyRecord from '../page/user/lucky/LuckyRecord';
import * as FeedBack from '../page/user/FeedBack';
import About from '../page/user/about/About';
import * as AboutContent from '../page/user/about/AboutContent';

const TabNav = createBottomTabNavigator({
    Home: {
        screen: connectComponent(Home),
        navigationOptions: {
            title: '首页',
            tabBarIcon: ({focused}) => {
                return <Image source={focused ? asset.home.tab_on : asset.home.tab} style={{width: 20, height: 20}}/>;
            },
        },
    },
    CourseCategory: {
        screen: connectComponent(CourseCategory),
        navigationOptions: {
            title: '资源',
            tabBarIcon: ({focused}) => {
                return <Image source={focused ? asset.course.tab_on : asset.course.tab} style={{width: 20, height: 20}}/>;
            },
        },
    },
    Discovery: {
        screen: Discovery,
        navigationOptions: {
            title: '发现',
            tabBarIcon: ({focused}) => {
                return <Image source={focused ? asset.discovery.tab_on : asset.discovery.tab} style={{width: 20, height: 20}}/>;
            },
        },
    },
    Study: {
        screen: connectComponent(Study),
        navigationOptions: {
            title: '学习',
            tabBarIcon: ({focused}) => {
                return <Image source={focused ? asset.study.tab_on : asset.study.tab} style={{width: 20, height: 20}}/>;
            },
        },
    },
    User: {
        screen: connectComponent(User),
        navigationOptions:({navigation,screenProps}) =>({
            title: '我的',
            tabBarIcon: ({focused}) => {
                return <Image source={focused ? asset.user.tab_on : asset.user.tab} style={{width: 20, height: 20}}/>;
            },
        }),
    }
}, {
    initialRouteName: 'Home',
    swipeEnabled: false,
    lazy: false,
    tabBarPosition: 'bottom',
    tabBarOptions: {
        activeTintColor: '#00A6F6',
        inactiveTintColor: '#999999',
        tabStyle: {
            padding: 5,
        },
    },
});

TabNav.navigationOptions = ({navigation}) => {

    const {key} = navigation.state.routes[navigation.state.index];
    let show = false;
    let title = '';
    let options = {};

    if (key == 'CourseCategory') {
        show = true;
        title = '资源';
    } else if (key == 'Discovery') {
        show = true;
        title = '发现';
    }

    return {
        title: title,
        headerShown: show,
        ...options,
    }

};

const MainNav = createStackNavigator({
    TabNav: {screen: TabNav},

    Web: {screen: connectComponent(Web)},
    Comment: {screen: connectComponent(Comment)},
    PublishComment: {screen: connectComponent(PublishComment)},

    Search: {screen: connectComponent(Search)},

    CourseChannel: {screen: connectComponent(CourseChannel)},
    ArticleChannel: {screen: connectComponent(ArticleChannel)},
    LiveChannel:  {screen: connectComponent(LiveChannel)},

    Vod: {screen: connectComponent(Vod)},
    Related: {screen: connectComponent(Related)},
    Audio: {screen: connectComponent(Audio)},
    Live: {screen: connectComponent(Live)},
    Article: {screen: connectComponent(Article)},

    CourseOrder:  {screen: connectComponent(CourseOrder)},

    NewsChannel: {screen: connectComponent(NewsChannel)},
    News: {screen: connectComponent(News)},

    Activity:  {screen: connectComponent(Activity)},
    ActivityJoin: {screen: connectComponent(ActivityJoin)},
    ActivityWork: {screen: connectComponent(ActivityWork)},
    ActivityPaper: {screen: connectComponent(ActivityPaper)},
    Special: {screen: connectComponent(Special)},
    Squad: {screen: connectComponent(Squad)},

    Rank: {screen: connectComponent(Rank)},
    MapChannel: {screen: connectComponent(MapChannel)},
    Map:  {screen: connectComponent(Map)},
    Plan: {screen: connectComponent(Plan)},
    PlanChannel: {screen: connectComponent(PlanChannel)},
    Paper: {screen: connectComponent(Paper)},
    PaperDone: {screen: connectComponent(PaperDone)},

    TeacherChannel: {screen: connectComponent(TeacherChannel)},
    Teacher:  {screen: connectComponent(Teacher)},

    Account: {screen: connectComponent(Account)},
    UserGrow: {screen: connectComponent(UserGrow)},
    UserRight: {screen: connectComponent(UserRight)},
    UserCollect: {screen: connectComponent(UserCollect)},
    UserCourse: {screen: connectComponent(UserCourse)},
    UserFollow: {screen: connectComponent(UserFollow)},
    UserIntegral: {screen: connectComponent(UserIntegral)},
    Recharge: {screen: connectComponent(Recharge)},
    UserCert: {screen: connectComponent(UserCert)},
    UserMedal: {screen: connectComponent(UserMedal)},
    MedalInfo: {screen: connectComponent(MedalInfo)},
    UserQr:  {screen: connectComponent(UserQr)},
    UserStudy: {screen: connectComponent(UserStudy)},
    UserTask: {screen: connectComponent(UserTask)},
    UserSquad: {screen: connectComponent(UserSquad)},
    UserTest: {screen: connectComponent(UserTest)},
    UserWrong: {screen: connectComponent(UserWrong)},
    UserAsk:  {screen: connectComponent(UserAsk)},

    Group: {screen: connectComponent(Group)},
    GroupChannel: {screen: connectComponent(GroupChannel)},
    GroupMember: {screen: connectComponent(GroupMember)},
    PublishGroup: {screen: connectComponent(PublishGroup)},
    GroupOn: {screen: connectComponent(GroupOn)},

    Ask: {screen: connectComponent(Ask)},
    AskChannel: {screen: connectComponent(AskChannel)},
    InviteAsk: {screen: connectComponent(InviteAsk)},
    PublishAsk: {screen: connectComponent(PublishAsk)},
    ReplyAsk: {screen: connectComponent(ReplyAsk)},

    Message: {screen: connectComponent(Message)},
    MessageInfo: {screen: connectComponent(MessageInfo)},

    ApplyTeacher: {screen: connectComponent(ApplyTeacher)},
    ApplyCorpTeacher: {screen: connectComponent(ApplyCorpTeacher)},
    TeacherMedal: {screen: connectComponent(TeacherMedal)},
    TeacherRule: {screen: TeacherRule},

    UserAddress: {screen: connectComponent(UserAddress)},
    SaveAddress: {screen: connectComponent(SaveAddress)},

    Lucky: {screen: connectComponent(Lucky)},
    LuckyRecord: {screen: connectComponent(LuckyRecord)},
    FeedBack: {screen: connectComponent(FeedBack)},

    Passport: {screen: connectComponent(Passport)},

    About: {screen: About},
    AboutContent:  {screen: connectComponent(AboutContent)},
}, {
    defaultNavigationOptions: {
        headerTintColor: '#000000',
        headerBackTitleVisible: false,
        headerStyle: {
            backgroundColor: '#ffffff',
            borderBottomWidth: 0,
            elevation:0,
            shadowOpacity: 0,
        },
        headerTitleStyle: {
            textAlign: 'center',
        }
    },
})

export const AppNav = createAppContainer(MainNav);