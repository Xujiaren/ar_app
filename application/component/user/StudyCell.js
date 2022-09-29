//import liraries
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';

import theme from '../../config/theme';

// create a component
class StudyCell extends Component {
    
    render() {
        const {course = {}, style = {}, progress= 0} = this.props;

        let _progress = progress;

        if (_progress == 0 && course.study) {
            _progress = parseFloat(course.study.progress / 100);
        } else {
            _progress = 1;
        }

        return (
            <TouchableOpacity style={[styles.row, styles.ml_20, styles.mr_20, styles.mb_15, style]} onPress={() => this.props.onPress && this.props.onPress()}>
                <Image source={{uri: course.courseImg}} style={[styles.f9, styles.thumb, styles.circle_5, styles.bg_l1gray]}/>
                <View style={[styles.f10, styles.ml_10, styles.jc_sb]}>
                    <Text>{course.courseName}</Text>
                    <View>
                        <View style={[styles.row, styles.jc_sb, styles.ai_ct]}>
                            <Text style={[styles.label_12, styles.label_gray]}></Text>
                            <Text style={[styles.label_12, styles.label_gray]}>已学{_progress * 100}%</Text>
                        </View>
                        <ProgressBar
                            style={styles.mt_5}
                            progress={_progress}
                            borderWidth={0}
                            width={(theme.window.width - 40) / 2}
                            color={'#00A6F6'}
                            unfilledColor={'#E9E9E9'}
                        />
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
        height: 87,
    },
});

//make this component available to the app
export default StudyCell;
