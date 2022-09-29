//import liraries
import React, { Component } from 'react';
import {ActivityIndicator, View, Image, Text, TextInput, TouchableOpacity, Modal, DeviceEventEmitter, StyleSheet } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

import _ from 'lodash';

import RefreshListView, {RefreshState} from '../../component/base/RefreshListView';
import HudView from '../../component/base/HudView';
import iconMap from '../../config/font';
import asset from '../../config/asset';
import theme from '../../config/theme';
import * as tool from '../../util/tool';

// create a component
class Group extends Component {

    static navigationOptions = ({navigation}) => {
        const group = navigation.getParam('group', {title: '打卡社区'});
		return {
            title: group.title,
            headerRight: () => {
                return (
                    <TouchableOpacity style={[styles.mr_15]} onPress={() => DeviceEventEmitter.emit('share', {type: 'group', id: group.activityId, title: group.title, img: group.activityImg})}>
                        <Text style={[styles.icon]}>{iconMap('share1')}</Text>
                    </TouchableOpacity>
                )
            }
		}
	};

    constructor(props) {
        super(props);

        const {navigation} = props;
        this.group = navigation.getParam('group', {});

        this.page = 1;
        this.pages = 1;
        this.total = 0;
        this.items = [];

        this.state = {
            loaded: false,
            isPunch: false,
            canApply: true,
            canPunch: false,
            refreshState: RefreshState.Idle,

            comment_id: 0,
            reply: false,
            reply_content: '',

            index: 0,

            preview: false,
            preview_index: 0,
            preview_imgs: [],

            apply_content: '',
        }
        
        this.onPreview = this.onPreview.bind(this);
        this.onApply = this.onApply.bind(this);
        this.onReply = this.onReply.bind(this);

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);

