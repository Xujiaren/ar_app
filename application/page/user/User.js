//import liraries
import React, { Component } from 'react';
import { ScrollView, View, ImageBackground, Text, Image, StyleSheet, Platform, TouchableOpacity, Alert } from 'react-native';

import MenuCell from '../../component/base/MenuCell';

import theme from '../../config/theme';
import iconMap from '../../config/font';
import asset from '../../config/asset';

// create a component
class User extends Component {

    constructor(props) {
        super(props);

        this.state = {
            unread: 0,
            teacher: false,
            utype: 0,
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.onAction = this.onAction.bind(this);
        this.onLogout = this.onLogout.bind(this);
    }

    componentDidMount() {
        const {navigation} = this.props;
        this.focuSub = navigation.addListener('didFocus', (route) => {

            this.setState({
                utype: global.utype,
            })

            this.onRefresh();
        })
    }

    componentWillUnmount(){
        this.focuSub && this.focuSub.remove();
    }

    componentWillReceiveProps(nextProps) {
        const {user, unread} = nextProps;

        if (user !== this.props.user) {
            global.uid = user.userId;
            this.setState({
                teacher: user.teacher,
            })
        }

        if (unread !== this.props.unread) {
            this.setState({
                unread: unread.message + unread.remind,
            })
        }
    }

    onRefresh() {
        const {actions} = this.props;
        actions.user.user();
        actions.user.unread();
    }

    onAction(type, args) {
        const {navigation, user} = this.props;

        if (!user.userId) {
            navigation.navigate('Passport');
        } else if (type == 'Account') {
            navigation.navigate('Account');
        } else if (type == 'Message') {
            navigation.navigate('Message');
        } else if (type == 'Collect') {
            navigation.navigate('UserCollect');
        } else if (type == 'Follow') {
            navigation.navigate('UserFollow');
        } else if (type == 'Integral') {
            navigation.navigate('UserIntegral');
        } else if (type == 'Order') {
            navigation.navigate('UserCourse');
        } else if (type == 'Cert') {
            navigation.navigate('UserCert');
        } else if (type == 'Test') {
            navigation.navigate('UserTest');
        } else if (type == 'Medal') {
            navigation.navigate('UserMedal');
        } else if (type == 'Group') {
            navigation.navigate('GroupChannel');
        } else if (type == 'Lucky') {
            navigation.navigate('Lucky');
        } else if (type == 'Ask') {
            navigation.navigate('AskChannel');
        } else if (type == 'Grow') {
            navigation.navigate('UserGrow');
        } else if (type == 'TeacherMedal') {
            navigation.navigate('TeacherMedal', args);
        } else if (type == 'Qrcode') {
            navigation.navigate('UserQr', args);
        } else if (type == 'Task') {
            navigation.navigate('UserTask');
        } else if (type == 'ApplyTeacher') {
            navigation.navigate(global.utype == 0 ? 'ApplyTeacher' : 'ApplyCorpTeacher');
        } else if (type == 'Squad') {
            navigation.navigate('UserSquad');
        } else if (type == 'FeedBack') {
            navigation.navigate('FeedBack');
        } else if (type == 'About') {
            navigation.navigate('About');
        }  else if (type == 'Address') {
            navigation.navigate('UserAddress');
        }
    }

    onLogout() {
        const {actions} = this.props;

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
                onPress: () =>  {
                    actions.passport.logout({
                        resolved: (data) => {
                            actions.user.user();
                        },
                        rejected: (msg) => {
            
                        }
                    });
                },
            }
        ])
        
    }

    render() {
        const {user} = this.props;
        const {teacher, unread, utype} = this.state;

        let avatar = asset.user.avatar;
        if (user.userId && user.avatar != '') {
            avatar = {uri: user.avatar};
        }

        return (
            <View style={[styles.container, styles.bg_lgray]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <ImageBackground source={asset.user.bg} style={[styles.head_bg, styles.p_20, styles.pl_30]}>
                        <View style={[styles.row, styles.jc_fe, styles.tool]}>
                            <TouchableOpacity onPress={() => this.onAction('Message')} style={[styles.p_5]}>
                                <Text style={[styles.icon, styles.label_18, styles.label_white]}>{iconMap('xiaoxi')}</Text>
                                {unread > 0 ?
                                <View style={[styles.unread]}/>
                                : null}
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.ml_15, styles.pt_5]} onPress={() => this.onAction('Qrcode', {type: 1})}>
                                <Text style={[styles.icon, styles.label_18, styles.label_white]}>{iconMap('scan')}</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={[styles.row, styles.ai_ct]} onPress={() => this.onAction('Account')}>
                            <Image source={avatar} style={[styles.avatar, styles.bg_lgray]}/>
                            {user.userId ?
                            <Text style={[styles.label_white, styles.ml_15]}>{user.nickname} <Text style={[styles.icon, styles.label_white, styles.ml_5]}>{iconMap('account')}</Text></Text>
                            :
                            <Text style={[styles.label_white, styles.ml_15]}>点击登录</Text>}
                        </TouchableOpacity>
                        <View style={[styles.row, styles.jc_sb, styles.p_15]}>
                            <TouchableOpacity style={[styles.ai_ct, styles.p_10]} onPress={() => this.onAction('Collect')}>
                                <Text style={[styles.label_white, styles.label_20]}>{user.collectNum | 0}</Text>
                                <Text style={[styles.label_white, styles.mt_5]}>收藏</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[ styles.ai_ct, styles.p_10]} onPress={() => this.onAction('Follow')}>
                                <Text style={[styles.label_white, styles.label_20]}>{user.follow|0}</Text>
                                <Text style={[styles.label_white, styles.mt_5]}>关注</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.ai_ct, styles.p_10]} onPress={() => this.onAction('Integral')}>
                                <Text style={[styles.label_white, styles.label_20]}>{user.integral | 0}</Text>
                                <Text style={[styles.label_white, styles.mt_5]}>积分</Text>
                            </TouchableOpacity>
                            {utype == 1 ?
                            <TouchableOpacity style={[styles.ai_ct, styles.p_10]} onPress={() => this.onAction('Integral')}>
                                <Text style={[styles.label_white, styles.label_20]}>{user.credit | 0}</Text>
                                <Text style={[styles.label_white, styles.mt_5]}>学分</Text>
                            </TouchableOpacity>
                            : null}
                            <TouchableOpacity style={[styles.ai_ct, styles.p_10]} onPress={() => this.onAction('Order')}>
                                <Text style={[styles.label_white, styles.label_20]}>{user.courseNum | 0}</Text>
                                <Text style={[styles.label_white, styles.mt_5]}>已购</Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                    {utype == 0 ?
                    <View style={[styles.bg_white, styles.p_25, styles.row, styles.wrap]}>
                        <TouchableOpacity style={[styles.ai_ct, styles.nav_item, styles.mb_20]} onPress={() => this.onAction('Integral')}>
                            <Image source={asset.user.nav.account} style={styles.nav_icon}/>
                            <Text style={[styles.mt_5]}>我的账户</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.ai_ct, styles.nav_item, styles.mb_20]} onPress={() => this.onAction('Test')}>
                            <Image source={asset.user.nav.test} style={styles.nav_icon}/>
                            <Text style={[styles.mt_5]}>我的考试</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={[styles.ai_ct, styles.nav_item, styles.mb_20]} onPress={() => this.onAction('Cert')}>
                            <Image source={asset.user.nav.cert} style={styles.nav_icon}/>
                            <Text style={[styles.mt_5]}>我的证书</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.ai_ct, styles.nav_item, styles.mb_20]} onPress={() => this.onAction('Medal')}>
                            <Image source={asset.user.nav.medal} style={styles.nav_icon}/>
                            <Text style={[styles.mt_5]}>我的勋章</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.ai_ct, styles.nav_item]} onPress={() => this.onAction('Group')}>
                            <Image source={asset.user.nav.group} style={styles.nav_icon}/>
                            <Text style={[styles.mt_5]}>打卡社区</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.ai_ct, styles.nav_item]} onPress={() => this.onAction('Lucky')}>
                            <Image source={asset.user.nav.lucky} style={styles.nav_icon}/>
                            <Text style={[styles.mt_5]}>翻牌抽奖</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.ai_ct, styles.nav_item]} onPress={() => this.onAction('FeedBack')}>
                            <Image source={asset.user.nav.teacher_medal} style={styles.nav_icon}/>
                            <Text style={[styles.mt_5]}>帮助反馈</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.ai_ct, styles.nav_item]} onPress={() => this.onAction('Grow')}>
                            <Image source={asset.user.nav.grow} style={styles.nav_icon}/>
                            <Text style={[styles.mt_5]}>成长权益</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={[styles.bg_white, styles.p_25, styles.row, styles.wrap]}>
                        <TouchableOpacity style={[styles.ai_ct, styles.nav_item]} onPress={() => this.onAction('Integral')}>
                            <Image source={asset.user.nav.account} style={styles.nav_icon}/>
                            <Text style={[styles.mt_5]}>我的账户</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.ai_ct, styles.nav_item]} onPress={() => this.onAction('Test')}>
                            <Image source={asset.user.nav.test} style={styles.nav_icon}/>
                            <Text style={[styles.mt_5]}>我的考试</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.ai_ct, styles.nav_item]} onPress={() => this.onAction('Lucky')}>
                            <Image source={asset.user.nav.lucky} style={styles.nav_icon}/>
                            <Text style={[styles.mt_5]}>翻牌抽奖</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.ai_ct, styles.nav_item]} onPress={() => this.onAction('Ask')}>
                            <Image source={asset.user.nav.teacher_medal} style={styles.nav_icon}/>
                            <Text style={[styles.mt_5]}>问答区</Text>
                        </TouchableOpacity>
                    </View>
                    }
                    <View style={styles.mt_20}>
                        <MenuCell label={'我的任务'} onPress={() => this.onAction('Task')}/>
                        {utype == 1 ?
                        (!teacher ?
                        <MenuCell label={'申请讲师'} onPress={() => this.onAction('ApplyCorpTeacher')}/>
                        : <MenuCell label={'讲师勋章'} onPress={() => this.onAction('TeacherMedal',{type:0})}/>) : null}
                        {utype == 0 ?
                        (!teacher ?
                        <MenuCell label={'申请讲师'} onPress={() => this.onAction('ApplyTeacher')}/>
                        : <MenuCell label={'讲师勋章'} onPress={() => this.onAction('TeacherMedal',{type:1})}/>) : null}
                        <MenuCell label={'培训班'} onPress={() => this.onAction('Squad')}/>
                        <MenuCell label={'二维码'} onPress={() => this.onAction('Qrcode', {type: 0})}/>
                        <MenuCell label={'帮助反馈'} onPress={() => this.onAction('FeedBack')}/>
                        <MenuCell label={'关于我们'} onPress={() => this.onAction('About')}/>
                        <MenuCell label={'地址管理'} onPress={() => this.onAction('Address')}/>
                    </View>

                    {user.userId ?
                    <TouchableOpacity style={[styles.bg_white, styles.p_15, styles.mt_10, styles.ai_ct]} onPress={this.onLogout}>
                        <Text style={[styles.label_blue]}>退出登录</Text>
                    </TouchableOpacity> 
                    : null}
                </ScrollView>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    head_bg: {
        width: theme.window.width,
        height: theme.window.width * 0.56,
    },
    tool: {
        marginTop: Platform.OS == 'android' ? 0 : 15,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    nav_item: {
        width: (theme.window.width - 50) / 4,
    },
    nav_icon: {
        width: 40,
        height: 40,
    },
    unread: {
        position: 'absolute',
        top: 4,
        right: 3,
        width: 8,
        height: 8,
        backgroundColor: 'red',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'white',
    }
});

export const LayoutComponent = User;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        unread: state.user.unread,
    };
}