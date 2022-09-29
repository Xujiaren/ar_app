//import liraries
import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Text, Modal, StyleSheet } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

import TabView from '../../component/base/TabView';
import RefreshListView, {RefreshState} from '../../component/base/RefreshListView';
import CommentCell from '../../component/base/CommentCell';
import asset from '../../config/asset';
import theme from '../../config/theme';

// create a component
class Comment extends Component {

    static navigationOptions = {
        title:'全部留言',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        const {navigation} = props;
        this.ctype = navigation.getParam('ctype', 3);
        this.content_id = navigation.getParam('content_id', 0);
        this.courseName = navigation.getParam('courseName', '');

        this.comments = [];
        this.total = 0;
        this.page = 1;
        this.pages = 1;

        this.state = {
            index: 0,
            preview:false,
            preview_index:0,
            preview_imgs:[],

            sort: 0,
            refreshState: RefreshState.Idle,
        }

        this.onAction = this.onAction.bind(this);
        this.onSelected = this.onSelected.bind(this);
        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this.onPreview = this.onPreview.bind(this);

        this.renderItem = this.renderItem.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
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
        const {comment, course_comment, news_comment} = nextProps;

        if (comment !== this.props.comment) {
            this.pages = comment.pages;
            this.total = comment.total;
            this.comments = this.comments.concat(comment.items);
        }

        if (course_comment !== this.props.course_comment){
            this.pages = course_comment.pages;
            this.total = course_comment.total;
            this.comments = this.comments.concat(course_comment.items);
        }

        if (news_comment !== this.props.news_comment) {
            this.pages = news_comment.pages;
            this.total = news_comment.total;
            this.comments = this.comments.concat(news_comment.items);
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    onAction(action, args) {
        const {navigation, actions, user} = this.props;

        if (!user.userId) {
            navigation.navigate('Passport');
        } else if (action == 'PublishComment') {
            navigation.navigate('PublishComment', {ctype: this.ctype, content_id: this.content_id});
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

    onSelected(index){
        this.setState({
            sort:index,
        },() => {
            this._onHeaderRefresh();
        });
    }

    _onHeaderRefresh() {
        const {actions} = this.props;
        const {sort} = this.state;

        actions.user.user();
        
        this.comments = [];
        this.total = 0;
		this.page = 1;
        this.pages = 1;
        
        if (this.ctype == 3) {
            actions.course.comment(this.content_id, sort, this.page);
        } else if (this.ctype == 11) {
            actions.news.comment(this.content_id, sort, this.page);
        } else {
            actions.site.comment(this.content_id, this.ctype, sort, this.page);
        }

		this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
		const {actions} = this.props;
        const {sort} = this.state;

		if (this.page < this.pages) {
            this.page++;
			this.setState({refreshState: RefreshState.FooterRefreshing});

			if (this.ctype == 3) {
                actions.course.comment(this.content_id, sort, this.page);
            } else if (this.ctype == 11 || this.ctype == 15) {
                actions.news.comment(this.content_id, sort, this.page);
            } else {
                actions.site.comment(this.content_id, this.ctype, sort, this.page);
            }
		}
		else
		{
			this.setState({refreshState: RefreshState.NoMoreData});
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

    renderHeader() {
        return (
            <View style={[styles.p_15, styles.pl_20, styles.pr_20]}>
                <Text style={[styles.label_16]}>全部评论 <Text style={[styles.label_gray]}>({this.total})</Text></Text>
            </View>
        )
    }

    renderItem(item) {
        const comment = item.item;

        return (
            <CommentCell onPreview={this.onPreview} comment={comment} onPraise={() => this.onAction('Praise', {index: item.index})}/>
        )
    }

    render() {
        const {sort, preview, preview_imgs, preview_index} = this.state;

        return (
            <View style={styles.container}>
                <TabView items={['最新', '最热']} center={true} current={sort} onSelected={this.onSelected}/>
                <RefreshListView
                    showsVerticalScrollIndicator={false}
                    data={this.comments}
                    extraData={this.state}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this.renderItem}
                    refreshState={this.state.refreshState}
                    ListHeaderComponent={this.renderHeader}
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

                <View style={[styles.toolbar, styles.bg_white]}>
                    <TouchableOpacity style={[styles.row, styles.p_5, styles.pl_15, styles.pr_15, styles.jc_ct, styles.ai_ct]} onPress={() => this.onAction('PublishComment')}>
                        <View style={[styles.bg_l1gray, styles.circle_5, styles.p_10, styles.f6]}>
                            <Text style={[styles.label_gray]}>写留言，发表看法</Text>
                        </View>
                        <Text style={[styles.ml_10]}>发送</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

// define your style11s
const styles = StyleSheet.create({
    ...theme,
    toolbar: {
        height: 50,
        borderTopWidth: 1,
        borderTopColor: '#FAFAFA'
    },
});

export const LayoutComponent = Comment;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        comment: state.site.comment,
        course_comment: state.course.comment,
        news_comment: state.news.comment,
    };
}
