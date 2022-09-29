//import liraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import RankView from '../../component/base/RankView';
import theme from '../../config/theme';

// create a component
class VodCell extends Component {
    render() {
        const {course = {}, style = {}} = this.props;

        return (
            <TouchableOpacity style={[styles.row, styles.mb_15, style]} onPress={() => this.props.onPress && this.props.onPress()}>
                <Image source={{uri: course.courseImg}} style={[styles.f9, styles.thumb, styles.circle_5]}/>
                <View style={[styles.f10, styles.ml_10, styles.jc_sb]}>
                    <View>
                        <Text numberOfLines={2}>{course.courseName}</Text>
                        <Text style={styles.label_12} numberOfLines={1}>{course.summary}</Text>
                        <Text style={[styles.label_12, styles.label_gray]}>{course.teacherName ? course.teacherName  + ' ' : ''}{course.chapter}章节</Text>
                        <RankView value={parseInt(course.score)} label={parseFloat(course.score).toFixed(1)}/>
                    </View>
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
});

//make this component available to the app
export default VodCell;
