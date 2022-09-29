//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, View, Text, Image, TouchableOpacity, FlatList, Modal, DeviceEventEmitter, StyleSheet } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import * as WeChat from 'react-native-wechat-lib';
import Alipay from '@0x5e/react-native-alipay';

import HtmlView from '../../../component/base/HtmlView';
import CommentCell from '../../../component/base/CommentCell';
import HudView from '../../../component/base/HudView';
import iconMap from '../../../config/font';
import theme from '../../../config/theme';
import asset from '../../../config/asset';
import * as tool from '../../../util/tool';

// create a component
class Squad extends Component {

    static navigationOptions = ({navigation}) => {
        const squad = navigation.getParam('squad', {title: '培训班详情'});

		return {
            title: squad.squadName || '培训班详情',
            headerRight: () => {
                return (
                    <TouchableOpacity style={[styles.mr_15]} onPress={() => DeviceEventEmitter.emit('share', {type: 'squad', id: squad.squadId, squad: squad.squadName, img: squad.squadImg})}>
                        <Text style={[styles.icon]}>{iconMap('share1')}</Text>
                    </TouchableOpacity>
                )
            }
		}
	};

    constructor(props) {
        super(props);

        const {navigation} = props;
        this.squad = navigation.getParam('squad', {});

        this.comments = [];

        this.state = {
            loaded: false,
            pay: false,
            pay_index: 0,
            canApply: false,
            registeryNum: 0,

            index: 0,
            preview: false,
            preview_index: 0,
            preview_imgs: [],
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.onAction = this.onAction.bind(this);
        this.onPreview = this.onPreview.bind(this);
        this.onPay = this.onPay.bind(this);

        this.renderHeader = this.renderHeader.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
    }

    componentDidMount() {
        this.onRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {info} = nextProps;

        if (info !== this.props.info) {
            this.squad = info;
            this.setState({
                loaded: true,
                canApply: info.canApply && info.status == 1,
                registeryNum: info.registeryNum,
            })
        } 
    }

    onRefresh() {
        const {actions} = this.props;
        actions.o2o.info(this.squad.squadId);
    }

    onAction(action, args) {
        const {navigation, actions, user} = this.props;

        let registeryNum = this.state.registeryNum;

        if (!user.userId) {
            navigation.navigate('Passport');
        } else {
            if (action == 'Apply') {

                if (this.squad.price > 0) {
                    this.setState({
                        pay: true,
                    })
                } else {
                    registeryNum++;
                    actions.o2o.apply({
                        squad_id: this.squad.squadId,
                        resolved: (data) => {
                            this.setState({
                                canApply: false,
                                registeryNum: registeryNum,
                            })
                            
                            this.refs.hud.show('报名成功!', 1);
                        },
                        rejected: (msg) => {
                            this.refs.hud.show('系统错误', 1);
                        }
                    })
                }
                
            } else if (action == 'Praise') {
                let comment = this.comments[args.index];

                if (comment.like) {
                    comment.like = false;
                    comment.praise--;

                    actions.user.unlikeComment({
                        comment_id: comment.commentId,
                        resolved: (data) => {

                        },
                        rejected: (msg) => {

                        }
                    })

                } else {
                    comment.like = true;
                    comment.praise++;

                    actions.user.likeComment({
                        comment_id: comment.commentId,
                        resolved: (data) => {

                        },
                        rejected: (msg) => {

                        }
                    })
                }

                this.comments[args.index] = comment;

                this.setState({
                    index: args.index
                })
            }
        }
    }

    onPay() {
        const {actions} = this.props;
        const {pay_index} = this.state;

        let registeryNum = this.state.registeryNum;
        
        this.setState({
            pay: false,
        }, () => {
            actions.o2o.pay({
                squad_id: this.squad.squadId,
                pay_type: pay_index + 1,
                resolved: (data) => {
                    console.info(data);
                    
                    if (pay_index == 0) {
                        Alipay.pay(data.pay_info).then(res => {
                            const status = parseInt(res.resultStatus);
                             if (status == 9000) {
                                 this.refs.hud.show('支付成功。', 1, () => {

                                    registeryNum++;
                                    actions.o2o.apply({
                                        squad_id: this.squad.squadId,
                                        resolved: (data) => {
                                            this.setState({
                                                canApply: false,
                                                registeryNum: registeryNum,
                                            })
                                            
                                            this.refs.hud.show('报名成功!', 1);
                                        },
                                        rejected: (msg) => {
                                            this.refs.hud.show('系统错误', 1);
                                        }
                                    })
                                 });
                             } else {
                                 this.refs.hud.show('支付失败，请重试。', 1);
                             }
                         })
                    } else {
                        WeChat.pay(data.pay_info).then(res => {
                            this.refs.hud.show('支付成功。', 1, () => {
                                registeryNum++;
                                actions.o2o.apply({
                                    squad_id: this.squad.squadId,
                                    resolved: (data) => {
                                        this.setState({
                                            canApply: false,
                                            registeryNum: registeryNum,
                                        })
                                        
                                        this.refs.hud.show('报名成功!', 1);
                                    },
                                    rejected: (msg) => {
                                        this.refs.hud.show('系统错误', 1);
                                    }
                                })
                            });
                        }).catch(err => {
                            this.refs.hud.show('支付失败，请重试。', 1);
                        })
                    }
                },
                rejected: (msg) => {
                    
                }
            })
        })
    }

    onPreview(galleryList, index) {
        let images = [];
        galleryList.map((gallery, i) => {
            images.push({
				url: gallery.fpath,
			});
        });

        this.setState({
            preview: true,
            preview_index: index,
            preview_imgs: images,
        });
    }

    renderHeader() {
        const {registeryNum} = this.state;
        let html = this.squad.content;
        html = html.replace(/<p([^<>]*)>([\s]*)<\/p>/g, '');

        return (
            <View>
                <View style={[styles.bg_white, styles.p_20]}>
                    <Image source={{uri: this.squad.squadImg}} style={[styles.thumb, styles.circle_5, styles.bg_l1gray]}/>
                    <Text style={[styles.label_18, styles.mt_10]}>{this.squad.squadName}</Text>
                    <View style={[styles.mb_15, styles.mt_15]}>
                        <Text><Text style={[styles.label_gray]}>报名时间：</Text>{tool.ts2dt(this.squad.applyBegin)}-{tool.ts2dt(this.squad.applyEnd)}</Text>
                        <Text><Text style={[styles.label_gray]}>活动时间：</Text>{tool.ts2dt(this.squad.beginTime)}-{tool.ts2dt(this.squad.endTime)}</Text>
                        <Text><Text style={[styles.label_gray]}>招生人数：</Text>{this.squad.enrollNum}</Text>
                        <Text><Text style={[styles.label_gray]}>报名人数：</Text>{registeryNum}</Text>
                        <Text><Text style={[styles.label_gray]}>活动地点：</Text>{this.squad.location}</Text>
                    </View>
                    <HtmlView html={html} />
                </View>
                <View style={[styles.mt_10, styles.bg_white, styles.p_15, styles.pl_20, styles.pr_20]}>
                    <Text style={[styles.label_16]}>精选评论 <Text style={[styles.label_gray]}>({this.comments.length})</Text></Text>
                </View>
            </View>
        )
    }

    renderFooter() {
        const {navigation} = this.props;

        return (
            <TouchableOpacity style={[styles.p_15, styles.ai_ct, styles.bg_white]} onPress={() => navigation.navigate('Comment', {ctype: 13, content_id: this.squad.squadId, courseName: this.squad.squadName})}>
                <Text style={[styles.label_12, styles.label_dgray]}>查看全部评论</Text>
            </TouchableOpacity>
        )
    }

    renderItem(item) {
        const comment = item.item;
        return (
            <CommentCell onPreview={this.onPreview} comment={comment}  onPraise={() => this.onAction('Praise', {index: item.index})}/>
        )
    }

    render() {
        const {loaded, canApply, preview, preview_imgs, preview_index, pay, pay_index} = this.state;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#00A6F6"/>
            </View>
        )

        return (
            <View style={styles.container}>
                <FlatList
                    data={this.comments}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this.renderItem}
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
                    ListEmptyComponent={() => {
                        return (
                            <View style={[styles.ai_ct, styles.jc_ct, styles.mb_15]}>
                                <Image source={asset.base.empty} style={[styles.empty, styles.mt_25]}/>
                            </View>
                        )
                    }}
                />

                {this.squad.status == 1 ?
                <View style={[styles.toolbar, styles.bg_white, styles.jc_ct, styles.p_5, styles.pl_15, styles.pr_15]}>
                    <TouchableOpacity style={[styles.bg_blue, styles.circle_5, styles.p_10, !canApply && styles.disabledContainer]} disabled={!canApply} onPress={() => this.onAction('Apply')}>
                        <Text style={[styles.label_white, styles.label_center]}>{canApply ? (this.squad.price > 0 ? '立即报名(¥' + parseFloat(this.squad.price).toFixed(2) + ')' : '免费报名') : '已报名'}</Text>
                    </TouchableOpacity>
                </View>
                : 
                <View style={[styles.toolbar, styles.bg_white, styles.jc_ct, styles.p_5, styles.pl_15, styles.pr_15]}>
                    <View style={[styles.bg_gray, styles.circle_5, styles.p_10]}>
                        <Text style={[styles.label_white, styles.label_center]}>{this.squad.status == 0 ? '即将开启' : '报名已结束'}</Text>
                    </View>
                </View>
                }

                <Modal visible={pay} transparent={true} onRequestClose={() => {
                    this.setState({
                        pay: false,
                    })
                }}>
                    <TouchableOpacity style={[styles.modal]} onPress={() => this.setState({
                        pay: false,
                    })}/>
                    <View style={[styles.pay, styles.overflow_h, styles.p_20, styles.bg_white]}>
                        <TouchableOpacity style={[styles.row, styles.ai_ct, styles.jc_sb, styles.p_10]} onPress={()=> this.setState({
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
                        <TouchableOpacity style={[styles.bg_blue, styles.circle_5, styles.p_10, styles.mt_20 ]} onPress={this.onPay}>
                            <Text style={[styles.label_white, styles.label_center]}>去支付</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                <Modal visible={preview} transparent={true} onRequestClose={() => {
                    this.setState({
                        preview: false,
                    });
                }}>
                    <ImageViewer imageUrls={preview_imgs} index={preview_index} onClick={() => {
						this.setState({
							preview: false,
						});
					}}/>
                </Modal>

                <HudView ref={'hud'}/>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA'
    },
    thumb: {
        height: 130,
    },
    toolbar: {
        height: 50,
        borderTopWidth: 1,
        borderTopColor: '#FAFAFA'
    },
    pay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    }
});

export const LayoutComponent = Squad;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        info: state.o2o.info,
    };
}