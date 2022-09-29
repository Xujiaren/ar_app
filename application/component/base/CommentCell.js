//import liraries
import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

import iconMap from '../../config/font';
import {textToEmoji2} from '../../util/emoji';
import theme from '../../config/theme';

// create a component
class CommentCell extends Component {

    render() {
        const {comment = {}, onPreview, onPraise} = this.props;

        let ele = [];
        textToEmoji2(comment.content).map((msg, index) => {
            if (msg.msgType === 'text') {
                ele.push(<Text key={'ce_' + comment.commentId + '_' + index}>{msg.msgCont}</Text>);
            } else {
                ele.push(<Image key={'ce_' + comment.commentId + '_' + index} source={{uri:msg.msgImage}} style={{width:20,height:20}} />);
            }
        })

        return (
            <View style={[styles.bg_white, styles.p_15, styles.pl_20, styles.pr_20, styles.b_line, styles.row]}>
                <Image source={{uri: comment.avatar}} style={[styles.avatar, styles.bg_lgray]}/>
                <View style={[styles.ml_10, styles.comment]}>
                    <View style={[styles.row, styles.jc_sb]}>
                        <View>
                            <Text>{comment.username}</Text>
                            <Text style={[styles.label_12, styles.label_gray]}>{comment.pubTimeFt}</Text>
                        </View>
                        <TouchableOpacity onPress={() => onPraise && onPraise()}>
                            <Text style={[styles.label_12, styles.label_gray, comment.like && styles.label_red]}><Text style={[styles.icon, comment.like && styles.label_red]}>{iconMap(comment.like ? 'dianzan1' : 'dianzan')}</Text> {comment.praise}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.mt_10, styles.row, styles.wrap]}>
                        {ele}
                    </View>
                    {comment.galleryList.length > 0?
                    <View style={[styles.mt_5, styles.row, styles.wrap]}>
                        {comment.galleryList.map((img, index) => {
                            return (
                                <TouchableOpacity style={[styles.mr_10, styles.mb_10]} key={'img_' + comment.commentId + '_' + index} onPress={() => onPreview && onPreview(comment.galleryList, index)}>
                                    <Image source={{uri: img.fpath}} style={[styles.thumb, styles.bg_l1gray]}/>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                    : null}
                    {comment.childList && comment.childList.map((ccoment, index) => {
                        let cele = [];
                        cele.push(<Text>小精灵：</Text>);
                        textToEmoji2(ccoment.content).map((msg, index) => {
                            if (msg.msgType === 'text') {
                                cele.push(<Text key={'text_' + comment.commentId + '_' + index} style={[styles.label_dgray]}>{msg.msgCont}</Text>);
                            } else {
                                cele.push(<Image key={'msg_' + comment.commentId + '_' + index} source={{uri:msg.msgImage}} style={{width:20,height:20}} />);
                            }
                        })
        
                        return (
                            <View style={[styles.p_10, styles.pl_15, styles.pr_15, styles.bg_l1gray, styles.mt_10, styles.row, styles.wrap]} key={'ccoment_' + ccoment.commentId}>
                                {cele}
                            </View>
                        )
                    })}
                    
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    comment: {
        flex: 10,
    },
    thumb: {
        width: 90,
        height: 90,
    },
});

//make this component available to the app
export default CommentCell;
