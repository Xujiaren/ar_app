//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, View, TouchableOpacity, Image, Text, TextInput, Alert, Modal, KeyboardAvoidingView, Keyboard, StyleSheet } from 'react-native';
import qs from 'query-string';
import { WebView } from 'react-native-webview';

import HudView from '../../../component/base/HudView';
import config from '../../../config/param';
import asset from '../../../config/asset';
import theme from '../../../config/theme';

// create a component
class Lucky extends Component {

    static navigationOptions = {
        title:'翻牌抽奖',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        this.activity = {};
        this.reward = {
            ctype: 0,
            name: '',
            integral: 0,
            img: '',
        };

        this.state = {
            loaded: false,

            rule: false,
            reward: false,
            reward_id: 0,

            name: '',
            mobile: '',
            address: '',
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.onReward = this.onReward.bind(this);
    }

    componentDidMount() {
        this.onRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {navigation} = this.props;
        const {user, address, flop} = nextProps;

        if (flop !== this.props.flop) {
            this.activity = flop.activity;

            this.setState({
                loaded: true,
            })

            if (!(user.lottery > 0 ||  user.integral >= this.activity.integral)){
                Alert.alert('翻牌抽奖', '积分不足', [
                    {text: '确认', onPress: () => {
                        navigation.goBack();
                    }}
                ],{cancelable:false});
            } else {
                Alert.alert('翻牌抽奖', this.activity.integral + '积分兑换一次抽奖', [
                    {text: '确认', onPress: () => {
                        
                    }},
                    {text: '取消', onPress: () => {
                        navigation.goBack();
                    }, style: 'cancel'}
                ]);
            }
        }

        if (address !== this.props.address) {
            if (address.length > 0) {
                let _address = address[0];

                for (let i = 0; i < address.length; i++) {
                    const aitem = address[i];

                    if (aitem.isFirst == 1) {
                        _address = aitem;
                    }
                }

                this.setState({
                    name: _address.realname,
                    mobile: _address.mobile,
                    address: _address.address,
                })
            }
        }
    }

    onRefresh() {
        const {actions} = this.props;
        actions.user.user();
        actions.user.address();
        actions.activity.flop(1);
    }

    onMessage(event) {
        const {navigation, actions} = this.props;
        const msg = event.nativeEvent.data;
        const args = msg.split('&');
        if (args[0] == 'navigation') {
            if (args[1] == 'ActRule') {
                this.setState({
                    rule: true,
                })
            } else if (args[1] == 'FilpCards') {
                navigation.navigate('LuckyRecord');
            }
        } else {
            this.reward = JSON.parse(args[1]);

            actions.activity.lottery({
                activity_id: 1,
                ts: new Date().getTime(),
                index: this.reward.index,
                resolved: (data) => {
                    actions.user.user();
                    this.setState({
                        reward: true,
                        reward_id: data.rewardId,
                    })
                },
                rejected: (msg) => {
                    
                },
            })
        }
    }

    onReward() {
        const {actions} = this.props;
        const {reward_id, name, mobile, address} = this.state;

        if (this.reward.ctype == 0) {
            this.setState({
                reward: false,
            },()=> {
                setTimeout(()=>{
                    this.refs.WebView.reload();
                    this.onRefresh();
                },1000)
            })
        } else {
            actions.activity.lotteryReceive({
                reward_id: reward_id,
                name: name,
                mobile: mobile,
                address: address,
                resolved: (data) => {
                    this.setState({
                        reward: false,
                    },()=> {
                        setTimeout(()=>{
                            this.refs.hud.show('积分领取成功', 1);
                            this.refs.WebView.reload();
                            this.onRefresh();
                        },1000)
                    })
                },
                rejected: (msg) => {
                    this.setState({
                        reward: false
                    },()=>{
                        setTimeout(()=>{
                            this.refs.hud.show('领取失败，联系客服', 1);
                            this.refs.WebView.reload();
                            this.onRefresh();
                        },1000)
                        
                    })
                },
            })
        }
    }

    render() {
        const {user} = this.props;
        const {loaded, rule, reward, name, mobile, address} = this.state;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#00A6F6"/>
            </View>
        )

        const params = {
            v: new Date().getTime(),
            integral: user.integral,
            times: parseInt(user.integral / this.activity.integral),
        }
        
        let enable = true;
        if (this.reward.ctype == 2) {
            enable = name.length > 0 && mobile.length == 11 && address.length > 0;
        }

        return (
            <View style={styles.container}>
                <WebView 
                    ref="WebView"
                    androidHardwareAccelerationDisabled={true}
                    showsVerticalScrollIndicator={false}
                    source={{uri: config.site + 'reward/iapp.html?' + qs.stringify(params)}}
                    onMessage={this.onMessage}
                />
                <Modal visible={rule} transparent={true} onRequestClose={() => {
                    this.setState({rule:false})
                }}>
                    <TouchableOpacity style={[styles.modal]} onPress={()=>this.setState({rule:false})}/>
                    <View style={[styles.rule, styles.bg_white, styles.circle_5]}>
                        <View style={[styles.p_15, styles.b_line]}>
                            <Text style={[styles.label_16, styles.label_center]}>抽奖规则</Text>
                            <Text style={[styles.mt_20]}>
                                <Text>{this.activity.rule}</Text>
                            </Text>
                        </View>
                        <TouchableOpacity style={[styles.p_15, styles.ai_ct]} onPress={() => this.setState({
                                rule: false
                            })}>
                            <Text>关闭</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Modal visible={reward} transparent={true} onRequestClose={() => {
                    Keyboard.dismiss()
                }}>
                    <TouchableOpacity style={[styles.modal]} onPress={()=> Keyboard.dismiss()} activeOpacity={1}/>
                    <View style={[styles.reward, styles.bg_white, styles.circle_5]}>
                        <View style={[styles.p_15, styles.b_line, styles.mt_20]}>
                            {this.reward.ctype == 0 ?
                            <View style={[styles.ai_ct]}>
                                <Image source={asset.base.empty} style={[styles.reward_empty]}/>
                                <Text style={[styles.mt_5, styles.label_18, styles.label_dgray]}>很遗憾，没有中奖。</Text>
                            </View>
                            : null}
                            {this.reward.ctype == 1 ?
                            <View style={[styles.ai_ct]}>
                                <Text style={[styles.label_26]}>恭喜您</Text>
                                <Text style={[styles.label_18, styles.label_dgray, styles.mt_5]}>获得{this.reward.name}</Text>
                                <Image source={asset.user.lucky.integral} style={[styles.reward_empty, styles.mt_15]}/>
                                
                            </View>
                            : null}
                            {this.reward.ctype == 2 ?
                            <View>
                                <View style={[styles.ai_ct]}>
                                    <Text style={[styles.label_26]}>恭喜您</Text>
                                    <Text style={[styles.label_18, styles.label_dgray, styles.mt_5]}>获得{this.reward.name}</Text>
                                    <Image source={{uri: this.reward.img}} style={[styles.reward_empty, styles.mt_15]}/>
                                </View>

                                <Text style={[styles.label_20, styles.mt_15]}>填写地址</Text>
                                <TextInput
                                    style={[styles.mt_15, styles.p_10, styles.bg_l1gray, styles.circle_5]}
                                    placeholder={'姓名'}
                                    value={name}
                                    onChangeText={(text) => {this.setState({name:text});}}
                                />
                                <TextInput
                                    style={[styles.mt_15, styles.p_10, styles.bg_l1gray, styles.circle_5]}
                                    placeholder={'手机'}
                                    value={mobile}
                                    onChangeText={(text) => {this.setState({mobile:text});}}
                                />
                                <TextInput
                                    style={[styles.mt_15, styles.p_10, styles.bg_l1gray, styles.circle_5]}
                                    placeholder={'地址'}
                                    value={address}
                                    onChangeText={(text) => {this.setState({address:text});}}
                                />
                            </View>
                            : null}
                        </View>
                        <TouchableOpacity style={[styles.p_15, styles.ai_ct, styles.bg_blue, !enable && styles.disabledContainer]} disabled={!enable} onPress={this.onReward}>
                            <Text style={[styles.label_white]}>{this.reward.ctype == 2 ? '领取' : '确定'}</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                <HudView ref={'hud'} />
            </View>

        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    reward: {
        position:'absolute',
        top: 120,
        left: 50,
        right: 50,
    },
    reward_empty: {
        width: 130,
        height: 130
    }
});

export const LayoutComponent = Lucky;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        address: state.user.address,
        flop: state.activity.flop,
    };
}