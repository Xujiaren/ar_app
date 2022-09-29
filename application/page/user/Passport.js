//import liraries
import React, { Component } from 'react';
import { View, Image, TouchableWithoutFeedback, TouchableOpacity, Keyboard, ScrollView, Text, TextInput, Platform, Alert, Modal, StyleSheet, FlatList, DeviceEventEmitter } from 'react-native';
import { Header } from 'react-navigation-stack';
import store from 'react-native-simple-store';
import * as WeChat from 'react-native-wechat-lib';

import SignWithApple from '../../component/base/SignApple';
import CountDownButton from '../../component/base/CountDownButton';
import HudView from '../../component/base/HudView';
import asset from '../../config/asset';
import theme from '../../config/theme';
import iconMap from '../../config/font';

// create a component
class Passport extends Component {

    static navigationOptions = {
        headerShown: false,
    };

    constructor(props){
        super(props);

        this.uniqueId = '';
        this.descriptionType = 0;
        this.cardCodeList = [];
        this.chiefCode = '';
        this.cardCodes = '';

        this.state = {
            code:'',
            mobile:'',
            unionId: '',
            loginType: 0,

            vcode: false,
            isAgree: false,
            
            card: false,
            wechat: false,
            apple: Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 13,
        };

        this._onCorp = this._onCorp.bind(this);
        this._onCode = this._onCode.bind(this);
        this._onLogin = this._onLogin.bind(this);
        this._onSwitch = this._onSwitch.bind(this);
        this._onWechat = this._onWechat.bind(this);
        this._onApple = this._onApple.bind(this);

        this.renderCard = this.renderCard.bind(this);
        this.onCard = this.onCard.bind(this);
        this.onExit = this.onExit.bind(this);
    }

    componentDidMount() {
        WeChat.isWXAppInstalled().then((installed) => {
            this.setState({
                wechat: installed,
            })
        });
    }

    _onCorp(mobile) {
        const {actions} = this.props;

        actions.passport.iscorp({
            mobile: mobile,
            resolved: (data) => {
                if (data) {
                    global.utype = 1;
                } else {
                    global.utype = 0;
                }

                store.save('utype', global.utype);
            },
            rejected: (msg) => {
                
            }
        })
    }

    _onCode() {
        const {actions} = this.props;
        const {mobile} = this.state;

        Keyboard.dismiss();

        this.setState({
            vcode: true,
        }, () => {
            actions.passport.vcode({
                mobile: mobile,
                resolved: (data) => {

                    this.refs.countdown && this.refs.countdown.start();

                    this.uniqueId = data.uniqueid;
                    this.descriptionType = data.descriptionType;
                    this.cardCodeList = data.cardCodeList;
                    this.chiefCode = data.chiefCode;
                    this.cardCodes = data.cardCodes;

                    global.cardCodes = data.cardCodeList;
                    console.info(global.cardCodes);
                    store.save('cardcodes', global.cardCodes);

                    this.setState({
                        vcode: false,
                    })
                },
                rejected: (msg) => {
                    this.refs.hud.show(msg, 2, () => {
                        this.refs.countdown && this.refs.countdown.reset();
                    });
                }
            })
        })

        
    }

    _onLogin() {
        const {actions} = this.props;
        const {mobile, code, unionId, loginType} = this.state;
        if (this.uniqueId == '') {
            this.refs.hud.show('请先获取验证码', 1);
            return;
        }

        DeviceEventEmitter.emit('refresh');

        if (loginType == 0) {
            actions.passport.login({
                mobile: mobile,
                code: code,
                descriptionType: this.descriptionType,
                uniqueId: this.uniqueId,
                chiefCode: this.chiefCode,
                cardCodes: this.cardCodes,
                reg_from: global.os,
                resolved: (data) => {
                    const udata = data;

                    global.cards = udata.userInfoList;
                    store.save('cards', udata.userInfoList);

                    if (udata.token != '') {
                        actions.passport.token({
                            token: udata.token,
                            resolved: (data) => {
                                this._onSwitch();
                            },
                            rejected: (msg) => {
                                this.refs.hud.show('登录失败', 1);
                            }
                        })
                    } else {
                        this.refs.hud.show('请输入正确的验证码。', 2);
                    }
                    
                },
                rejected: (msg) => {
                    this.refs.hud.show(msg, 2);
                }
            })
        } else {
            actions.passport.bindMobile({
                union_id: unionId,
                mobile: mobile,
                code: code,
                descriptionType: this.descriptionType,
                uniqueId: this.uniqueId,
                cardCodes: this.cardCodes,
                reg_from: global.os,
                resolved: (data) => {
                    const udata = data;
    
                    if (udata.token != '') {
                        actions.passport.token({
                            token: udata.token,
                            resolved: (data) => {
                                this._onSwitch();
                            },
                            rejected: (msg) => {
                                this.refs.hud.show('绑定失败', 1);
                            }
                        })
                    } else {
                        this.refs.hud.show('请输入正确的验证码。', 2);
                    }
                },
                rejected: (msg) => {
                    this.refs.hud.show(msg, 2);
                }
            })
        }
    }

