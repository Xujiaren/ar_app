//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, View, TouchableOpacity, Image, Text, Modal, DeviceEventEmitter, StyleSheet } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

import RefreshListView, {RefreshState} from '../../component/base/RefreshListView';
import CommentCell from '../../component/base/CommentCell';
import iconMap from '../../config/font';
import asset from '../../config/asset';
import theme from '../../config/theme';
import * as tool from '../../util/tool';

// create a component
class Ask extends Component {

    static navigationOptions = ({navigation}) => {
        const ask = navigation.getParam('ask', {title: '问题详情'});
		return {
            title: ask.title,
            headerRight: () => {
                return (
                    <TouchableOpacity style={[styles.mr_15]} onPress={() => DeviceEventEmitter.emit('share', {type: 'ask', id: ask.askId, title: ask.title, img: (ask.gallery.length > 0 ? ask.gallery[0].fpath : '')})}>
                        <Text style={[styles.icon]}>{iconMap('share1')}</Text>
                    </TouchableOpacity>
                )
            }
		}
    };

    constructor(props) {
        super(props);

        const {navigation} = props;
        this.ask = navigation.getParam('ask', {});

        this.total = 0;
        this.page = 0;
        this.pages = 1;

        this.items = [];

        this.comments = [];

        this.state = {

            loaded: false,
            index: 0,

            isCollect: false,
            collectNum: 0,

            preview: false,
            preview_index: 0,
            preview_imgs: [],

            refreshState: RefreshState.Idle,
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.onAction = this.onAction.bind(this);
        this.onPreview = this.onPreview.bind(this);

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);

        this._renderItem = this._renderItem.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
        this._renderFooter = this._renderFooter.bind(this);
    }

