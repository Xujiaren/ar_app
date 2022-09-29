//import liraries
import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

import theme from '../../config/theme';

// create a component
class NewsCell extends Component {

    constructor(props) {
        super(props);

        this.state = {
            width: 0,
        }
    }

    render() {
        const {width} = this.state;
        const {news={}, ttype = 0, style={}} = this.props;

        if (ttype == 0) {
            return (
                <TouchableOpacity style={[styles.pb_10, styles.b_line, style]} onLayout={(evt) => {
                    this.setState({
                        width: evt.nativeEvent.layout.width
                    })
                }} onPress={() => this.props.onPress && this.props.onPress()}>
                    <View>
                        <Image source={{uri: news.articleImg}} style={[styles.thumb, styles.bg_l1gray, styles.circle_5]}/>
                        <View style={[styles.title]}>
                            <Text style={[styles.label_white, styles.label_16]}>{news.title}</Text>
                        </View>
                    </View>
                    <Text style={[styles.label_12, styles.label_gray, styles.mt_10]}>{news.comment}评论 · {news.pubTimeFt}</Text>
                </TouchableOpacity>
            )
        }

        if (ttype == 1) {
            return (
                <TouchableOpacity style={[styles.pb_10, styles.b_line, style]} onLayout={(evt) => {
                    this.setState({
                        width: evt.nativeEvent.layout.width
                    })
                }} onPress={() => this.props.onPress && this.props.onPress()}>
                    <Text style={[styles.label_16]}>{news.title}</Text>
                    <View style={[styles.row, styles.jc_sb, styles.ai_ct, styles.mt_10]}>
                    {news.gallery && news.gallery.map((img, index) => {
                        return (
                            <Image source={{uri: img.fpath}} style={[styles.sthumb, {width: (width - 20) / 3}, styles.circle_5]} key={'img_' + index}/>
                        )
                    })}
                    </View>
                    <Text style={[styles.label_12, styles.label_gray, styles.mt_10]}>{news.comment}评论 · {news.pubTimeFt}</Text>
                </TouchableOpacity>
            )
        }
        
        return (
            <TouchableOpacity style={[styles.pb_10, styles.b_line, styles.row, styles.jc_sb, styles.ai_fs, style]} onLayout={(evt) => {
                this.setState({
                    width: evt.nativeEvent.layout.width
                })
            }} onPress={() => this.props.onPress && this.props.onPress()}>
                <View style={[{width: width - 130}]}>
                    <Text style={[styles.label_dgray]} numberOfLines={2}>{news.title}</Text>
                    <Text style={[styles.label_12, styles.label_gray,styles.mt_10]}>{news.comment}评论 · {news.pubTimeFt}</Text>
                </View>
                <Image source={{uri: news.gallery && news.gallery.length > 0 ? news.gallery[0].fpath : ''}} style={[styles.mthumb, styles.circle_5]}/>
                
            </TouchableOpacity>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    thumb: {
        height: 120,
    },
    title: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
    },
    mthumb: {
        width: 120,
        height: 62,
    },
    sthumb: {
        height: 62,
    }
});

//make this component available to the app
export default NewsCell;