    _onSwitch() {
        const {navigation, actions} = this.props;
        const React = require('react-native');
        var {Platform} = React;
        let lst = 1
        if(Platform.OS=='ios'){
            lst=1
        }else{
            lst=2
        }
        actions.user.user();
        actions.passport.LoginLog({
            from:lst,
            resolved:(res=>{})
        })
        if (global.cards.length <= 1) {
            navigation.goBack();
        } else {
            this.setState({
                card: true,
            })
        }
    }

    _onWechat() {
        const {navigation, actions} = this.props;
        WeChat.sendAuthRequest('snsapi_userinfo', 'wechat_sdk_demo').then(responseCode => {
            actions.passport.wechatLogin({
                code: responseCode.code,
                fuser: 0,
                resolved: (data) => {
                    if(data.reqType === 'bind'){
                        this.setState({
                            unionId: data.unionId,
                            loginType: 1,
                        })
                    } else if(data.reqType === 'login'){
                        actions.passport.token({
                            token: data.token,
                            resolved: (data) => {
                                this._onSwitch();
                            },
                            rejected: (msg) => {
                                this.refs.hud.show('登录失败', 1);
                            }
                        })
                    }
                },
                rejected: (msg) => {
                    this.refs.hud.show(msg, 1);
                }
            })
        })
    }

    _onApple(info) {
        const {navigation,actions} = this.props;

        if(info.nativeEvent.success) {
            const apple_id = info.nativeEvent.success;
            const that = this;

            actions.passport.appleLogin({
                apple_id: apple_id,
                authorization_code: '',
                identity_token: '',

                resolved: (data) => {

                    actions.passport.token({
                        token: data.token,
                        resolved: (data) => {
                            this._onSwitch();
                        },
                        rejected: (msg) => {
                            that.refs.hud.show('登录失败', 1);
                        }
                    });

                },
                rejected: (msg) => {
                    that.refs.hud.show(msg, 1);
                }
            })

        } else if(info.nativeEvent.error) {
            Alert.alert('苹果登录',info.nativeEvent.error)
        }   
    }

    onCard(card) {
        const {navigation, actions} = this.props;
        const {mobile} = this.state;

        actions.passport.swicthCard({
            phone: mobile,
            cardCode: card.cardCode,
            resolved: (data) => {
                const udata = data;

                actions.passport.token({
                    token: udata.appToken,
                    resolved: (data) => {

                        this.setState({
                            card: false,
                        }, () => {
                            actions.user.user();
                            navigation.goBack();
                        })
                    },
                    rejected: (msg) => {
                        this.refs.hud.show('切换失败', 1);
                    }
                })
            },
            rejected: (msg) => {
                this.refs.hud.show('切换失败', 1);
            }
        })
    }

    onExit() {
        const {actions} = this.props;
        actions.passport.logout({
            resolved: (data) => {
                actions.user.user();
            },
            rejected: (msg) => {

            }
        });
        
        this.setState({
            card: false,
        })
        
    }

