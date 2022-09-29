import React, { Component } from 'react';
import { View, Text, Image, Modal, TouchableOpacity, StyleSheet } from 'react-native';

import _ from 'lodash';
import Carousel from 'react-native-looped-carousel';

import theme from '../../config/theme';
import iconMap from '../../config/font';

class GiftView extends Component {

    constructor(props) {
        super(props);

        this.gift = props.gift || [];

        this.state = {
            gift: false,
            gift_id: 0,
            gift_integral: 0,
            user_integral: props.integral || 0,
        }

        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this._onGiftToggle = this._onGiftToggle.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const {integral} = nextProps;

        if (integral !== this.props.integral) {
            this.setState({
                user_integral: integral
            })
        }
    }

    show() {
        this._onGiftToggle();
    }

    hide() {
        this.setState({
            gift: false,
        })
    }

    _onGift(id, integral) {
        if (id == this.state.gift_id) {
            this.setState({
                gift_id: 0,
                gift_integral: 0,
            })
        } else {
            this.setState({
                gift_id: id,
                gift_integral: integral,
            })
        }
    }

    _onGiftToggle() {
        this.setState({
            gift: !this.state.gift
        })
    }

    render() {
        const {style, onSelect, onBuy} = this.props;
        const {gift, gift_id, user_integral, gift_integral} = this.state;

        const gifts = _.chunk(this.gift, 8);

        const reward_enable = user_integral >= gift_integral && gift_id > 0;

        return (
            <Modal visible={gift} transparent={true} onRequestClose={() => {
                this._onGiftToggle();
            }}>
                <TouchableOpacity style={[style, styles.modal]} onPress={this._onGiftToggle}/>
                <View style={[styles.gift_box, styles.bg_white,styles.pt_15]}>
                    <Carousel
                        delay={6000}
                        style={[styles.gift]}
                        autoplay={false}
                        swiper
                        bullets={true}
                        isLooped={false}
                        pageInfo={false} 
                        bulletStyle={styles.gift_dot}
                        chosenBulletStyle={styles.gift_dot_on}
                    >
                        {gifts.map((gitems, i) => {
                            return (
                                <View key={'gitem_' + i} style={[styles.gift, styles.row, styles.wrap]}>
                                    {gitems.map((gift, j) => {
                                        const on = gift.giftId == gift_id;
                                        return (
                                            <TouchableOpacity style={[styles.gift_item, on && styles.gift_item_on, styles.ai_ct, styles.jc_ct]} key={'gift_' + gift.giftId} onPress={() => this._onGift(gift.giftId, gift.integral)}>
                                                <Image source={{uri:gift.giftImg}} style={[styles.gift_icon]} />
                                                <Text style={[styles.sm_label ,styles.c33_label,styles.mt_2]}>{gift.giftName}</Text>
                                                <Text style={[styles.sm_label,styles.tip_label,styles.mt_1]}>{gift.integral}</Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                            )
                        })}
                    </Carousel>
                    <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.pt_5, styles.pb_5, styles.pl_30, styles.pr_20,styles.t_line]}>
                        <View style={[styles.row, styles.ai_ct]}>
                            <Text style={[styles.icon, styles.label_16, styles.label_blue]}>{iconMap('jinbi')}</Text>
                            <Text style={[styles.label_12, styles.ml_10]}>{user_integral >= gift_integral ? user_integral - gift_integral : '积分不足'}</Text>
                        </View>
                        {
                            user_integral >= gift_integral ? 
                            <TouchableOpacity style={[styles.bg_blue, styles.rewardBtn, !reward_enable && styles.disabledContainer]} disabled={!reward_enable} onPress={() => {
                                this._onGiftToggle();
                                onSelect && onSelect(gift_id);
                            }}>
                                <Text style={[styles.label_white ,styles.label_12]}>打赏</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={[styles.bg_blue, styles.rewardBtn]} onPress={() => {
                                //onBuy && onBuy(gift_id);
                            }}>
                                <Text style={[styles.label_white ,styles.label_12]}>获取积分</Text>
                            </TouchableOpacity>
                        }
                        
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    ...theme,
    modal: {
        flex: 1,
    },
    gift_box: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
    },
    gift: {
        width: theme.window.width,
        height: (theme.window.width / 2) * 1,
    },
    gift_dot: {
        backgroundColor: '#C5C5C5',
        width: 6,
        height: 6,
        borderRadius: 3,
        borderColor: '#C5C5C5',
        marginTop: 40,
        marginBottom:5,
        marginLeft:6,
        marginRight:6,
    },
    gift_dot_on: {
        backgroundColor: '#545454',
        width: 6,
        height: 6,
        borderRadius: 3,
        marginTop: 40,
        marginBottom:5,
        marginLeft:6,
        marginRight:6,
    },
    gift_item: {
        width: theme.window.width / 4,
        height: (theme.window.width / 4) * 0.8,
        borderWidth:1,
        borderStyle:'solid',
        borderColor: 'white'
    },
    gift_icon: {
        width: 30,
        height: 30
    },
    gift_item_on: {
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#00A6F6',
    },
    rewardBtn:{
        width:65,
        height:26,
        borderRadius:5,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    }
});

export default GiftView;