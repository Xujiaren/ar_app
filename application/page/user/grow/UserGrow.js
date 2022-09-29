//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, ScrollView, Image, ImageBackground, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ProgressBar from 'react-native-progress/Bar';

import asset from '../../../config/asset';
import theme from '../../../config/theme';

// create a component
class UserGrow extends Component {

    static navigationOptions = {
        title:'成长权益',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        this.equity = [];
        this.lmap = {};
        this.level = [];
        this.items = [];

        this.state = {
            loaded: false,
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.onTask = this.onTask.bind(this);
    }

    componentDidMount() {
        this.onRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {user, level, task} = nextProps;

        if (user !== this.props.user) {
            this.equity = user.equityList;
        }

        if (level !== this.props.level) {
            this.level = level;

            this.level.map((level, index) => {
                this.lmap[level.levelId] = level;
            })

            this.setState({
                loaded: true,
            })
        }

        if (task !== this.props.task) {
            this.items = task;
        }
    }

    onRefresh() {
        const {actions} = this.props;
        actions.user.user();
        actions.user.level();
        actions.user.task();
    }

    onTask(link) {
        const {navigation} = this.props;

        let page = 'Home';
        if (link.indexOf('/user/userInfo') !== -1){
            page = 'Account';
        } else if (link.indexOf('/index/search') !== -1){
            page = 'Search';
        }

        navigation.navigate(page);
    }

    render() {
        const {user, navigation} = this.props;
        const {loaded} = this.state;


        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#00A6F6"/>
            </View>
        )

        let progress = 1;

        if (this.lmap[user.level]) {
            const level = this.lmap[user.level];
            const un = parseInt(user.prestige) - parseInt(level.beginPrestige);
            const tn = parseInt(level.endPrestige) - parseInt(level.beginPrestige);

            progress = parseFloat(un / tn);
            console.info(progress);
        }

        return (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <LinearGradient colors={["#23232A", "#44444F"]} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={[styles.header, styles.p_20, styles.pl_50, styles.pr_50]}>
                        <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
                            <View style={[styles.ai_ct]}>
                                <Text style={[styles.label_26, styles.label_gold]}>{user.integral}</Text>
                                <Text style={[styles.label_16, styles.label_white]}>积分</Text>
                            </View>
                            <Image source={{uri: user.avatar}} style={[styles.avatar, styles.bg_l1gray]}/>
                            <View style={[styles.ai_ct]}>
                                <Text style={[styles.label_26, styles.label_gold]}>{user.prestige}</Text>
                                <Text style={[styles.label_16, styles.label_white]}>成长值</Text>
                            </View>
                        </View>
                        <View style={[styles.mt_15, styles.pt_10]}>
                            <LinearGradient style={[styles.line, styles.shadow]} colors={["#585858", "#212128"]}/>
                            <View style={[styles.grow, styles.row]}>
                            {this.level.map((item, index) => {
                                const on = user.level >= item.levelId;

                                return (
                                    <View key={'level_' + index} style={[styles.f1]}>
                                        <View style={[styles.dot, on && styles.dot_on, styles.shadow]}/>
                                        <Text style={[styles.label_gray, on && styles.label_gold, styles.mt_10, styles.label_10]}>Lv.{index + 1}</Text>
                                    </View>
                                )
                            })}
                            </View>
                        </View>
                        <ImageBackground source={asset.user.level['i' + user.level]} style={[styles.level, styles.mt_15, styles.jc_fe, styles.pb_10]}>
                            <View>
                                <Text style={[styles.label_16]}>Lv.{user.level}</Text>
                                <Text style={[styles.label_12]}>当前成长值{user.prestige}点</Text>
                                <ProgressBar
                                    style={styles.mt_5}
                                    progress={progress}
                                    borderWidth={0}
                                    width={theme.window.width * 0.4}
                                    color={'#333333'}
                                    unfilledColor={'#FAFAFA'}
                                />
                                <View style={[styles.progress, styles.row, styles.ai_fs, styles.jc_sb, styles.mt_5]}>
                                    <Text style={[styles.label_12]}>Lv.{user.level}</Text>
                                    <Text style={[styles.label_12]}>Lv.{this.lmap[user.level + 1] ? user.level + 1 : user.level}</Text>
                                </View>
                            </View>
                        </ImageBackground>
                    </LinearGradient>

                    <Text></Text>

                    <View style={[styles.m_20, styles.right, styles.bg_white, styles.circle_5, styles.shadow]}>
                        <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.p_15, styles.pl_20, styles.pr_20]}>
                            <Text style={[styles.label_16]}>Lv.{user.level}特权</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('UserRight', {equity: this.equity})}>
                                <Text style={[styles.label_gray]}>权益详情</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.row, styles.ai_ct, styles.p_15]}>
                            {this.equity.map((eitem, index) => {
                                return (
                                    <View style={[styles.ai_ct, styles.f1]} key={'equity_' + index}>
                                        <Image source={{uri: eitem.equityImg}} style={styles.equityIcon}/>
                                        <Text style={[styles.mt_10]}>{eitem.equityName}</Text>
                                    </View>
                                )
                            })}
                        </View>
                    </View>

                    <View style={[styles.ml_20, styles.mr_20, styles.mb_15, styles.bg_white, styles.circle_5, styles.shadow]}>
                        <View style={[styles.p_20, styles.pb_10]}>
                            <Text style={[styles.label_16]}>会员任务</Text>
                        </View>
                        {this.items.map((item, index) => {
                            const done = item.status == 1;
                            return (
                                <View style={[styles.p_20, styles.row, styles.ai_ct, styles.jc_sb]} key={'task_' + index}>
                                    <View style={[styles.task_info]}>
                                        <View style={[styles.row, styles.ai_ct]}>
                                            <Text>{item.taskName}</Text>
                                            <View style={[styles.circle_20, styles.task, styles.ml_10]}>
                                                <Text style={[styles.label_12, styles.label_gold]}>成长值</Text>
                                            </View>
                                            <Text style={[styles.label_gold, styles.ml_10]}>+{item.integral}</Text>
                                        </View>
                                        <Text style={[styles.label_12, styles.label_gray, styles.mt_5]}>{item.taskSummary}</Text>
                                    </View>
                                    <TouchableOpacity style={[styles.bg_blue, styles.ai_ct, done && styles.bg_gray, styles.circle_20, styles.p_5, styles.pl_15, styles.pr_15]} disabled={done} onPress={() => this.onTask(item.link)}>
                                            <Text style={[styles.label_white, styles.label_12]}>{done ? '已完成' : '去完成'}</Text>
                                        </TouchableOpacity>
                                </View>
                            )
                        })}
                    </View>
                </ScrollView>
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
    header: {
        width: theme.window.width,
        height: theme.window.width * 0.825,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: 'white'
    },
    line: {
        height: 3,
    },
    grow: {
        marginTop: -6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#535353'
    },
    dot_on: {
        backgroundColor: '#DBB177'
    },
    level: {
        width: theme.window.width - 100,
        height: (theme.window.width - 100) * 0.395,
        paddingLeft: 22,
    },
    progress: {
        width: theme.window.width * 0.4,
    },
    right: {
        marginTop: -50,
    },
    equityIcon: {
        width: 36,
        height: 36,
    },
    task: {
        padding: 2,
        paddingLeft: 5,
        paddingRight: 5,
        borderWidth: 1,
        borderColor: '#DBB177'
    },
    task_info: {
        width: theme.window.width * 0.55,
    }
});

export const LayoutComponent = UserGrow;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        level: state.user.level,
        task: state.user.task,
    };
}