        this._renderItem = this._renderItem.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
    }

    componentDidMount() {
        const {navigation} = this.props;

        this.focuSub = navigation.addListener('didFocus', (route) => {
            this._onHeaderRefresh();
        })
    }

    componentWillUnmount(){
        this.focuSub && this.focuSub.remove();
    }

    componentWillReceiveProps(nextProps) {
        const {info, comment} = nextProps;

        if (info !== this.props.info && info.activityId) {
            this.group = info;

            this.setState({
                loaded: true,
                isPunch: info.isPunch,
                canApply: info.canApply,
                canPunch: info.canPunch,
            })
        }

        if (comment !== this.props.comment) {
            this.items = this.items.concat(comment.items);
            this.total = comment.total;
            this.pages = comment.pages;
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    _onHeaderRefresh() {
        const {actions} = this.props;
        actions.group.info(this.group.activityId);

        this.page = 1;
        this.pages = 1;
        this.total = 0;
        this.items = [];

        actions.group.comment(this.group.activityId, 0);
        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
        const {actions} = this.props;
        const {type} = this.state;

        if (this.page < this.pages) {
            this.setState({refreshState: RefreshState.FooterRefreshing});
            this.page = this.page + 1;
            actions.group.comment(this.group.activityId, this.page);
        } else {
            this.setState({refreshState: RefreshState.NoMoreData});
        }
    }

    onAction(action, args) {
        const {navigation, actions, user, canPunch} = this.props;


        if (action == 'Praise') {
            let comment = this.items[args.index];

            let likeUserNameList = comment.likeUserNameList;

            _.pull(likeUserNameList, user.nickname);

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
                likeUserNameList.push(user.nickname);

                actions.user.likeComment({
                    comment_id: comment.commentId,
                    resolved: (data) => {
                        
                    },
                    rejected: (msg) => {

                    }
                })
            }

            comment.likeUserNameList = likeUserNameList;

            this.items[args.index] = comment;

            this.setState({
                index: args.index
            })
        }
    }

    onApply() {
        const {navigation, actions} = this.props;
        const {apply_content} = this.state;

        actions.group.apply({
            activity_id: this.group.activityId,
            content: apply_content,
            resolved: (data) => {
                this.refs.hud.show('提交成功!', 1, () => {
                    this.setState({
                        canApply: false,
                        apply_content: '',
                    }, () => navigation.goBack());
                });
            },
            rejected: (msg) => {
                this.refs.hud.show(msg, 1);
            },
        })
    }

    onReply() {
        const {actions} = this.props;
        const {canPunch, comment_id, reply_content} = this.state;
        
        if (canPunch) {
            actions.group.reply({
                comment_id: comment_id,
                content: reply_content,
                resolved: (data) => {
                    
                    this.refs.hud.show('提交成功!', 1, () => {
                        this.setState({
                            reply: false,
                            reply_content: '',
                        }, () => this._onHeaderRefresh());
                    });
                },
                rejected: (msg) => {
                    this.refs.hud.show(msg, 1);
                },
    
            })
        }
        
    }

    onPreview(galleryList, index){

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

    _renderItem(item) {
        const {canPunch} = this.state;
        const comment = item.item;

        return (
            <View style={[styles.pt_10, styles.pb_10]}>
                <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
                    <View style={[styles.row, styles.ai_ct]}>
                        <Image source={{uri: comment.avatar}} style={[styles.avatar, styles.bg_lgray]}/>
                        <Text style={[styles.ml_10]}>{comment.username}</Text>
                    </View>
                    <View style={[styles.row, styles.ai_ct]}>
                        <TouchableOpacity disabled={!canPunch} onPress={() => this.onAction('Praise', {index: item.index})}>
                            <Text style={[styles.icon, comment.like && styles.label_red]}>{iconMap(comment.like ? 'dianzan1' : 'dianzan')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.ml_10]} disabled={!canPunch} onPress={() => this.setState({
                            comment_id: comment.commentId,
                            reply: true,
                        })}>
                            <Text style={[styles.icon]}>{iconMap('reply')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.mt_10, styles.ml_40]}>
                    <View style={[styles.msg, styles.circle_5, styles.p_10]}>
                        <Text>{tool.ts2dt(comment.pubTime)}打卡成功！</Text>
                        <Text style={[styles.label_dgray, styles.mt_10]}>{comment.content}</Text>
                        {comment.galleryList.length > 0 ?
                        <View style={[styles.row, styles.wrap]}>
                            {comment.galleryList.map((gallery, index) => {
                                return (
                                    <TouchableOpacity style={[styles.ml_5, styles.mt_10]} key={'gallery_' + comment.commentId + '_' + index} onPress={() => this.onPreview(comment.galleryList, index)}>
                                        <Image source={{uri: gallery.fpath}} style={[styles.sthumb, styles.bg_l1gray]}/>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                        : null}
                    </View>
                    {comment.likeUserNameList.length > 0 || comment.childList.length > 0 ?
                    <View style={[styles.mt_10, styles.circle_5, styles.bg_lgray, styles.p_10]}>
                        <Text><Text style={[styles.icon]}>{iconMap('dianzan')}</Text> {comment.likeUserNameList.join(',')}</Text>
                        {comment.childList.map((ccomment, index) => {
                            return (
                                <View style={[styles.mt_10]} key={'ccomment_' + ccomment.commentId}>
                                    <Text>{ccomment.username}: {ccomment.content}</Text>
                                </View>
                            )
                        })}
                    </View>
                    : null}
                </View>
                

            </View>
        )
    }

    _renderHeader() {
        const {navigation, user} = this.props;

        return (
            <View>
                <Image source={{uri: this.group.activityImg}} style={[styles.ad]}/>
                <View style={[styles.p_10]}>
                    <Text style={[styles.label_dgray]}>简介：{this.group.content}</Text>
                </View>
                <View style={[styles.pb_15, styles.row, styles.ai_ct, styles.jc_sb, styles.b_line]}>
                    {user.userId == this.group.userId ?
                    <TouchableOpacity style={[styles.btn_blue]} onPress={() => navigation.navigate('GroupMember', {group: this.group})}>
                        <Text style={[styles.label_14, styles.label_blue]}>参与用户</Text>
                    </TouchableOpacity>
                    :
                    <View/>
                    }
                    <Text style={[styles.label_dgray]}>{this.group.commentNum}人打卡</Text>
                </View>
            </View>
        )
    }

    render() {
        const {navigation} = this.props;
        const {loaded, isPunch, canApply, canPunch, preview, preview_index, preview_imgs, apply_content, reply, reply_content} = this.state;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#00A6F6"/>
            </View>
        )

        const enable = canPunch && !isPunch;
        const reply_enable = reply_content.length > 0;

        return (
            <View style={styles.container}>
                <RefreshListView
                    contentContainerStyle={styles.p_20}
                    showsVerticalScrollIndicator={false}
                    data={canPunch ? this.items: []}
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
                <TouchableOpacity style={[styles.bg_blue, styles.circle_5, styles.p_15, styles.m_20, styles.ai_ct, !enable && styles.disabledContainer]} disabled={!enable} onPress={() => navigation.navigate('GroupOn', {group: this.group})}>
                    <Text style={[styles.label_white]}>{canPunch ? '打卡' : '等待审核'}</Text>
                </TouchableOpacity>

                <Modal visible={canApply} transparent={true} onRequestClose={() => {
                    this.setState({
                        canApply:false
                    }, () => navigation.goBack())
                }}>
                    <TouchableOpacity style={[styles.modal]} onPress={() => this.setState({
                        canApply:false
                    }, () => navigation.goBack())}/>

                    <View style={[styles.apply, styles.bg_white, styles.circle_5]}>
                        <View style={[styles.p_20, styles.b_line]}>
                            <Text style={[styles.label_16]}>如果您想要加入活动，需要将向活动发起人发起参与申请。</Text>
                            <TextInput
                                style={[styles.p_10, styles.circle_5, styles.bg_lgray, styles.mt_15]}
                                placeholder={'申请内容 ，非必填。'}
                                value={apply_content}
                                onChangeText={(text) => {this.setState({apply_content:text});}}
                            />
                        </View>
                        <View style={[styles.row]}>
                            <TouchableOpacity style={[styles.f1, styles.p_15, styles.ai_ct, styles.jc_ct]} onPress={() => this.setState({
                                canApply:false
                            }, () => navigation.goBack())}>
                                <Text style={[styles.label_gray]}>取消</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.f1, styles.p_15, styles.ai_ct, styles.jc_ct]} onPress={this.onApply}>
                                <Text>申请</Text>
                            </TouchableOpacity> 
                        </View>
                    </View>
                </Modal>

                <Modal visible={reply} transparent={true} onRequestClose={() => {
                    this.setState({
                        reply: false
                    })
                }}>
                    <TouchableOpacity style={[styles.modal]} onPress={() => this.setState({
                        reply: false
                    })}/>

                    <View style={[styles.apply, styles.bg_white, styles.circle_5]}>
                        <View style={[styles.p_20, styles.b_line]}>
                            <Text>评论</Text>
                            <TextInput
                                style={[styles.p_10, styles.circle_5, styles.bg_lgray, styles.mt_15]}
                                placeholder={'给TA打气加油吧'}
                                value={reply_content}
                                onChangeText={(text) => {this.setState({reply_content:text});}}
                            />
                        </View>
                        <View style={[styles.row]}>
                            <TouchableOpacity style={[styles.f1, styles.p_15, styles.ai_ct, styles.jc_ct]} onPress={() => this.setState({
                                reply: false
                            })}>
                                <Text style={[styles.label_gray]}>取消</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.f1, styles.p_15, styles.ai_ct, styles.jc_ct, !reply_enable && styles.disabledContainer]} onPress={this.onReply} disabled={!reply_enable}>
                                <Text>评论</Text>
                            </TouchableOpacity> 
                        </View>
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

                <HudView ref={'hud'} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ...theme,
    ad: {
        width: theme.window.width - 40,
        height: (theme.window.width - 40) * 0.5625,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    thumb: {
        width: 120,
        height: 70,
    },
    msg: {
        borderWidth: 1,
        borderColor: '#E1E1E1'
    },
    sthumb: {
        width: (theme.window.width - 120) / 3,
        height: 50,
    },
    apply: {
        position: 'absolute',
        top: theme.window.width * 0.8,
        left: 50,
        right: 50,
    }
});

export const LayoutComponent = Group;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        info: state.group.info,
        comment: state.group.comment,
    };
}