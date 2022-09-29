//import liraries
import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

import theme from '../../config/theme';

// create a component
class ArticleCell extends Component {

    constructor(props) {
        super(props);

        this.images = ["", "", ""];

        this.state = {
            width: 0,
        }
    }

    render() {
        const {width} = this.state;
        const {course={}, ttype = 0} = this.props;

        return (
            <TouchableOpacity style={[styles.pb_10, styles.b_line]} onLayout={(evt) => {
                this.setState({
                    width: evt.nativeEvent.layout.width
                })
            }} onPress={() => this.props.onPress && this.props.onPress()}>
                {ttype == 2 ?
                <Image source={{uri:course.galleryList ? course.galleryList[0].fpath : ''}} style={[styles.thumb, styles.circle_5, styles.mt_10]}/>
                :null}
                <Text style={[styles.label_16, styles.mt_15]}>{course.courseName}</Text>
                {ttype == 0 || ttype == 1 || ttype == 2 ? 
                <Text style={[styles.label_dgray, styles.mt_10]} numberOfLines={2}>{course.summary}</Text>
                :null}
                {ttype == 1 ?
                <View style={[styles.row, styles.jc_sb, styles.ai_ct, styles.mt_10]}>
                    {course.galleryList && course.galleryList.map((img, index) => {
                        return (
                            <Image source={{uri: img.fpath}} style={[styles.sthumb, {width: (width - 20) / 3}, styles.bg_blue, styles.circle_5]} key={'img_' + index}/>
                        )
                    })}
                </View>
                : null}
                {ttype == 0 || ttype == 1 || ttype == 2 ?
                <Text style={[styles.label_12, styles.label_gray, styles.mt_10]}>{course.collectNum}赞 · {course.comment}评论</Text>
                :null}

                {ttype == 3 ? 
                <View style={[styles.row, styles.jc_sb, styles.ai_fs]}>
                    <View style={[styles.mt_10, {width: width - 130}]}>
                        <Text style={[styles.label_dgray]} numberOfLines={2}>{course.summary}</Text>
                        <Text style={[styles.label_12, styles.label_gray,styles.mt_10]}>{course.collectNum}赞 · {course.comment}评论</Text>
                    </View>
                    <Image source={{uri:course.galleryList ? course.galleryList[0].fpath : ''}} style={[styles.mthumb, styles.bg_blue, styles.circle_5]}/>
                </View>
                :null}

            </TouchableOpacity>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    thumb: {
        height: 140,
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
export default ArticleCell;
