//import liraries
import React, { Component } from 'react';
import { View, TouchableOpacity, ScrollView, Text, StyleSheet } from 'react-native';

import HudView from '../../component/base/HudView';
import VodCell from '../../component/course/VodCell';
import theme from '../../config/theme';

// create a component
class CourseOrder extends Component {

    static navigationOptions = {
        title:'资源结算',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        const {navigation} = props;
        this.course = navigation.getParam('course', {});

        this.onBuy = this.onBuy.bind(this);
    }

    componentDidMount() {
        const {actions} = this.props;
        actions.user.user();
    }

    onBuy() {
        const {navigation, user, actions} = this.props;

        if (user.integral >= this.course.integral) {
            actions.order.buy({
                from_uid: 0,
                pay_type: 3,
                course_id: this.course.courseId,
                chapter_id: 0,

                resolved: (data) => {
                    this.refs.hud.show('购买成功。', 1, () => {
                        actions.user.user();
                        actions.course.info(this.course.courseId);
                        navigation.goBack();
                    });
                },
                rejected: (msg) => {
                    this.refs.hud.show('购买失败，请重试。', 1);
                }
            })
        } else {
            navigation.navigate('Recharge');
        }
    }

    render() {
        const {user} = this.props;    
        const enable = user.integral >= this.course.integral;

        return (
            <View style={styles.container}>
                <ScrollView>
                    <VodCell style={[styles.p_20, styles.bg_white]} course={this.course}/>
                    <TouchableOpacity style={[styles.p_15, styles.pl_20, styles.pr_20, styles.row, styles.ai_ct, styles.jc_sb, styles.bg_white]}>
                        <Text>可用积分 {user.integral}</Text>
                    </TouchableOpacity>
                    <View style={[styles.row, styles.ai_fs, styles.mt_10]}>
                        <View style={[styles.f1]}>

                        </View>
                        <View style={[styles.f10]}>
                            <Text style={[styles.label_gray]}>您将购买的商品为虚拟内容服务，不支持退订、转让以及退换，请慎重确认。</Text>
                        </View>
                    </View>
                </ScrollView>
                <View style={[styles.toolbar, styles.bg_white, styles.row]}>
                    <View style={[styles.p_15, styles.pl_20, styles.f1]}>
                        <Text>应付：{this.course.integral}</Text>
                    </View>
                    <TouchableOpacity style={[styles.f1, styles.bg_blue, styles.circle_5, styles.ai_ct, styles.jc_ct, styles.m_5]} onPress={this.onBuy}>
                        <Text style={[styles.label_white]}>{enable ? '立即支付' : '立即充值'}</Text>
                    </TouchableOpacity>
                </View>
                <HudView ref={'hud'}/>
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
    toolbar: {
        height: 50,
        borderTopWidth: 1,
        borderTopColor: '#FAFAFA'
    },
});

export const LayoutComponent = CourseOrder;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
    };
}