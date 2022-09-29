//import liraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, ImageBackground, Modal, FlatList, StyleSheet, Alert } from 'react-native';
import Picker from 'react-native-picker';
import RefreshListView, {RefreshState} from '../../component/base/RefreshListView';
import HudView from '../../component/base/HudView';
import TabView from '../../component/base/TabView';
import asset from '../../config/asset';
import theme from '../../config/theme';
import iconMap from '../../config/font';

// create a component
class UserIntegral extends Component {

    static navigationOptions = {
        title:'我的账户',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        this.page = 0;
        this.pages = 1;
        this.total = 0;
        this.items = [];

        this.state = {
            utype: global.utype,

            type: 0,
            refreshState: RefreshState.Idle,

            scale: 1,

            card: '',
            exchange: false,
            exchange_num: '0',
        }

        this.onExchangeToggle = this.onExchangeToggle.bind(this);
        this.onExchange = this.onExchange.bind(this);
        this.onCard = this.onCard.bind(this);
        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);

        this._renderItem = this._renderItem.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
    }

    componentDidMount() {
        const {navigation, actions} = this.props;
        actions.config.config();

        this.focuSub = navigation.addListener('didFocus', (route) => {
            this._onHeaderRefresh();
        })
    }

    componentWillUnmount(){
        this.focuSub && this.focuSub.remove();
    }

    componentWillReceiveProps(nextProps) {
        const {config, credit, integral, reward, user} = nextProps;

        if (config !== this.props.config) {

            if (global.utype == 0) {
                this.setState({
                    scale: config.anran_beans_provide,
                })
            }
            
        }

        if (credit !== this.props.credit) {
            this.pages = credit.pages;
            this.total = credit.total;
            this.items = this.items.concat(credit.items);
        }
        
        if (integral !== this.props.integral) {
            this.pages = integral.pages;
            this.total = integral.total;
            this.items = this.items.concat(integral.items);
        }

        if (reward !== this.props.reward) {
            this.pages = reward.pages;
            this.total = reward.total;
            this.items = this.items.concat(reward.items);
        }

        if (user !== this.props.user) {
            this.setState({
                card: user.sn,
            })
        } 

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    onExchangeToggle() {
        this.setState({
            exchange: true,
        })
    }

    onCard() {
        const {card} = this.state;

        Picker.init({
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			pickerTitleText: '选择',
            pickerData: global.cardCodes,
            selectedValue: [card],
            onPickerConfirm: pickedValue => {
                const card = pickedValue[0];
                this.setState({
                    card: card
                })
            },
        });

        Picker.show();
    }

    onExchange() {
        const {actions} = this.props;
        const {exchange_num, card} = this.state;

        Picker.hide();

        actions.user.exchange({
            card: card,
            changeBalance: parseInt(exchange_num),
            resolved: (data) => {
                this.setState({
                    exchange: false,
                    exchange_num: '0',
                }, () => {
                    this.refs.hud.show('兑换成功', 1, () => {
                        this._onHeaderRefresh();
                    })
                })
            },
            rejected: (msg) => {
                Alert.alert('兑换提示', msg);
            }
        })
    }

    _onHeaderRefresh() {
        const {actions} = this.props;
        const {type} = this.state;

        this.page = 0;
        this.pages = 1;
        this.total = 0;
        this.items = [];

        actions.user.user();

        if (type == 0) {
            actions.user.integral(type, this.page);
        } else if (type == 1) {
            actions.user.rewardIntegral(1, this.page);
        } else {
            actions.user.credit(this.page);
        }
        

        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
        const {actions} = this.props;
        const {type} = this.state;

        if (this.page < this.pages) {
            this.setState({refreshState: RefreshState.FooterRefreshing});
            this.page = this.page + 1;

            if (type == 0) {
                actions.user.integral(type, this.page);
            } else if (type == 1) {
                actions.user.rewardIntegral(1, this.page);
            } else {
                actions.user.credit(this.page);
            }

        } else {
            this.setState({refreshState: RefreshState.NoMoreData});
        }
    }

    _renderItem(item) {
        const {type} = this.state;
        const log = item.item;

        if (type == 1) {
            return (
                <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.p_20]}>
                    <View style={[styles.log_info]}>
                        <Text>打赏了资源《{log.courseName}》一个{log.giftName}</Text>
                        <Text style={[styles.label_gray, styles.mt_5]}>{log.pubTimeFt}</Text>
                    </View>
                    <Text style={[styles.label_blue]}>-{log.integral}</Text>
                </View>
            )
        }

        return (
            <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.p_20]}>
                <View style={[styles.log_info]}>
                    <Text>{log.etype == 101 ? '兑换' + (global.utype == 0 ? '安豆' : '积分') : (log.etype == 18 ? '学习' : '') + (log.contentName ? log.contentName.replace('课程', '资源') : '')}</Text>
                    <Text style={[styles.label_gray, styles.mt_5]}>{log.pubTimeFt}</Text>
                </View>
                <Text style={[styles.label_blue]}>{(log.itype == 0  ? '+' : '-') + (type == 0 ? log.integral : log.credit)}</Text>
            </View>
        )
    }

    _renderHeader() {
        const {navigation, user} = this.props;
        const {type, utype} = this.state;

        let tabs = ['积分明细', '打赏明细']

        if (utype == 1) {
            tabs.push('学分明细')
        }

        return (
            <View>
                <ImageBackground source={asset.user.balance} style={[styles.m_20, styles.balance, styles.p_20, styles.row, styles.ai_end, styles.jc_sb]}>
                    <View style={[styles.ml_20]}>
                        <Text style={[styles.label_white, styles.label_16]}>积分余额</Text>
                        <Text style={[styles.label_white, styles.label_26, styles.mt_5]}>{user.integral | 0}</Text>
                    </View>
                    {utype == 1 ?
                    <View style={[styles.ml_20]}>
                        <Text style={[styles.label_white, styles.label_16]}>学分</Text>
                        <Text style={[styles.label_white, styles.label_26, styles.mt_5]}>{user.credit | 0}</Text>
                    </View>
                    : null}
                    <View style={[styles.row]}>
                        <TouchableOpacity style={[styles.p_5, styles.pl_15, styles.pr_15, styles.circle_20, styles.exchange_btn]} onPress={this.onExchangeToggle}>
                            <Text style={[styles.label_white]}>兑换</Text>
                        </TouchableOpacity>
                        {1 ? null :
                        <TouchableOpacity style={[styles.ml_10, styles.bg_white, styles.p_5, styles.pl_15, styles.pr_15, styles.circle_20]} onPress={() => navigation.navigate('Recharge')}>
                            <Text style={[styles.label_blue]}>充值</Text>
                        </TouchableOpacity>}
                    </View>
                </ImageBackground>
                <TabView items={tabs} center={true} current={type} onSelected={(index) => {
                    this.setState({
                        type: index
                    }, () => this._onHeaderRefresh());
                }}/>
            </View>
        )
    }

    render() {
        const {user} = this.props;
        const {scale, card, exchange, exchange_num} = this.state;

        const enable = parseInt(exchange_num) > 0 && user.integral >= scale * parseInt(exchange_num);

        return (
            <View style={styles.container}>
                <RefreshListView
                    showsVerticalScrollIndicator={false}
                    data={this.items}
                    extraData={this.state}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this._renderItem}
                    ListHeaderComponent={this._renderHeader}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this._onHeaderRefresh}
                    onFooterRefresh={this._onFooterRefresh}
                    ListEmptyComponent={() => {
                        if (this.state.refreshState == RefreshState.Idle) {
                            return (
                                <View style={[styles.ai_ct, styles.jc_ct]}>
                                    <Image source={asset.base.empty} style={[styles.empty, styles.mt_25]}/>
                                </View>
                            )
                        }

                        return null;
                    }}
                />
                
                <Modal visible={exchange} transparent={true} onRequestClose={() => {
                    this.setState({exchange:false})
                }}>
                    <TouchableOpacity style={[styles.modal]} onPress={()=>this.setState({exchange:false})}/>
                    <View style={[styles.exchange, styles.bg_white, styles.p_20, styles.circle_5]}>
                        <View style={[styles.pb_20, styles.ai_ct, styles.b_line]}>
                            <Text style={[styles.label_16]}>兑换</Text>
                        </View>
                        <View style={[styles.mt_20]}>
                            <Text style={[styles.label_16]}><Text style={[styles.label_gray]}>可用积分:</Text> {user.integral}</Text>
                            {global.cardCodes.length > 1 ?
                            <TouchableOpacity style={[styles.row, styles.ai_ct, styles.jc_sb, styles.mt_20]} onPress={this.onCard}>
                                <Text>卡号</Text>
                                <Text><Text style={[styles.label_blue]}>{card}</Text> <Text style={[styles.icon, styles.label_gray]}>{iconMap('right')}</Text></Text>
                            </TouchableOpacity>
                            : null}
                            <View style={[styles.row, styles.ai_fs, styles.mt_20]}>
                                <Text style={[styles.mt_5]}>兑换</Text>
                                <View style={[styles.ml_10]}>
                                    <TextInput
                                        style={[styles.input, styles.p_5]}
                                        textAlign={'center'}
                                        keyboardType={'numeric'}
                                        value={exchange_num}
                                        onChangeText={(text) => {this.setState({exchange_num:text});}}
                                    />
                                    <Text style={[styles.mt_10]}>消耗 <Text style={[styles.label_blue]}>{exchange_num != '' ? parseInt(exchange_num) * scale : 0}</Text> 积分</Text>
                                </View>
                                <Text style={[styles.mt_5, styles.ml_10, styles]}>{global.utype == 0 ? '安豆' : '积分'}</Text>
                            </View>
                            

                            <TouchableOpacity style={[styles.bg_blue, styles.circle_5, styles.p_15, styles.mt_40, styles.ai_ct, !enable && styles.disabledContainer]} disabled={!enable} onPress={this.onExchange}>
                                <Text style={[styles.label_white]}>提交</Text>
                            </TouchableOpacity>
                        </View>
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
    balance: {
        width: theme.window.width - 40,
        height: (theme.window.width - 40) * 0.447,
    },
    exchange_btn: {
        borderWidth: 2,
        borderColor: 'white',
    },
    exchange: {
        position: 'absolute',
        top: 120,
        left: 50,
        right: 50,
    },
    input: {
        width: 100,
        height: 30,
        borderWidth: 1,
        borderColor: '#999999',
    },
    log_info: {
        width: (theme.window.width - 40) * 0.8,
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

export const LayoutComponent = UserIntegral;

export function mapStateToProps(state) {
    return {
        config: state.config.config,
        user: state.user.user,
        credit: state.user.credit,
        integral: state.user.integral,
        reward: state.user.reward,
    };
}