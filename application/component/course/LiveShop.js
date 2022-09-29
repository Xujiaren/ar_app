import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import BackgroundTimer from 'react-native-background-timer';

import theme from '../../config/theme';

class LiveShop extends Component {

    constructor(props) {
        super(props);

        this.state = {
            goods: {},
        }

        this.push = this.push.bind(this);
    }

    push(goods) {
        this.setState({
            goods: goods,
        }, () => {
            this.refs.live_goods.bounceInLeft && this.refs.live_goods.bounceInLeft(2400).then(state => {

                BackgroundTimer.setTimeout(() => {
                    this.refs.live_goods && this.refs.live_goods.fadeOutUp && this.refs.live_goods.fadeOutUp(300).then(state => {
                        this.setState({
                            goods: {},
                        });
                    })
                }, 5000);
                
            })
        })
    }

    render() {
        const {goods} = this.state;

        return (
            <Animatable.View useNativeDriver style={styles.container} animation={'bounceInLeft'} ref={'live_goods'}>
                {goods.goodsId ?
                <TouchableOpacity style={[styles.goods, styles.mb_10, styles.circle_5, styles.p_10, styles.bg_white, styles.row]} onPress={() => this.props.onPress && this.props.onPress(goods)}>
                    <Image source={{uri: goods.goodsImg}} style={styles.goods_img}/>
                    <View style={[styles.jc_sb, styles.goods_intro, styles.ml_10]}>
                        <Text style={[styles.label_12]}>{goods.goodsName}</Text>
                        <Text style={[styles.label_12, styles.label_red]}>¥{parseFloat(goods.goodsPrice).toFixed(2)}</Text>
                    </View>
                </TouchableOpacity>
                : null}
            </Animatable.View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    container: {
        position: 'absolute',
        left: 20,
        bottom: 60,
        right: 80,
    },
    goods: {
        height: 75,
        shadowOffset:{  width: 0,  height:5},
        shadowColor: 'rgba(233,233,233,1)',
        shadowOpacity: 1.0,
        elevation: 2
    },
    goods_img: {
        width: 94,
        height: 55,
    },
    goods_intro: {
        width: theme.window.width * 0.6 - 130,
        height: 55,
    },
    ad_page: {
        position: "absolute",
        bottom: 5,
        left: 0,
        right: 0,
        paddingVertical: 5,
    },
    ad_dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.92)'
    },
});

export default LiveShop;