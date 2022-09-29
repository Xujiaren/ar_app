//import liraries
import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

import theme from '../../config/theme';

// create a component
class AskCell extends Component {
    render() {
        const {ask = {}, style = {}} = this.props;

        return (
            <TouchableOpacity style={[styles.b_line, styles.pb_15, styles.mb_15]} onPress={() => this.props.onPress && this.props.onPress()}>
                <Text style={[styles.label_16]}>{ask.title}</Text>
                <View style={[styles.row, styles.mt_10]}>
                    <View style={[styles.info, styles.f3, styles.mr_10]}>
                        <View style={[styles.row, styles.ai_ct]}>
                            <Image source={{uri: ask.avatar}} style={[styles.avatar, styles.bg_l1gray]}/>
                            <Text style={[styles.ml_5, styles.label_12]}>{ask.nickname}</Text>
                        </View>
                        <Text numberOfLines={1} style={[styles.mt_10]}>{ask.content}</Text>
                    </View>
                    {ask.gallery.length > 0 ?
                    <View style={[styles.f1]}>
                        <Image source={{uri: ask.gallery[0].fpath}} style={[styles.thumb, styles.circle_5, styles.bg_l1gray]}/>
                    </View>
                    : null}
                </View>
                <Text style={[styles.label_gray, styles.label_12]}>{ask.hit} 热度 {ask.replyNum} 回答</Text>
            </TouchableOpacity>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    info: {
        height: 64,
    },
    thumb: {
        width: 100,
        height: 64,
    },
    avatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
    },
});

//make this component available to the app
export default AskCell;
