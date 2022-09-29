import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

import theme from '../../config/theme';

class LiveMsg extends Component {

    constructor(props) {
        super(props);

        this.state = {
            msg: '',
        }

        this.push = this.push.bind(this);
    }

    push(msg) {
        this.setState({
            msg: msg
        }, () => {
            this.refs.live_msg.bounceInLeft && this.refs.live_msg.bounceInLeft(800).then(state => {
                this.refs.live_msg && this.refs.live_msg.fadeOutUp && this.refs.live_msg.fadeOutUp(150).then(state => {
                    this.setState({
                        msg: '',
                    });
                })
            })
        })
    }

    render() {
        return (
            <Animatable.View useNativeDriver style={styles.container} animation={'bounceInLeft'} ref={'live_msg'}>
                {this.state.msg != '' ?
                <View style={[styles.p_5, styles.circle_10, styles.bg_blue]}>
                    <Text style={[styles.label_white, styles.label_12]}>{this.state.msg}</Text>
                </View>
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
});

export default LiveMsg;