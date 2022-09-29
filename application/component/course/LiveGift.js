import React, { Component } from 'react';
import {Text, Image, StyleSheet ,View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';

import theme from '../../config/theme';

class LiveGift extends Component {

    constructor(props) {
        super(props);

        this.state = {
            msg: '',
            gift: {},
        }

        this.push = this.push.bind(this);
    }

    push(msg, gift) {
        this.setState({
            msg: msg,
            gift: gift
        }, () => {
            this.refs.live_gift.bounceInLeft && this.refs.live_gift.bounceInLeft(800).then(state => {
                this.refs.live_gift && this.refs.live_gift.fadeOutUp && this.refs.live_gift.fadeOutUp(250).then(state => {
                    this.setState({
                        msg: '',
                        gift: {},
                    });
                })
            })
        })
    }

    render() {
        const {gift} = this.state;
        return (
            <Animatable.View useNativeDriver style={styles.container} animation={'bounceInLeft'} ref={'live_gift'}>
                {this.state.msg != '' ?
                <LinearGradient colors={['#F2709C', '#FF9472']}  start={{x: 0, y: 0}}  end={{x: 1, y: 0}}
                    style={[styles.p_10, styles.circle_10, styles.row, styles.ai_ct, styles.jc_sb, styles.gift]}>
                    <View style={[styles.f1]}>
                        <Text style={[styles.label_white, styles.label_12, styles.gift_msg]}>{this.state.msg}  </Text>
                        <Text style={[styles.label_white, styles.label_12, styles.gift_msg]}>{'赠送'}<Text style={[styles.label_blue, styles.label_12]}>{gift.giftName}</Text></Text>
                    </View>
                    <Image source={{uri: gift.giftImg}} style={[styles.gift_icon, styles.ml_10]}/>
                </LinearGradient>
                : null}
            </Animatable.View>
        );
    }
}

const styles = StyleSheet.create({
    ...theme,
    container: {
        position: 'absolute',
        left: 20,
        bottom: 300,
    },
    gift: {
        width: theme.window.width * 0.4,
    },
    gift_msg: {
        width: theme.window.width * 0.4 - 50,
    },
    gift_icon: {
        width: 32,
        height: 32
    }
});

export default LiveGift;