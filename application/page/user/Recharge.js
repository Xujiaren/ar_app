//import liraries
import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Platform, NativeModules, StyleSheet } from 'react-native';
import * as WeChat from 'react-native-wechat-lib';
import Alipay from '@0x5e/react-native-alipay';

import HudView from '../../component/base/HudView';
import iconMap from '../../config/font';
import theme from '../../config/theme';

class Recharge extends Component {

    static navigationOptions = {
        title:'充值',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        this.items = [];

        this.state = {
            package_index: 0,
            pay_index: Platform.OS === 'ios' ? 2 : 0,
            ios: Platform.OS === 'ios',
        }

        this._onRefresh = this._onRefresh.bind(this);
        this._onPay = this._onPay.bind(this);
    }

    componentDidMount() {
        this._onRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {recharge} = nextProps;

        if (recharge !== this.props.recharge) {
            this.items = recharge;
        }
    }

    _onRefresh() {
        const {actions} = this.props;
        actions.config.recharge();
    }

    _onPay() {
        const {navigation, actions} = this.props;
        const {package_index, pay_index} = this.state;

        const goods_id = this.items[package_index].goodsId;
        const goods_sn = this.items[package_index].goodsSn;

        //const pay_index = 0;

        if (pay_index == 0) {
            actions.order.recharge({
                pay_type: 1,
                goods_id: goods_id,
                goods_number: 1,
                remark: '',
                transaction_id: '', 
                payload: '',
                resolved: (data) => {
                    //console.info(data.pay_info);
                    Alipay.pay(data.pay_info).then(res => {
                        console.info(res);
                        const status = parseInt(res.resultStatus);
                        if (status == 9000) {
                            this.refs.hud.show('充值成功。', 1, () => {
                                navigation.goBack();
                            });
                        } else {
                            this.refs.hud.show('充值失败，请重试。', 1);
                        }
                    })
                },
                rejected: (msg) => {
                    
                }
            })
        } else if (pay_index == 1) {
            actions.order.recharge({
                pay_type: 2,
                goods_id: goods_id,
                goods_number: 1,
                remark: '',
                transaction_id: '', 
                payload: '',
                resolved: (data) => {
                    WeChat.pay(data.pay_info).then(res => {
                        this.refs.hud.show('充值成功。', 1, () => {
                            actions.user.user();
                            navigation.goBack();
                        });
                    }).catch(err => {
                        this.refs.hud.show('充值失败，请重试。', 1);
                    })
                },
                rejected: (msg) => {
                    
                }
            })
        } else if (pay_index == 2) {
            const { InAppUtils } = NativeModules;
            InAppUtils.canMakePayments((canMakePayments) => {
                console.info("iap:" + canMakePayments + " product:" + goods_sn);
                if (canMakePayments) {
                    InAppUtils.loadProducts([goods_sn], (error, products) => {
                        if (products) {
                            InAppUtils.purchaseProduct(goods_sn, (error, response) => {
                                if (response && response.transactionReceipt) {

                                    actions.order.recharge({
                                        pay_type: 4,
                                        goods_id: goods_id,
                                        goods_number: 1,
                                        remark: '',
                                        transaction_id: response.transactionIdentifier,
                                        payload: response.transactionReceipt,
                                        resolved: (data) => {
                                            this.refs.hud.show('充值成功。', 1, () => {
                                                actions.user.user();
                                                navigation.goBack();
                                            });
                                        },
                                        rejected: (msg) => {
                                            
                                        }
                                    })

                                } else {
                                    this.refs.hud.show('充值失败，请重试。', 1);
                                }
                            });
                        }
                    });
                }
            });
        }
    }

    render() {
        const {ios, package_index, pay_index} = this.state;

        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={[styles.p_20]}>
                    <Text style={[styles.label_20, styles.ml_10]}>请选择充值套餐</Text>
                    <View style={[styles.row, styles.wrap, styles.mt_10]}>
                        {this.items.map((p, index) => {
                            const on = index == package_index;

                            return (
                                <TouchableOpacity style={[styles.item, on && styles.item_on, styles.ai_ct, styles.jc_ct, styles.m_10]} key={'package_' + index} 
                                onPress={() => this.setState({
                                    package_index: index,
                                })}>
                                    <Text style={[styles.label_16, on && styles.label_blue]}>{p.goodsName}</Text>
                                </TouchableOpacity>
                            )
                        })}
                        
                    </View>

                    <View style={[styles.mt_25, styles.b_line]}/>
                    {!ios ?
                    <View>
                        <TouchableOpacity style={[styles.row, styles.ai_ct, styles.jc_sb, styles.p_10, styles.mt_25]} onPress={()=> this.setState({
                            pay_index: 0,
                        })}>
                            <View style={[styles.row, styles.ai_ct]}>
                                <Text style={[styles.icon, styles.label_18, {color: '#02A9F1'}]}>{iconMap('zhifubaozhifu')}</Text>
                                <Text style={[styles.ml_10]}>支付宝</Text>
                            </View>
                            {pay_index == 0 ?
                            <Text style={[styles.icon, styles.label_blue]}>{iconMap('gouxuan')}</Text>
                            :null}
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.row, styles.ai_ct, styles.jc_sb, styles.p_10]} onPress={()=> this.setState({
                            pay_index: 1,
                        })}>
                            <View style={[styles.row, styles.ai_ct]}>
                                <Text style={[styles.icon, styles.label_18, {color: '#1ABE4D'}]}>{iconMap('weixinzhifu')}</Text>
                                <Text style={[styles.ml_10]}>微信支付</Text>
                            </View>
                            {pay_index == 1 ?
                            <Text style={[styles.icon, styles.label_blue]}>{iconMap('gouxuan')}</Text>
                            :null}
                        </TouchableOpacity>
                    </View>
                    : null}
                    <TouchableOpacity style={[styles.bg_blue, styles.circle_5, styles.p_15, styles.mt_40, styles.ai_ct]} onPress={() => this._onPay()}>
                        <Text style={[styles.label_white]}>充值</Text>
                    </TouchableOpacity>
                </ScrollView>
                <HudView ref={'hud'} />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    item: {
        width: (theme.window.width - 100) / 3,
        height: 50,
        borderWidth: 1,
        borderColor: '#EBEBEB',
        backgroundColor: 'white',
    },
    item_on: {
        borderColor: '#00A6F6',
        backgroundColor: '#F2FBFF',
    }
});

export const LayoutComponent = Recharge;

export function mapStateToProps(state) {
    return {
        recharge: state.config.recharge,
    };
}
