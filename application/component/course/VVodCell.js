//import liraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

import theme from '../../config/theme';

// create a component
class VVodCell extends Component {
    render() {
        const {course = {}, style = {}} = this.props;

        return (
            <TouchableOpacity style={[styles.mb_15, style]} onPress={() => this.props.onPress && this.props.onPress()}>
                <View style={[styles.thumb, styles.overflow_h]}>
                    <Image source={{uri: course.courseImg}} style={[styles.f9, styles.thumb, styles.circle_5]}/>
                </View>
                <View style={[styles.mt_5]}>
                    <Text numberOfLines={2} style={[styles.title]}>{course.courseName}</Text>
                    <Text style={styles.label_12} numberOfLines={1}>{course.summary}</Text>
                    <Text style={[styles.label_12, styles.label_gray]}>{course.teacherName}</Text>
                    <Text style={[styles.label_12, styles.label_gray]}><Text style={[styles.label_blue, styles.label_12]}>{course.courseIntegral > 0 ? course.courseIntegral + '积分' : '免费'}</Text> {course.learn}人已学</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    thumb: {
        height: 87,
    },
    title: {
        height: 40,
    }
});

//make this component available to the app
export default VVodCell;
