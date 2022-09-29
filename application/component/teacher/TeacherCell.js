import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

import theme from '../../config/theme';

class TeacherCell extends Component {
    render() {
        const {teacher = {}, follow = false, style = {}} = this.props;

        return (
            <TouchableOpacity style={[styles.row, styles.ai_fs, styles.jc_sb, style]} onPress={() => this.props.onPress && this.props.onPress()}>
                <View style={[styles.row]}>
                    <Image source={{uri: teacher.teacherImg}} style={[styles.thumb, styles.bg_l1gray, styles.circle_5]}/>
                    <View style={[styles.ml_10, styles.jc_sb]}>
                        <View>
                            <Text>{teacher.teacherName}</Text>
                            <Text style={[styles.mt_5, styles.label_gray]}>{teacher.honor}</Text>
                        </View>
                        <Text style={[styles.label_gray]}>共{teacher.courseNum}讲</Text>
                    </View>
                </View>
                <TouchableOpacity style={[styles.p_5, styles.pl_15, styles.pr_15, styles.bg_lgray, (teacher.isFollow || follow) && styles.bg_blue, styles.circle_20]} onPress={() => this.props.onFollow && this.props.onFollow()}>
                    <Text style={[styles.label_blue, (teacher.isFollow || follow) && styles.label_white]}>{(teacher.isFollow || follow) ? '已关注' : '+ 关注'}</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    thumb: {
        width: 65,
        height: 80,
    }
});

//make this component available to the app
export default TeacherCell;
