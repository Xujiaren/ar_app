//import liraries
import React, { Component } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';

import theme from '../../config/theme';
import * as tool from '../../util/tool';

const status = ['进行中', '待开始', '已结束'];

// create a component
class ActivityCell extends Component {

    render() {
        const {activity={}, style = {}} = this.props;

        return (
            <TouchableOpacity style={[style]} onPress={() => this.props.onPress && this.props.onPress()}>
                <ImageBackground source={{uri: activity.activityImg}} style={[styles.thumb, styles.bg_l1gray, styles.circle_5]}>
                    <View style={[styles.status]}>
                        <Text style={[styles.label_white]}>{status[activity.astatus]}</Text>
                    </View>
                    <View style={styles.title}>
                        <Text style={[styles.label_white]}>活动时间：{tool.ts2dt(activity.beginTime)}-{tool.ts2dt(activity.endTime)}</Text>
                    </View>
                </ImageBackground>
                <View style={[styles.row, styles.ai_ct, styles.pt_10, styles.pb_10, styles.b_line]}>
                    <View style={[styles.f3]}>
                        <Text style={[styles.label_16]} numberOfLines={1}>{activity.title}</Text>
                    </View>
                    <View style={[styles.f1, styles.ai_end]}>
                        <Text style={[styles.label_12, styles.label_gray]}>{activity.num}人参与</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    thumb: {
        height: 130
    },
    status: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderWidth: 1,
        borderColor: 'white',
        padding: 3,
        paddingLeft: 5,
        paddingRight: 5,
    },
    title: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: 10,
        paddingTop: 5,
        paddingBottom: 5,
    }
});

//make this component available to the app
export default ActivityCell;
