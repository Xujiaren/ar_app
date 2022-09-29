//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import { parse } from 'react-native-svg';

import NavCell from '../../component/base/NavCell';
import StudyCell from '../../component/user/StudyCell';

import asset from '../../config/asset';
import theme from '../../config/theme';

// create a component
class Study extends Component {

    constructor(props) {
        super(props);

        this.items = [];

        this.days = [];
        this.durations = [];

        this.state = {
            rank: 0,
            learn: 0,
            today: 0,
            total: 0,
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.onAction = this.onAction.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    componentDidMount() {
        const {navigation} = this.props;

        this.focuSub = navigation.addListener('didFocus', (route) => {
            this.onRefresh();
        })
    }

    componentWillReceiveProps(nextProps) {
        const {study, stat} = nextProps;

        if (study !== this.props.study && study.items) {
            this.items = study.items;
        }

        if (stat !== this.props.stat && stat.total) {
            console.info(stat);
            stat.learnList.map((stat, index) => {
                const ditem = stat.day.split('-');
                this.days.push(ditem[1] + '.' + ditem[2]);
                this.durations.push(parseInt(stat.duration / 60));
            })

            this.setState({
                rank: stat.rank,
                learn: stat.learn,
                total: stat.total,
                today: stat.today,
            })
        } 
    }

    componentWillUnmount(){
        this.focuSub && this.focuSub.remove();
    }

    onRefresh() {
        const {actions} = this.props;

        this.items = [];
        this.days = [];
        this.durations = [];

        actions.user.user();
        actions.user.study(0, 0);
        actions.user.stat();
    }

    onAction(action, args) {
        const {navigation, user} = this.props;

        if (!user.userId) {
            navigation.navigate('Passport');
        } else {
            navigation.navigate(action);
        }

    }

    renderHeader() {
        const {rank, total, today, learn} = this.state;

        return (
            <View>
                <View style={styles.stat}>
                    <Text style={[styles.label_white, styles.label_center, styles.label_18]}>学习</Text>
                    <View style={[styles.row, styles.jc_ad, styles.ai_ct, styles.mt_25]}>
                        <View style={[styles.ai_ct]}>
                            <Text style={[styles.label_white]}>学习记录</Text>
                            <View style={[styles.dot, styles.mt_5, styles.bg_white]}/>
                        </View>
                        <TouchableOpacity style={[styles.ai_ct]} onPress={() => this.onAction('MapChannel')}>
                            <Text style={[styles.label_white]}>学习地图</Text>
                            <View style={[styles.dot, styles.mt_5]}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.ai_ct]} onPress={() => this.onAction('PlanChannel')}>
                            <Text style={[styles.label_white]}>学习计划</Text>
                            <View style={[styles.dot, styles.mt_5]}/>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.p_15, styles.circle_5, styles.bg_white, styles.mt_10]}>
                        <View style={[styles.row]}>
                            <View style={[styles.ai_ct, styles.f1]}>
                                <Text style={styles.label_12}>今日学习</Text>
                                <Text style={[styles.label_26, styles.mt_5]}>{parseFloat(today/3600).toFixed(2)} <Text style={[styles.label_12, styles.label_gray]}>小时</Text></Text>
                            </View>
                            <View style={[styles.ai_ct, styles.f1]}>
                                <Text style={styles.label_12}>累计学习</Text>
                                <Text style={[styles.label_26, styles.mt_5]}>{parseFloat(total/3600).toFixed(2)} <Text style={[styles.label_12, styles.label_gray]}>小时</Text></Text>
                            </View>
                            <View style={[styles.ai_ct, styles.f1]}>
                                <Text style={styles.label_12}>连续学习</Text>
                                <Text style={[styles.label_26, styles.mt_5]}>{learn} <Text style={[styles.label_12, styles.label_gray]}>天</Text></Text>
                            </View>
                        </View>
                        <TouchableOpacity style={[styles.row, styles.jc_sb, styles.mt_25]} onPress={() => this.onAction('Rank')}>
                            <Text style={[styles.label_12, styles.label_gray]}>行动力超过了<Text style={styles.label_default}>{rank}%</Text>的用户</Text>
                            <Text style={[styles.label_12, styles.label_blue]}>学习排行榜</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {this.days.length > 0 ?
                <View>
                    <View style={[styles.p_20]}>
                        <Text style={[styles.label_20, styles.label_blue]}>本周学习</Text>
                    </View>
                    
                    <LineChart
                        data={{
                            labels: this.days,
                            datasets: [{    
                                data: this.durations,
                            }],
                        }}
                        width={theme.window.width - 40}
                        height={220}
                        yAxisLabel={''}
                        axisY ={{min:true}}
                        chartConfig={{
                            backgroundColor: '#e26a00',
                            backgroundGradientFrom: '#ffffff',
                            backgroundGradientTo: '#ffffff',
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 166, 246, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(51,51,51, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: '2',
                                strokeWidth: '1',
                                stroke: '#00A6F6',
                            },
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                    />
                </View>
                : null}
                <NavCell label={'在学资源'} style={[styles.mt_15, styles.pr_20, styles.pl_20]} onPress={() => this.onAction('UserStudy')}/>
                <View style={[styles.header_bg, styles.bg_blue]}/>
            </View>
        )
    }

    renderItem(item) {
        const {navigation} = this.props;
        const course = item.item;

        let page = 'Vod';

        if (course.ctype == 1) {
            page = 'Audio';
        } else if (course.ctype == 3) {
            page = 'Article';
        }

        return (
            <StudyCell course={course} onPress={() => navigation.navigate(page, {course: course})}/>
        )
    }
    
    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.items}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => {return 'item_' + index}}
                    ListHeaderComponent={this.renderHeader}
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
    header_bg: {
        width: theme.window.width,
        height: theme.window.width * 0.46,
        position: 'absolute',
        zIndex: -100,
        top: 0,
        left: 0,
        right: 0,
    },
    stat: {
        marginTop: 55,
        marginLeft: 20,
        marginRight: 20,
        shadowOffset:{  width: 0,  height:0},
        shadowColor: 'rgba(0,0,0, 1)',
        shadowOpacity: 0.1,
        elevation: 1,
    },
    dot: {
        width: 10,
        height: 4,
    }
});

export const LayoutComponent = Study;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        study: state.user.study,
        stat: state.user.stat,
    };
}