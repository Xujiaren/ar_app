//import liraries
import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import iconMap from '../../../config/font';
import theme from '../../../config/theme';

// create a component
class Message extends Component {

    static navigationOptions = {
        title:'消息管理',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        this.message = {};
        this.remind = {};

        this.state = {
            message_unread: 0,
            remind_unread: 0,
        }

        this.onRefresh = this.onRefresh.bind(this);
    }

    componentDidMount() {
        const {navigation} = this.props;
        this.focuSub = navigation.addListener('didFocus', (route) => {
            this.onRefresh();
        })
    }

    componentWillUnmount(){
        this.focuSub && this.focuSub.remove();
    }

    componentWillReceiveProps(nextProps) {
        const {unread, message, remind} = nextProps;

        if (unread !== this.props.unread) {
            this.setState({
                message_unread: unread.message,
                remind_unread: unread.remind,
            })
        }

        if (message !== this.props.message && message.items && message.items.length > 0) {
            this.message = message.items[0];
        }

        if (remind !== this.props.remind && remind.items && remind.items.length > 0) {
            this.remind = remind.items[0];
        }
    }

    onRefresh() {
        const {actions} = this.props;
        actions.user.unread();
        actions.user.message(0);
        actions.user.remind(0);
    }

    render() {
        const {navigation} = this.props;
        const {message_unread, remind_unread} = this.state;
        
        return (
            <View style={styles.container}>
                <TouchableOpacity style={[styles.p_10, styles.pl_20, styles.pr_20, styles.row, styles.ai_fs]} onPress={() => navigation.navigate('MessageInfo', {type: 1})}>
                    <View style={[styles.f1, styles.p_5]}>
                        <Text style={[styles.icon, styles.label_46, {color: '#7ED321'}]}>{iconMap('xitongtongzhi')}</Text>
                        {remind_unread > 0 ?
                        <View style={[styles.unread]}><Text style={[styles.label_12, styles.label_white]}>{remind_unread}</Text></View>
                        : null}
                    </View>
                    <View style={[styles.f6, styles.p_5, styles.jc_sb, styles.msg]}>
                        <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
                            <Text style={styles.label_16}>系统通知</Text>
                            <Text style={[styles.label_12, styles.label_gray]}>{this.remind.pubTimeFt}</Text>
                        </View>
                        <Text style={[styles.label_dgray]}>{this.remind.title}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.p_10, styles.pl_20, styles.pr_20, styles.row, styles.ai_fs]} onPress={() => navigation.navigate('MessageInfo', {type: 0})}>
                    <View style={[styles.f1, styles.p_5]}>
                        <Text style={[styles.icon, styles.label_46, {color: '#00A6F6'}]}>{iconMap('tedingxiaoxi')}</Text>
                        {message_unread > 0 ?
                        <View style={[styles.unread]}><Text style={[styles.label_12, styles.label_white]}>{message_unread}</Text></View>
                        : null}
                    </View>
                    <View style={[styles.f6, styles.p_5, styles.jc_sb, styles.msg]}>
                        <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
                            <Text style={styles.label_16}>特定消息</Text>
                            <Text style={[styles.label_12, styles.label_gray]}>{this.message.pubTimeFt}</Text>
                        </View>
                        <Text style={[styles.label_dgray]}>{this.message.title}</Text>
                    </View>
                    
                </TouchableOpacity>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    msg: {
        height: 46
    },
    unread: {
        position: 'absolute',
        top: 0,
        right: 2,
        backgroundColor: 'red',
        padding: 3,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 2,
    }
});

export const LayoutComponent = Message;

export function mapStateToProps(state) {
    return {
        unread: state.user.unread,
        message: state.user.message,
        remind: state.user.remind,
    };
}