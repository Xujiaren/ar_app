//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, ScrollView, View, Text, Image, TouchableOpacity, FlatList, Modal, DeviceEventEmitter, StyleSheet } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

import VodPlayer from '../../../component/course/VodPlayer';
import CommentCell from '../../../component/base/CommentCell';
import iconMap from '../../../config/font';
import asset from '../../../config/asset';
import theme from '../../../config/theme';

// create a component
class Special extends Component {

    static navigationOptions = ({navigation}) => {
        const special = navigation.getParam('special', {title: '专题详情', canShare: 1});
        const fullscreen = navigation.getParam('fullscreen', false);

		return {
            headerShown: !fullscreen,
            title: special.title || '专题详情',
            headerRight: () => {
                if (special.canShare == 0) return <View/>;

                return (
                    <TouchableOpacity style={[styles.mr_15]} onPress={() => DeviceEventEmitter.emit('share', {type:'special', id: special.articleId, title: special.title, img: special.articleImg})}>
                        <Text style={[styles.icon]}>{iconMap('share1')}</Text>
                    </TouchableOpacity>
                )
            }
		}
	};

    constructor(props) {
        super(props);

        const {navigation} = props;
        this.special = navigation.getParam('special', {});

        this.comments = [];
        this.photos = [];

        this.state = {
            loaded: false,

            index: 0,
            comment_index: 0,

            cover: '',
            mediaId: '',
            playUrl: '',
            duration: 0,

            isCollect: false,

            preview: false,
            preview_index: 0,
            preview_imgs: [],
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.onAction = this.onAction.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.onNext = this.onNext.bind(this);
        this.onPreview = this.onPreview.bind(this);

        this.renderHeader = this.renderHeader.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    componentDidMount() {
        this.onRefresh();
    }
    
    componentWillReceiveProps(nextProps) {
        const {special, comment} = nextProps;

        if (special !== this.props.special) {
            this.special = special;
            this.photos = special.gallery;

            this.setState({
                loaded: true,
                index: 0,
                isCollect: special.isCollect,
                cover: special.articleImg,
            }, () => {
                if (this.photos.length > 0) {
                    this.onPlay(0);
                }
            })
        }

        if (comment !== this.props.comment) {
            this.comments = comment.items;
        }
    }

    onRefresh() {
        const {actions} = this.props;
        actions.news.info(this.special.articleId);
        actions.site.comment(this.special.articleId, 15, 2, 0);
    }

    onAction(action, args) {
        const {navigation, actions, user} = this.props;
        const {isCollect} = this.state;

        if (!user.userId) {
            navigation.navigate('Passport');
        } else {
            if (action == 'PublishComment') {
                navigation.navigate('PublishComment', {ctype: 15, content_id: this.special.articleId});
            } else if (action == 'Collect') {
                
                if (isCollect) {
                    actions.user.uncollect({
                        ctype: 15,
                        content_id: this.special.articleId,
                        resolved: (data) => {
                            this.setState({
                                isCollect: false
                            })
                        },
                        rejected: (msg) => {
    
                        }
                    })

                } else {
                    actions.user.collect({
                        ctype: 15,
                        content_id: this.special.articleId,
                        resolved: (data) => {
                            this.setState({
                                isCollect: true
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
                    comment_index: args.index
                })
            }
        }
    }

    onPlay(index) {
        const {actions} = this.props;
        const video = this.photos[index];

        actions.course.verify({
            media_id: video.link,
            resolved: (data) => {
                this.setState({
                    index: index,
                    cover: video.fpath,
                    mediaId: video.link,
                    duration: data.duration,
                    playUrl: data.m38u,
                })
            },
            rejected: (res) => {
                
            },
        })
    }

    onNext() {
        const {index} = this.state;

        if (index < (this.photos.length - 1)) {
            let nindex = index + 1;

            this.setState({
                index: nindex,
            }, () => {
                this.onPlay(nindex);
            })
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

    renderHeader() {
        const {isCollect} = this.state;

        return (
            <View>
                <View style={[styles.bg_white, styles.p_20]}>
                    <View>
                        <Text style={[styles.label_18]}>{this.special.title}</Text>
                        <Text style={[styles.label_dgray, styles.mt_5]}>{this.special.summary}</Text>
                    </View>
                    <View style={[styles.row, styles.jc_sb, styles.mt_15]}>
                        <View>
                            <Text style={[styles.label_12, styles.label_dgray]}><Text style={[styles.icon]}>{iconMap('hit')}</Text> {this.special.hit}</Text>
                        </View>
                        <TouchableOpacity onPress={() => this.onAction('Collect')}>
                            <Text style={[styles.label_12, styles.label_dgray]}><Text style={[styles.icon, isCollect && styles.label_red]}>{iconMap(isCollect ? 'aixin1' : 'aixin')}</Text> 收藏</Text>
                        </TouchableOpacity>
                        <View>
                            <Text style={[styles.label_12, styles.label_dgray]}><Text style={[styles.icon]}>{iconMap('comment')}</Text> {this.special.comment}</Text>
                        </View>
                        {this.special.canShare == 1 ?
                        <TouchableOpacity onPress={() => DeviceEventEmitter.emit('share', {type:'special', id: this.special.articleId, title: this.special.title, img: this.special.articleImg})}>
                            <Text style={[styles.label_12, styles.label_dgray]}><Text style={[styles.icon]}>{iconMap('share')}</Text> 分享</Text>
                        </TouchableOpacity>
                        : <View/>}
                    </View>
                </View>
                <View style={[styles.mt_10, styles.bg_white, styles.pl_20, styles.pt_15, styles.pb_15]}>
                    <Text style={[styles.label_16]}>选集</Text>
                    <ScrollView style={[styles.mt_10]} horizontal={true} showsHorizontalScrollIndicator={false}>
                        {this.photos.map((photo, index) => {
                            return (
                                <TouchableOpacity style={[styles.mr_15]} key={'photo_' + index} onPress={() => this.onPlay(index)}>
                                    <Image source={{uri: photo.fpath}} style={[styles.photo_thumb, styles.bg_l1gray, styles.circle_5]}/>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
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
            <TouchableOpacity style={[styles.p_15, styles.ai_ct, styles.bg_white]} onPress={() => navigation.navigate('Comment', {ctype: 15, content_id: this.special.articleId})}>
                <Text style={[styles.label_12, styles.label_dgray]}>查看全部评论</Text>
            </TouchableOpacity>
        )
    }

    renderItem(item) {
        const comment = item.item;

        return (
            <CommentCell comment={comment} onPreview={this.onPreview}  onPraise={() => this.onAction('Praise', {index: item.index})}/>
        )
    }

    render() {
        const {navigation} = this.props;
        const {loaded, cover, mediaId, playUrl, duration, preview, preview_index, preview_imgs} = this.state;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#00A6F6"/>
            </View>
        )

        return (
            <View style={styles.container}>
                <VodPlayer
                    ref={e => { this.player = e; }}
                    source={{
                        cover: cover,
                        key: mediaId,
                        url: playUrl,
                        duration: duration,
                    }}

                    onEnd={() => {
                        this.onNext();
                    }}

                    onFullscreen={(full) => {
                        navigation.setParams({fullscreen:full})
                    }}
                />
                <FlatList
                    data={this.comments}
                    extraData={this.state}
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
                <TouchableOpacity style={[styles.toolbar, styles.bg_white, styles.row, styles.p_5, styles.pl_15, styles.pr_15]} onPress={()=> this.onAction('PublishComment')}>
                    <View style={[styles.bg_l1gray, styles.circle_5, styles.p_10, styles.f6]}>
                        <Text style={[styles.label_gray]}>写留言，发表看法</Text>
                    </View>
                    <View style={[styles.ai_ct, styles.jc_ct, styles.ml_10]}>
                        <Text>发送</Text>
                    </View>
                </TouchableOpacity>

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
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA'
    },
    video: {
        height: theme.window.width * 0.5625
    },
    follow: {
        padding: 2,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#00A6F6'
    },
    photo_thumb: {
        width: 120,
        height: 75,
    },
    toolbar: {
        height: 50,
        borderTopWidth: 1,
        borderTopColor: '#FAFAFA'
    },
});

export const LayoutComponent = Special;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        special: state.news.news,
        comment: state.site.comment,
    };
}