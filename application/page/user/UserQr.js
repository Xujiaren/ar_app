//import liraries
import React, { Component } from 'react';
import { View, Text, Image, Animated, Easing, StyleSheet, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { RNCamera } from 'react-native-camera';
import base64 from 'react-native-base64';

import asset from '../../config/asset';
import theme from '../../config/theme';
import config from '../../config/param';
import * as tool from '../../util/tool';

// create a component
class UserQr extends Component {

    static navigationOptions = {
        title:'二维码',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);
        const {navigation} = props;

        this.state = {
            type: navigation.getParam('type', 0),
            find: false,
            moveAnim: new Animated.Value(0),
        }

        this.startAnimation = this.startAnimation.bind(this);
        this.onBarCodeRead = this.onBarCodeRead.bind(this);
    }

    componentDidMount() {
        this.startAnimation();
	}

    startAnimation() {
		this.state.moveAnim.setValue(0);
		Animated.timing(this.state.moveAnim,//初始值
			{
				toValue: theme.window.width * 0.8 - 40,
				duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true
			}//结束值
		).start(() => this.startAnimation());//开始
    };

    onBarCodeRead(result) {
        const {navigation, actions, user} = this.props;
        const {find} = this.state;

        if (!find && result.data) {
            this.setState({
                find: true
            }, () => {
                const b64str = result.data;

                try {
                    const obj = JSON.parse(base64.decode(b64str));

                    if (obj.squad_id) {
                        actions.o2o.sign({
                            squad_id: obj.squad_id,
                            resolved: (data) => {
                                Alert.alert('扫码签到', '签到成功！', [
                                    {text: '确认', onPress: () => {
                                        navigation.goBack();
                                    }}
                                ],{cancelable:false});
                            },
                            rejected: (msg) => {
                                Alert.alert('扫码签到', msg, [
                                    {text: '确认', onPress: () => {
                                        navigation.goBack();
                                    }}
                                ],{cancelable:false});
                            }
                        })
                    } else {
                        this.setState({
                            find: false,
                        })
                    }
                } catch (err) {
                    this.setState({
                        find: false,
                    })
                }

                
            })
        }
    }

    render() {
        const {user} = this.props;
        const {type} = this.state;

        if (type == 1) {
            return (
                <View style={[styles.container, styles.bg_black]}>
                    <RNCamera
                        style={styles.camera}
                        onBarCodeRead={this.onBarCodeRead}
                    >
                        <View style={styles.maskt}/>
                        <View style={styles.mask}>
                            <View style={styles.masklr}/>
                            <View style={styles.preview}>
                                <Animated.View style={[styles.border, {transform: [{translateY: this.state.moveAnim}]}]}>
                                    <Image source={asset.user.qrcode_line} style={styles.line}/>
                                </Animated.View>
                            </View>
                            <View style={styles.masklr}/>
                        </View>
                        <View style={styles.maskb}>
                            <Text style={[styles.label_white, styles.label_12, styles.mt_10]}>将二维码/条码放入框内，即可自动扫描</Text>
                        </View>
                    </RNCamera>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <View style={[styles.ai_ct, styles.mt_40]}>
                    <QRCode value={config.site + '#/userCheck/' + user.userId} size={theme.window.width / 3}/>
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    camera: {
    	flex: 1,
    	alignItems: 'center',
    },
    maskt: {
    	width: theme.window.width,
    	height: (theme.window.height - theme.window.width * 0.8) / 2 - 80,
    	backgroundColor: 'rgba(0, 0, 0, 0.5)',
    	alignItems: 'center',
    	justifyContent: 'flex-start',
    },
    maskb: {
    	width: theme.window.width,
    	height: (theme.window.height - theme.window.width * 0.8) / 2 + 80,
    	backgroundColor: 'rgba(0, 0, 0, 0.5)',
    	alignItems: 'center',
    	justifyContent: 'flex-start',
    },
    mask: {
    	flexDirection: 'row',
    	alignItems: 'center',
    	justifyContent: 'flex-start',
    	height: theme.window.width * 0.8,
    },
    preview: {
    	width: theme.window.width * 0.8,
    	height: theme.window.width * 0.8,
    	borderWidth: 1,
    	borderColor: '#00FF00',
    	borderStyle: 'solid',
    	padding: 20,
    },
    border: {
    	flex: 0,
        width: theme.window.width * 0.8 - 40,
        height: 2,
    },
    line: {
    	width: theme.window.width * 0.8 - 40,
        height: 1,
    },
    masklr: {
    	width: theme.window.width * 0.1,
    	height: theme.window.width * 0.8,
    	backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }
});

export const LayoutComponent = UserQr;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
    };
}