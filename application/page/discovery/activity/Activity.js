//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, Image, FlatList, Modal, DeviceEventEmitter, StyleSheet } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import VideoPlayer from 'react-native-video-controls';
import ProgressBar from 'react-native-progress/Bar';

import HtmlView from '../../../component/base/HtmlView';
import HudView from '../../../component/base/HudView';
import CommentCell from '../../../component/base/CommentCell';
import iconMap from '../../../config/font';
import asset from '../../../config/asset';
import theme from '../../../config/theme';
import * as tool from '../../../util/tool';

// create a component
class Activity extends Component {

    static navigationOptions = ({navigation}) => {
        const activity = navigation.getParam('activity', {title: '活动详情'});

		return {
            title: activity.title || '活动详情',
            headerRight: () => {
                return (
                    <TouchableOpacity style={[styles.mr_15]} onPress={() => DeviceEventEmitter.emit('share', {type: 'activity', id: activity.activityId, title: activity.title, img: activity.activityImg + '?x-oss-process=image/format,jpg'})}>
                        <Text style={[styles.icon]}>{iconMap('share1')}</Text>
                    </TouchableOpacity>
                )
            }
		}
	};

    constructor(props) {
        super(props);

        const {navigation} = props;
        this.activity = navigation.getParam('activity', {});

        this.comments = [];
        this.works = [];
        this.topicId = 0;
        this.options = [];

        this.state = {
            loaded: false,

            index: 0,

            follow: 0,
            isFollow: false,
            isFinish: false,
            canApply: false,
            isApply: false,

            canVote: false,

            work_preview: false,
            video_url: '',
            work_index: 0,

            preview: false,
            preview_index: 0,
            preview_imgs: [],
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.onAction = this.onAction.bind(this);
        this.onPreview = this.onPreview.bind(this);
        this.onWorkPreview = this.onWorkPreview.bind(this);

        this.renderHeader = this.renderHeader.bind(this);
        this.renderVote = this.renderVote.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    componentDidMount() {
        const {navigation} = this.props;

        this.focuSub = navigation.addListener('didFocus', (route) => {
            this.onRefresh();
        })
    }

    componentWillUnmount(){
        this.focuSub && this.focuSub.remove();
    }

    componentWillReceiveProps(nextProps) {
        const {info, comment, work} = nextProps;
        if (info !== this.props.info) {
            this.activity = info;

            let canVote = false;

            if (info.topicDTO) {
                this.options = info.topicDTO.optionList;
                this.topicId = info.topicDTO.topicId;
                canVote = info.topicDTO.canVote;
            }
            
            this.setState({
                loaded: true,
                follow: info.follow,
                isFollow: info.isFollow,
                isFinish: info.isFinish,
                canApply: info.canApply,
                isApply: info.isApply,
                canVote: canVote,
            })
        }

        if (work !== this.props.work) {
            this.works = work.items;
        }

        if (comment !== this.props.comment) {
            this.comments = comment.items;
        }
    }

    onRefresh() {
        const {actions} = this.props;
        actions.user.user();
        actions.activity.info(this.activity.activityId);
        actions.activity.work(this.activity.activityId, '', 0);
        actions.site.comment(this.activity.activityId, 2, 2, 0);
    }

    onAction(action, args) {
        const {navigation, actions, user} = this.props;
        const {follow, isFollow} = this.state;

        if (!user.userId) {
            navigation.navigate('Passport');
        } else {
            if (action == 'Join') {
                let page = 'ActivityJoin';

                if (this.activity.atype == 4) {
                    page = 'ActivityPaper';
                }

                navigation.navigate(page, {activity: this.activity});
                
            } else if (action == 'Follow') {

                if (isFollow) {
                    actions.user.unfollowContent({
                        content_id: this.activity.activityId,
                        ctype: 2,
                        resolved: (data) => {
                            this.setState({
                                isFollow: false,
                                follow: follow - 1,
                            })
                        },
                        rejected: (msg) => {
    
                        }
                    })
                } else {
                    actions.user.followContent({
                        content_id: this.activity.activityId,
                        ctype: 2,
                        resolved: (data) => {
                            this.setState({
                                isFollow: true,
                                follow: follow + 1,
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
            } else if (action == 'Vote') {
                const index = args.index;
                let option = this.options[index];
                let answer = {};
                answer[this.topicId] = [option.optionId];
                
                actions.activity.answer({
                    activity_id: this.activity.activityId,
                    answer:  JSON.stringify(answer),
                    resolved: (data) => {
                        this.refs.hud.show('投票成功!', 1);

                        option.num++;
                        option.canVote = false;
                        this.options[index] = option;
                        
                        this.setState({
                            canVote: false,
                        })

                        
                    },
                    rejected: (msg) => {
                        this.refs.hud.show('系统错误!', 1);
                    }
                })
            }
        }
        
    }

    onWorkPreview(url) {
        this.setState({
            work_preview: true,
            video_url: url,
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

    renderVote() {
        const {canVote} = this.state;
        const over = this.activity.astatus == 2;
        

        if (this.activity.ctype == 16) {

            return (
                <View style={[styles.row, styles.wrap]}>
                    {this.options.map((op, index) => {
                        return (
                            <View key={'vote_' + index} style={[styles.work, styles.mr_10, styles.mt_20, styles.bg_l1gray, styles.p_10, styles.circle_5]}>
                                <TouchableOpacity style={[styles.work_thumb]} onPress={() => this.onWorkPreview(op.url)}>
                                    <Image source={{uri: op.url + '?x-oss-process=video/snapshot,t_10000,m_fast'}} style={[styles.work_thumb]}/>
                                    <View style={[styles.ai_ct, styles.jc_ct, styles.video_icon]}>
                                        <Text style={[styles.icon, styles.label_white, styles.label_36]}>{iconMap('bofang')}</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.mt_10]}>
                                    <Text>{op.optionLabel}</Text>
                                    <Text style={[styles.label_blue]}>{op.num}票</Text>
                                </View>
                                <TouchableOpacity style={[styles.p_5, styles.bg_blue, (over || !op.canVote) && styles.bg_gray, styles.circle_5, styles.ai_ct, styles.jc_ct, styles.mt_10]}  disabled={!canVote} onPress={() => this.onAction('Vote', {index: index})}>
                                    <Text style={[styles.label_white]}>{over ? '已结束' : (op.canVote ? '投票' : '已投票')}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                </View>
            )

        } else if (this.activity.ctype == 17) {
            let galleryList = [];
            this.options.map((op, index) => {
                galleryList.push({
                    fpath: op.url,
                })
            });
            return (
                <View style={[styles.row, styles.wrap]}>
                    {this.options.map((op, index) => {
                        return (
                            <View key={'vote_' + index} style={[styles.work, styles.mr_10, styles.mt_20, styles.bg_l1gray, styles.p_10, styles.circle_5]}>
                                <TouchableOpacity style={[styles.work_thumb]} onPress={() => this.onPreview(galleryList, index)}>
                                    <Image source={{uri: op.url}} style={[styles.work_thumb]}/>
                                </TouchableOpacity>
                                <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.mt_10]}>
                                    <Text>{op.optionLabel}</Text>
                                    <Text style={[styles.label_blue]}>{op.num}票</Text>
                                </View>
                                <TouchableOpacity style={[styles.p_5, styles.bg_blue, (over || !op.canVote) && styles.bg_gray, styles.circle_5, styles.ai_ct, styles.jc_ct, styles.mt_10]}  disabled={!canVote} onPress={() => this.onAction('Vote', {index: index})}>
                                    <Text style={[styles.label_white]}>{over ? '已结束' : (op.canVote ? '投票' : '已投票')}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                </View>
            )
        }
        
        return (
            <View>
                {this.options.map((op, index) => {
                    return (
                        <View style={[styles.row, styles.ai_ct,  styles.mt_20]} key={'vote_' + index}>
                            <View style={[styles.f4, styles.pr_15]}>
                                <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
                                    <Text>{op.optionLabel}</Text>
                                    <Text>{op.num}票</Text>
                                </View>
                                <ProgressBar
                                    style={styles.mt_5}
                                    unfilledColor="#E9E9E9"
                                    color="#00A6F6"
                                    borderWidth={0}
                                    width={theme.window.width * 0.7}
                                    progress={this.activity.num > 0 ? parseFloat(op.num / this.activity.num) : 0}
                                />
                            </View>
                            <View style={[styles.f1]}>
                                <TouchableOpacity style={[styles.p_5, styles.bg_blue, (over || !op.canVote) && styles.bg_gray, styles.circle_5, styles.ai_ct, styles.jc_ct]}  disabled={!canVote} onPress={() => this.onAction('Vote', {index: index})}>
                                    <Text style={[styles.label_white]}>{over ? '已结束' : (op.canVote ? '投票' : '已投票')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                })}
            </View>
        );
    }

    renderHeader() {
        const {navigation} = this.props;
        const {follow, isFollow} = this.state;

        let html = this.activity.content;
        html = html.replace(/<p([^<>]*)>([\s]*)<\/p>/g, '');

        const over = this.activity.astatus == 2;
        const is_video = this.activity.ctype == 16;

        return (
            <View>
                <View style={[styles.bg_white, styles.p_20]}>
                    <Image source={{uri: this.activity.activityImg}} style={[styles.thumb, styles.circle_5, styles.bg_l1gray]}/>
                    <Text style={[styles.label_18, styles.mt_10]}>{this.activity.title}</Text>
                    <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
                        <Text style={[styles.label_12, styles.label_gray, styles.mt_5]}>1天前</Text>
                        <TouchableOpacity style={[styles.follow, styles.bg_white, isFollow && styles.bg_blue, styles.ml_10]} onPress={()=> this.onAction('Follow')}>
                            <Text style={[styles.label_blue, isFollow && styles.label_white, styles.label_12]}>{isFollow ? '取消关注' : '+ 关注'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.mb_15, styles.mt_15]}>
                        <Text><Text style={[styles.label_gray]}>活动时间：</Text>{tool.ts2dt(this.activity.beginTime)}-{tool.ts2dt(this.activity.endTime)}</Text>
                        <Text><Text style={[styles.label_gray]}>参加人数：</Text>{this.activity.num}</Text>
                        <Text><Text style={[styles.label_gray]}>关注人数：</Text>{follow}</Text>
                    </View>
                    <HtmlView html={html} />
                    {this.activity.atype == 3 ? this.renderVote() : null}

                    {this.works.length > 0 ?
                    <View style={[styles.mt_20]}>
                        <Text style={[styles.label_20]}>作品展示：</Text>
                        <View style={[styles.row, styles.wrap]}>
                            {this.works.map((work, index) => {
                                let thumb = '';
                                if (work.galleryList && work.galleryList.length > 0) {
                                    thumb = work.galleryList[0].fpath;
                                }
                                return (
                                    <View key={'work_' + index} style={[styles.work, styles.mr_10, styles.mt_20, styles.bg_l1gray, styles.p_10, styles.circle_5]}>
                                        <TouchableOpacity onPress={() => is_video ? this.onWorkPreview(thumb) : this.onPreview(work.galleryList, 0)}>
                                            <Image source={{uri: thumb + (is_video ? "?x-oss-process=video/snapshot,t_10000,m_fast" : "")}} style={[styles.work_thumb]}/>
                                        </TouchableOpacity>
                                        <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.mt_10]}>
                                            <Text>{work.username}</Text>
                                            <Text style={[styles.label_blue]}>{work.number}票</Text>
                                        </View>
                                        <TouchableOpacity style={[styles.p_5, styles.bg_blue, (over || work.isVote) && styles.bg_gray, styles.circle_5, styles.ai_ct, styles.jc_ct, styles.mt_10]}  onPress={() => navigation.navigate('ActivityWork', {activity: this.activity})}>
                                            <Text style={[styles.label_white]}>{over ? '已结束' : (work.isVote ? '已投票' : '投票')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                    : null}
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
            <TouchableOpacity style={[styles.p_15, styles.ai_ct, styles.bg_white]} onPress={() => navigation.navigate('Comment', {ctype: 2, content_id: this.activity.activityId, courseName: this.activity.title})}>
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
        const {loaded, isFinish, isApply, canApply, work_preview, video_url, work_index, preview, preview_imgs, preview_index} = this.state;
        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#00A6F6"/>
            </View>
        )

        const work = this.options.length > 0 ? this.options[work_index] : {};

        return (
            <View style={styles.container}>
                <FlatList
                    showsVerticalScrollIndicator={false}
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
                {this.activity.atype == 4 && this.activity.astatus == 0 && !isFinish ?
                <View style={[styles.toolbar, styles.bg_white, styles.jc_ct, styles.p_5, styles.pl_15, styles.pr_15]}>
                    <TouchableOpacity style={[styles.bg_blue, styles.circle_5, styles.p_10]} onPress={()=> this.onAction('Join')}>
                        <Text style={[styles.label_white, styles.label_center]}>开始问卷</Text>
                    </TouchableOpacity>
                </View>
                : null}

                {this.activity.atype == 2 && this.activity.astatus == 0 && canApply && !isApply ?
                <View style={[styles.toolbar, styles.bg_white, styles.jc_ct, styles.p_5, styles.pl_15, styles.pr_15]}>
                    <TouchableOpacity style={[styles.bg_blue, styles.circle_5, styles.p_10]} onPress={()=> this.onAction('Join')}>
                        <Text style={[styles.label_white, styles.label_center]}>马上参加</Text>
                    </TouchableOpacity>
                </View>
                : null}
                
                <Modal visible={work_preview} transparent={true} onRequestClose={() => {
                    this.setState({
                        work_preview: false,
                    })                    
                }}>
                    <TouchableOpacity style={[styles.modal]} onPress={()=>this.setState({work_preview:false})}/>
                    {this.activity.ctype == 16 ?
                    <View style={[styles.video_preview]}>
                        <VideoPlayer 
                            paused={false}
                            controls={false}
                            disableBack={true}
                            disableFullscreen={true}
                            disableVolume={true} 
                            source={{uri: video_url}} style={[styles.work_preview]}
                        />
                        <TouchableOpacity style={[styles.video_close]} onPress={()=>this.setState({work_preview:false})}>
                            <Text style={[styles.icon]}>{iconMap('guanbi')}</Text>
                        </TouchableOpacity>
                    </View>
                    : null}
                    {this.activity.ctype == 17 ?
                    <View style={[styles.preview]}>
                        <Image source={{uri: work.url}} style={[styles.work_preview]}/>
                    </View>
                    : null}
                </Modal>

                <Modal visible={preview} transparent={true} onRequestClose={() => { 
                    this.setState({
                        preview: false,
                    })
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
    follow: {
        padding: 2,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#00A6F6'
    },
    toolbar: {
        height: 50,
        borderTopWidth: 1,
        borderTopColor: '#FAFAFA'
    },
    work: {
        width: (theme.window.width - 60) / 2,
    },
    work_thumb: {
        width: (theme.window.width - 60) / 2 - 20,
        height: (theme.window.width - 60) / 2 - 20,
    },
    preview: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: (theme.window.height - theme.window.width) / 2,
    },
    video_preview: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    video_close: {
        position: 'absolute',
        top: 80,
        right: 20,
    },
    work_preview: {
        width: theme.window.width,
        height: theme.window.width * 0.5625,
    },
    video_icon: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    }
});

export const LayoutComponent = Activity;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        info: state.activity.info,
        work: state.activity.work,
        comment: state.site.comment,
    };
}