    renderCard(item) {
        const card = item.item;
        return (
            <TouchableOpacity style={[styles.p_15, styles.pl_20, styles.pr_20, styles.b_line]} onPress={() => this.onCard(card)}>
                <Text style={[styles.label_blue, styles.label_16]}>{card.realName}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const {navigation} = this.props;
        const {code, mobile, wechat, apple, loginType, card, vcode, isAgree} = this.state;
        

        const enable = isAgree && mobile.length == 11 && code.length == 6;

        const venable = mobile.length == 11;

        return (
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                <View style={styles.container}>
                    <Image source={asset.user.passport.bg} style={[styles.bg]}/>
                    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[{paddingTop: Header.HEIGHT}, styles.p_40]} showsVerticalScrollIndicator={false}>
                        <TouchableOpacity style={[styles.close]} onPress={() => navigation.goBack()}>
                            <Text style={[styles.icon, styles.label_20]}>{iconMap('guanbi')}</Text>
                        </TouchableOpacity>
                        <Image source={asset.user.passport.logo} style={[styles.logo, styles.as_ct]}/>

                        <View style={[styles.mt_40, styles.b_line, styles.p_10]}>
                            <Text style={[styles.label_16]}>手机</Text>
                            <TextInput
                                ref={'mobile'}
                                style={[styles.mt_10]}
                                keyboardType={'phone-pad'}
                                placeholder={'请输入手机号'}
                                value={mobile}
                                maxLength={11}
                                clearButtonMode={'never'}
                                onChangeText={(text) => {
                                    this.setState({mobile:text})
                                    if(text.length==11){
                                        this._onCorp(text);
                                    }
                                }}
                            />
                        </View>
                        <View style={[styles.mt_30, styles.b_line, styles.p_10, styles.row, styles.ai_ct, styles.jc_sb]}>
                            <View>
                                <Text style={[styles.label_16]}>验证码</Text>
                                <TextInput
                                    style={[styles.mt_10, {width: theme.window.width * 0.45}]}
                                    keyboardType={'number-pad'}
                                    placeholder={'请输入6位验证码'}
                                    maxLength={6}
                                    value={code}
                                    clearButtonMode={'never'}
                                    onChangeText={(text) => {this.setState({code:text});}}
                                />
                            </View>
                            <CountDownButton onPress={this._onCode} canSend={venable}  ref={'countdown'}/>
                        </View>

                        <TouchableOpacity style={[styles.bg_orange, styles.circle_20, styles.p_15, styles.mt_40, styles.ai_ct, !enable && styles.disabledContainer]} disabled={!enable} onPress={this._onLogin}>
                            <Text style={[styles.label_white]}>{loginType == 0 ? '登录' : '绑定微信'}</Text>
                        </TouchableOpacity>

                        {1 ? null :
                        <View style={[styles.row, styles.ai_ct, styles.jc_ct, styles.mt_20]}>
                            (apple ?
                            <SignWithApple onClick={(info) => this._onApple(info)} >
                                <Image source={asset.user.passport.apple} style={[styles.oauth_icon]}/>
                            </SignWithApple>
                            : null)
                        </View>}

                        <View style={[styles.jc_ct, styles.ai_ct, styles.mt_30]}>
                            <TouchableOpacity style={[styles.row, styles.ai_ct]} onPress={() => {
                                this.setState({
                                    isAgree: !isAgree,
                                })
                            }}>
                                <Text style={[styles.icon, styles.label_gray, isAgree && styles.label_blue]}>{iconMap(isAgree ? 'checked' : 'uncheck')}</Text>
                                <Text style={[styles.label_gray, styles.ml_5]}>您已阅读并同意</Text>
                            </TouchableOpacity>
                            <View style={[styles.row, styles.mt_10]}>
                                <TouchableOpacity onPress={()=> navigation.navigate('AboutContent', {type: 6})}>
                                    <Text style={[styles.label_blue]}>《用户服务使用协议》</Text>
                                </TouchableOpacity>
                                <Text style={[styles.label_gray]}>和</Text>
                                <TouchableOpacity onPress={()=> navigation.navigate('AboutContent', {type: 1})}>
                                    <Text style={[styles.label_blue]}>《隐私服务》</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>

                    <Modal visible={card} transparent={true} onRequestClose={() => {}}>
                        <TouchableOpacity style={[styles.modal]} onPress={() => this.onExit()}/>
                        <View style={[styles.card, styles.bg_white, styles.circle_5]}>
                            <FlatList
                                contentContainerStyle={[styles.pt_15, styles.pb_15, styles.b_line]}
                                data={global.cards}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) =>  {return index + ''}}
                                renderItem={this.renderCard}
                            />
                            <TouchableOpacity style={[styles.exit]} onPress={() => this.onExit()} hitSlop={{top: 5, left: 5, bottom: 5, right: 5}}>
                                <Text style={[styles.icon]}>{iconMap('guanbi')}</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <HudView ref={'hud'} />
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    logo: {
        width: 144,
        height: 120,
    },
    bg: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        width: theme.window.width,
        height: theme.window.width * 0.248,
    },
    close: {
        position: 'absolute',
        top: Header.HEIGHT - 20,
        right: 40,
    },
    oauth_icon: {
        width: 44,
        height: 44,
    },
    card: {
        position: 'absolute',
        top: theme.window.width * 0.5,
        left: 50,
        right: 50,
    },
    exit: {
        position: 'absolute',
        top: 10,
        right: 10,
    }
});

export const LayoutComponent = Passport;

export function mapStateToProps(state) {
    return {
        
    };
}