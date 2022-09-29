//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, View, Text, Image, TouchableOpacity, FlatList, Modal, DeviceEventEmitter, StyleSheet } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

import HtmlView from '../../component/base/HtmlView';
import NewsCell from '../../component/news/NewsCell';
import CommentCell from '../../component/base/CommentCell';

import iconMap from '../../config/font';
import asset from '../../config/asset';
import theme from '../../config/theme';

// create a component
class News extends Component {

    static navigationOptions = ({navigation}) => {
        const news = navigation.getParam('news', {title: '资讯详情', canShare: 1});
        
		return {
            title: news.title  || '资讯详情',
            headerRight: () => {
                if (news.canShare == 0) return <View/>;

                return (
                    <TouchableOpacity style={[styles.mr_15]} onPress={() => DeviceEventEmitter.emit('share', {type: 'news', title: news.title, img: news.articleImg, id: news.articleId})}>
                        <Text style={[styles.icon]}>{iconMap('share1')}</Text>
                    </TouchableOpacity>
                )
            }
		}
	};

    constructor(props) {
        super(props);

        const {navigation} = props;
        this.news = navigation.getParam('news', {});

        this.comments = [];
        this.recomms = [];

        this.state = {
            loaded: false,

            index: 0,

            isCollect: false,
            collectNum: 0,

            preview: false,
            preview_index: 0,
            preview_imgs: [],
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.onAction = this.onAction.bind(this);
        this.onPreview = this.onPreview.bind(this);

        this.renderHeader = this.renderHeader.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    componentDidMount() {
        this.onRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {news, comment, relation} = nextProps;

        if (news !== this.props.news) {
            this.news = news;

            this.setState({
                loaded: true,
                isCollect: news.isCollect,
                collectNum: news.collectNum,
            })
        }

        if (comment !== this.props.comment) {
            this.comments = comment.items;
        }

        if (relation !== this.props.relation) {
            this.recomms = relation;
        }
    }

    onRefresh() {
        const {actions} = this.props;
        actions.news.info(this.news.articleId);
        actions.news.comment(this.news.articleId, 2, 0);
        actions.news.relation(this.news.articleId);
    }

    onAction(action, args) {
        const {navigation, actions, user} = this.props;
        const {isCollect, collectNum} = this.state;

        if (!user.userId) {
            navigation.navigate('Passport');
        } else {
            if (action == 'PublishComment') {
                navigation.navigate('PublishComment', {ctype: 11, content_id: this.news.articleId});
            } else if (action == 'Collect') {
                
                if (isCollect) {
                    actions.user.uncollect({
                        ctype: 11,
                        content_id: this.news.articleId,
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
                        ctype: 11,
                        content_id: this.news.articleId,
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

    renderHeader() {
        let html = this.news.content;
        html = html.replace(/<p([^<>]*)>([\s]*)<\/p>/g, '');

        return (
            <View>
                <View style={[styles.bg_white, styles.p_20]}>
                    <Image source={{uri: this.news.articleImg}} style={[styles.thumb, styles.circle_5, styles.bg_blue]}/>
                    <Text style={[styles.label_18, styles.mt_10]}>{this.news.title}</Text>
                    <Text style={[styles.label_12, styles.label_gray, styles.mt_5, styles.mb_15]}>{this.news.comment}评论 · {this.news.pubTimeFt}</Text>
                    <HtmlView source={{html: html}}/>
                    <Text style={[styles.label_16, styles.mt_15]}>相关推荐</Text>
                    <View style={[styles.mt_15]}>
                        {this.recomms.map((news, index) => {
                            return <NewsCell ttype={index} key={'recomm_' + index} news={news} style={styles.mb_10}/>
                        })}
                    </View>
                </View>
                <View style={[styles.mt_10, styles.bg_white, styles.p_15, styles.pl_20, styles.pr_20]}>
                    <Text style={[styles.label_16]}>精选评论 <Text style={[styles.label_gray]}>({this.news.comment})</Text></Text>
                </View>
            </View>
        )
    }

    renderFooter() {
        const {navigation} = this.props;

        return (
            <TouchableOpacity style={[styles.p_15, styles.ai_ct, styles.bg_white]} onPress={() => navigation.navigate('Comment', {ctype: 11, content_id: this.news.articleId})}>
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
        const {loaded, preview, preview_index, preview_imgs, isCollect, collectNum} = this.state;

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
                <View style={[styles.toolbar, styles.bg_white, styles.row]}>
                    <View style={[styles.f6, styles.jc_ct, styles.p_5, styles.pl_15, styles.pr_15]}>
                        <TouchableOpacity style={[styles.bg_l1gray, styles.circle_5, styles.p_10]} onPress={()=> this.onAction('PublishComment')}>
                            <Text style={[styles.label_gray]}>写留言，发表看法</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={[styles.f1, styles.ai_ct, styles.jc_ct]} onPress={()=> this.onAction('Collect')}>
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
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA'
    },
    thumb: {
        height: 130,
    },
    teacher_avatar: {
        width: 20,
        height: 20,
        borderRadius: 10,
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

export const LayoutComponent = News;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        news: state.news.news,
        comment: state.news.comment,
        relation: state.news.relation,
    };
}