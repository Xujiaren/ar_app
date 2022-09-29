//import liraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import ProgressBar from 'react-native-progress/Bar';
import * as WeChat from 'react-native-wechat-lib';

import config from '../../../config/param';
import theme from '../../../config/theme';
import iconMap from '../../../config/font';

// create a component
class MedalInfo extends Component {

    static navigationOptions = {
        title:'我的勋章',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        const {navigation} = props;
        this.medal = navigation.getParam('medal', []);
        const current = navigation.getParam('index', 0);
        this.items = this.medal.child;
        
        this.state = {
            share: false,
            current: current,
            index: current,
        }

        this.onShare = this.onShare.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    onShare(type) {
        const {user} = this.props;

        this.setState({
            preview: false,
        }, () => {
            WeChat.isWXAppInstalled().then((installed) => {
                if (installed) {
                    WeChat.shareWebpage({
                        title: '纳视界',
                        description: '您的好友在纳视界获得了' + this.medal.title + '勋章，快去围观吧～',
                        thumbImageUrl: this.medal.img,
                        webpageUrl: config.site + '?fromuid=' + user.userId,
                        scene: type
                    })
                }
            });  
        })
    }

    _renderItem(item) {
        const medal = item.item;

        return (
            <View style={[styles.ai_ct, styles.jc_ct]}>
                <Image source={{uri: medal.img}} style={[styles.medal_img]}/>
            </View>
        )
    }

    render() {
        const {index, current, share} = this.state;

        const medal = this.items[index];

        return (
            <View style={[styles.container]}>
                <View style={[styles.mt_40]}>
                    <Carousel
                        ref={(c) => { this._carousel = c; }}
                        data={this.items}
                        renderItem={this._renderItem}
                        sliderWidth={theme.window.width}
                        itemWidth={theme.window.width * 0.5}
                        onSnapToItem={(index) => {
                            this.setState({
                                index: index,
                            })
                        }}
                    />
                </View>
                <View style={[styles.p_40, styles.ai_ct]}>
                    <Text style={[styles.label_18, styles.mt_40]}>{medal.title}Lv.{this.medal.lv}</Text>
                    <Text style={[styles.mt_10, styles.label_gray, styles.label_12]}>当前进度{current}/{this.items.length}</Text>
                    <Text style={[styles.mt_30]}>{medal.content}</Text>
                    <TouchableOpacity style={[styles.p_10, styles.pr_50, styles.pl_50, styles.circle_5, styles.bg_blue, styles.mt_40]} onPress={() => this.setState({
                        share: true,
                    })}>
                        <Text style={[styles.label_white]}>分享</Text>
                    </TouchableOpacity>
                </View>
                <Modal visible={share} transparent={true} onRequestClose={() => {
                        this.setState({share:false})
                    }}>
                    <TouchableOpacity style={[styles.modal]} onPress={()=>this.setState({share:false})}/>
                    <View style={[styles.share, styles.bg_white, styles.p_25, styles.row, styles.ai_ct, styles.jc_ad]}>
                        <TouchableOpacity style={[styles.ai_ct]} onPress={() => this.onShare(0)}>
                            <Text style={[styles.icon, {fontSize: 44, color: '#1ABE4D'}]}>{iconMap('weixin')}</Text>
                            <Text style={[styles.mt_10]}>微信好友</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.ai_ct]} onPress={() => this.onShare(1)}>
                            <Text style={[styles.icon,  {fontSize: 44, color: '#1ABE4D'}]}>{iconMap('pengyouquan')}</Text>
                            <Text style={[styles.mt_10]}>微信朋友圈</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    medal_img: {
        width: 140,
        height: 140,
    },
    medal: {
        position: 'absolute',
        top: 150,
        left: 50,
        right: 50,
    }
});

export const LayoutComponent = MedalInfo;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
    };
}