    componentDidMount() {
        this.onRefresh();

        this._onHeaderRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {ask, reply} = nextProps;
        
        if (ask !== this.props.ask) {
            this.ask = ask;
            this.setState({
                loaded: true,
                isCollect: ask.isCollect,
                collectNum: ask.collect,
            })
        }

        if (reply !== this.props.reply) {
            this.items = this.items.concat(reply.items);
            this.total = reply.total;
            this.pages = reply.pages;
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    onRefresh() {
        const {actions} = this.props;
        actions.ask.info(this.ask.askId);
        actions.site.comment(this.ask.askId, 10, 2, 0);
    }

    onAction(action, args) {
        const {navigation, actions, user} = this.props;
        const {isCollect, collectNum} = this.state;

        if (!user.userId) {
            navigation.navigate('Passport');
        } else {
            if (action == 'PublishComment') {
                navigation.navigate('PublishComment', {ctype: 10, content_id: this.ask.askId});
            } else if (action == 'Collect') {
                
                if (isCollect) {
                    actions.user.uncollect({
                        ctype: 10,
                        content_id: this.ask.askId,
                        resolved: (data) => {
                            this.setState({
                                isCollect: false,
                                collectNum: collectNum - 1,
                            })
                        },
                        rejected: (msg) => {
    
                        }
                    })

                } else {
                    actions.user.collect({
                        ctype: 10,
                        content_id: this.ask.askId,
                        resolved: (data) => {
                            this.setState({
                                isCollect: true,
                                collectNum: collectNum + 1,
                            })
                        },
                        rejected: (msg) => {
    
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

    _onHeaderRefresh() {
        const {actions} = this.props;

        this.total = 0;
        this.page = 0;
        this.pages = 1;

        this.items = [];

        actions.ask.reply(this.ask.askId, 0);
        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
        const {actions} = this.props;

        if (this.page < this.pages) {
            this.setState({refreshState: RefreshState.FooterRefreshing});
            this.page = this.page + 1;
            actions.ask.reply(this.ask.askId, this.page);
        } else {
            this.setState({refreshState: RefreshState.NoMoreData});
        }
    }

    _renderItem(item) {
        const reply = item.item;

        return (
            <View style={[styles.p_20, styles.b_line]}>
                <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
                    <View style={[styles.row, styles.ai_ct]}>
                        <Image source={{uri: reply.avatar}} style={[styles.avatar, styles.bg_l1gray]}/>
                        <Text style={[styles.ml_5]}>{reply.nickname}</Text>
                    </View>
                    <Text style={[styles.label_gray]}>{tool.ts2dt(reply.pubTime)}</Text>
                </View>
                <Text style={[styles.mt_10]}>{reply.content}</Text>
            </View>
        )
    }

    _renderHeader() {
        const {navigation} = this.props;
        return (
            <View>
                <View style={[styles.p_20]}>
                    <Text style={[styles.label_16]}>{this.ask.title}</Text>
                    <View style={[styles.row, styles.ai_ct, styles.mt_15]}>
                        <Image source={{uri: this.ask.avatar}} style={[styles.avatar, styles.bg_l1gray]}/>
                        <Text style={[styles.ml_5]}>{this.ask.nickname}</Text>
                    </View>
                    <Text style={[styles.mt_10]}>{this.ask.content}</Text>
                    {this.ask.gallery.length > 0 ?
                    <Image source={{uri: this.ask.gallery[0].fpath}} style={[styles.thumb, styles.bg_l1gray, styles.circle_5, styles.mt_15]}/>
                    : null}
                    <Text style={[styles.label_gray, styles.label_12, styles.mt_10]}>{this.ask.hit} 热度 {this.ask.replyNum} 问答 {this.ask.comment} 评论</Text>
                </View>
                <View style={[styles.row, styles.t_line, styles.b_line]}>
                    <TouchableOpacity style={[styles.f1, styles.r_line, styles.p_10, styles.ai_ct]} onPress={() => navigation.navigate('InviteAsk', {ask: this.ask})}>
                        <Text style={[styles.label_blue]}><Text style={[styles.icon, styles.label_blue]}>{iconMap('invite')}</Text> 邀请回答</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.f1, styles.p_10, styles.ai_ct]} onPress={() => navigation.navigate('ReplyAsk', {ask: this.ask})}>
                        <Text style={[styles.label_blue]}><Text style={[styles.icon, styles.label_blue]}>{iconMap('account')}</Text> 写回答</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    _renderFooter() {
        const {navigation} = this.props;

        return (
            <View>
                <View style={[styles.p_20]}>
                    <Text style={[styles.label_16]}>精选评论 <Text style={[styles.label_gray]}>({this.comments.length})</Text></Text>
                </View>

                {this.comments.map((comment, index) => {
                    return (
                        <CommentCell key={'comment_' + index} onPreview={this.onPreview} comment={comment}  onPraise={() => this.onAction('Praise', {index: index})}/>
                    )
                })}

                <TouchableOpacity style={[styles.p_15, styles.ai_ct, styles.bg_white]} onPress={() => navigation.navigate('Comment', {ctype: 10, content_id: this.ask.askId})}>
                    <Text style={[styles.label_12, styles.label_dgray]}>查看全部评论</Text>
                </TouchableOpacity>
            </View>
        )
    }
    
    render() {
        const {loaded, isCollect, collectNum, preview, preview_index, preview_imgs} = this.state;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#00A6F6"/>
            </View>
        )

        return (
            <View style={styles.container}>
                <RefreshListView
                    showsVerticalScrollIndicator={false}
                    data={this.items}
                    extraData={this.state}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this._renderItem}
                    ListHeaderComponent={this._renderHeader}
                    ListFooterComponent={this._renderFooter}
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
                <View style={[styles.toolbar, styles.bg_white, styles.row]}>
                    <TouchableOpacity style={[styles.f9, styles.jc_ct, styles.p_5, styles.pl_15, styles.pr_15]} onPress={()=> this.onAction('PublishComment')}>
                        <View style={[styles.bg_l1gray, styles.circle_5, styles.p_10]}>
                            <Text style={[styles.label_gray]}>写留言，发表看法</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.f1, styles.ai_ct, styles.jc_ct]} onPress={() => this.onAction('Collect')}>
                        <Text style={[styles.icon, styles.label_20, isCollect && styles.label_red]}>{iconMap(isCollect ? 'aixin1' : 'aixin')}</Text>
                        <View style={[styles.count, styles.bg_blue]}>
                            <Text style={[styles.label_9 ,styles.label_white]}>{collectNum > 99 ? '99+' : collectNum}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

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
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    avatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
    },
    thumb: {
        height: 125,
    },
    toolbar: {
        height: 50,
        borderTopWidth: 1,
        borderTopColor: '#FAFAFA'
    },
    count:{
        position:'absolute',
        top:10,
        height:13,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        right:8,
        minWidth:10,
        paddingTop:0,
        paddingBottom:0,
        paddingLeft:4,
        paddingRight:4,
    },
});

export const LayoutComponent = Ask;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        ask: state.ask.ask,
        reply: state.ask.reply,
    };
}
