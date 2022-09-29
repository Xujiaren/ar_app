//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, View, Image, Text, TouchableOpacity, FlatList, Modal, DeviceEventEmitter, StyleSheet } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import BackgroundTimer from 'react-native-background-timer';
import Carousel from 'react-native-looped-carousel';

import GiftView from '../../component/base/GiftView';
import HtmlView from '../../component/base/HtmlView';
import HudView from '../../component/base/HudView';
import CommentCell from '../../component/base/CommentCell';
import ArticleCell from '../../component/course/ArticleCell';
import iconMap from '../../config/font';
import asset from '../../config/asset';
import theme from '../../config/theme';

// create a component
class Article extends Component {

    static navigationOptions = ({ navigation }) => {
        const course = navigation.getParam('course', { courseName: '资源详情', canShare: 1 });
        return {
            title: course.courseName || '资源详情',
            headerRight: () => {
                if (course.canShare == 0) return <View />;

                return (
                    <TouchableOpacity style={[styles.mr_15]} onPress={() => DeviceEventEmitter.emit('share', { type: 'article', id: course.courseId, title: course.courseName, img: course.courseImg })}>
                        <Text style={[styles.icon]}>{iconMap('share1')}</Text>
                    </TouchableOpacity>
                )
            }
        }
    };

    constructor(props) {
        super(props);

        const { navigation } = props;
        this.course = navigation.getParam('course', {});
        console.info(this.course);

        this.comments = [];
        this.gift = [];
        this.coursewareList = [];
        this.related = [];
        this.sync = 0;

        this.state = {
            loaded: false,

            index: 0,
            user_integral: 0,

            canReward: true,

            preview: false,
            preview_index: 0,
            preview_imgs: [],

            collectNum: 0,
            collect: false,

            like: false,
            likeNum: 0,

            currentPage: 0,
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.onAction = this.onAction.bind(this);
        this.onPreview = this.onPreview.bind(this);
        this.onSync = this.onSync.bind(this);

        this.renderHeader = this.renderHeader.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focuSub = navigation.addListener('didFocus', (route) => {
            this.onRefresh();
        });
    }

    componentWillUnmount() {
        this.focuSub && this.focuSub.remove();

        if (this.timer) {
            BackgroundTimer.clearInterval(this.timer);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { user, course, comment, gift, related } = nextProps;

        if (user !== this.props.user) {
            this.setState({
                user_integral: user.integral,
            })
        }

        if (course !== this.props.course) {
            this.course = course;
            this.coursewareList = course.coursewareList;

            this.setState({
                loaded: true,
                collectNum: course.collectNum,
                collect: course.collect,
                like: course.like,
                likeNum: course.likeNum,
                canReward: course.canReward == 1,
            }, () => {
                this.timer = BackgroundTimer.setInterval(() => this.onSync(), 1000);
            })
        }
        if (related !== this.props.related) {
            this.related = related
        }
        if (comment !== this.props.comment) {
            this.comments = comment.items;
        }


        if (gift !== this.props.gift) {
            this.gift = gift;
        }
    }

    onRefresh() {
        const { actions } = this.props;

        this.comments = [];

        actions.user.user();
        actions.course.info(this.course.courseId);
        actions.course.comment(this.course.courseId, 2, 0);
        actions.config.gift(0);
        actions.course.getRelated(4, this.course.courseId);
    }

    onAction(action, args) {
        const { navigation, actions, user } = this.props;
        const { collect, collectNum, like, likeNum } = this.state;

        if (!user.userId) {
            navigation.navigate('Passport');
        } else {
            if (action == 'Gift') {
                this.refs.gift.show();
            } else if (action == 'Reward') {
                const gift_id = args.gift_id;

                actions.user.reward({
                    gift_id: gift_id,
                    course_id: this.course.courseId,
                    resolved: (data) => {
                        this.refs.gift.hide();
                        actions.user.user();
                        this.refs.hud.show('打赏成功', 1);
                    },
                    rejected: (res) => {

                    },
                })

            } else if (action == 'Collect') {

                if (collect) {
                    actions.user.uncollect({
                        ctype: 3,
                        content_id: this.course.courseId,
                        resolved: (data) => {
                            this.setState({
                                collect: false,
                                collectNum: collectNum - 1,
                            })
                        },
                        rejected: (msg) => {

                        }
                    })

                } else {
                    actions.user.collect({
                        ctype: 3,
                        content_id: this.course.courseId,
                        resolved: (data) => {
                            this.setState({
                                collect: true,
                                collectNum: collectNum + 1,
                            })
                        },
                        rejected: (msg) => {

                        }
                    })
                }

            } else if (action == 'Like') {

                if (like) {
                    actions.user.unlikeCourse({
                        course_id: this.course.courseId,
                        resolved: (data) => {
                            this.setState({
                                like: false,
                                likeNum: likeNum - 1,
                            })
                        },
                        rejected: (msg) => {

                        }
                    })
                } else {
                    actions.user.likeCourse({
                        course_id: this.course.courseId,
                        resolved: (data) => {
                            this.setState({
                                like: true,
                                likeNum: likeNum + 1,
                            })
                        },
                        rejected: (msg) => {

                        }
                    })
                }

            } else if (action == 'PublishComment') {
                navigation.navigate('PublishComment', { ctype: 3, content_id: this.course.courseId });
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

    onSync() {
        const { actions, user } = this.props;

        this.sync++;
        if (user.userId) {
            actions.user.studySync({
                course_id: this.course.courseId,
                chapter_id: 0,
                cchapter_id: 0,
                duration: this.sync,
                resolved: (data) => {

                },
                rejected: (res) => {

                },
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
        const { like, likeNum, currentPage } = this.state;
        const { navigation } = this.props;
        let html = this.course.content;
        html = html.replace(/<p([^<>]*)>([\s]*)<\/p>/g, '');

        return (
            <View>
                <View style={[styles.bg_white, styles.p_20]}>
                    <Image source={{ uri: this.course.courseImg }} style={[styles.thumb, styles.circle_5, styles.bg_blue]} />
                    <Text style={[styles.label_18, styles.mt_10]}>{this.course.courseName}</Text>
                    <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.mt_20, styles.mb_15]}>
                        <View style={[styles.row, styles.ai_ct]}>
                            {this.course.teacherId > 0 ?
                                <Image source={{ uri: this.course.teacher.teacherImg }} style={[styles.teacher_avatar, styles.mr_10]} />
                                : null}
                            <Text style={[styles.mr_10]}>{this.course.teacherName}</Text>
                            <Text style={[styles.label_12, styles.label_gray]}>{this.course.pubTimeFt}</Text>
                        </View>
                        <TouchableOpacity onPress={() => this.onAction('Like')}>
                            <Text style={[styles.label_gray, styles.label_12, like && styles.label_red]}><Text style={[styles.icon, like && styles.label_red]}>{iconMap(like ? 'dianzan1' : 'dianzan')}</Text> {likeNum}</Text>
                        </TouchableOpacity>
                    </View>
                    <HtmlView source={{ html: html }} />
                </View>
                {this.coursewareList.length > 0 ?
                    <Carousel
                        ref={carousel => { this._carousel = carousel; }}
                        delay={2000}
                        currentPage={currentPage}
                        style={[styles.ware]}
                        pageInfo={true}
                        autoplay={false}

                        onAnimateNextPage={(p) => {
                            this.setState({
                                currentPage: p,
                            })
                        }
                        }>
                        {this.coursewareList.map((ware, index) => {
                            return (
                                <View key={'ware_' + index}>
                                    <Image source={{ uri: ware.fpath }} style={[styles.ware]} />
                                </View>
                            )
                        })}
                    </Carousel>
                    : null}
                {this.related.length > 0 ?
                    <View style={[styles.bg_white, styles.p_20, styles.mt_15]}>
                        <View style={[styles.row, styles.jc_sb, styles.ai_ct]}>
                            <Text style={[styles.label_16]}>关联资源</Text>
                            <TouchableOpacity style={[styles.row, styles.ai_ct]} onPress={() => navigation.navigate('Related', { course: this.course })}>
                                <Text style={[styles.label_14, styles.label_gray]}>查看全部</Text>
                                <Text style={[styles.icon, styles.label_gray]}>{iconMap('right')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.mt_15]}>
                            {this.related.map((course, index) => {
                                if (index < 4)
                                    return (
                                        <ArticleCell ttype={course.ttype} key={'vod_' + index} style={[styles.mt_15]} course={course} onPress={() => navigation.push('Article', { course: course })} />
                                    )
                            })}
                        </View>
                    </View> : null}
                <View style={[styles.mt_10, styles.bg_white, styles.p_15, styles.pl_20, styles.pr_20]}>
                    <Text style={[styles.label_16]}>精选评论 <Text style={[styles.label_gray]}>({this.course.comment})</Text></Text>
                </View>
            </View>
        )
    }

    renderFooter() {
        const { navigation } = this.props;

        return (
            <TouchableOpacity style={[styles.p_15, styles.ai_ct, styles.bg_white]} onPress={() => navigation.navigate('Comment', { ctype: 3, content_id: this.course.courseId, courseName: this.course.courseName })}>
                <Text style={[styles.label_12, styles.label_dgray]}>查看全部评论</Text>
            </TouchableOpacity>
        )
    }

    renderItem(item) {
        const comment = item.item;
        return (
            <CommentCell onPreview={this.onPreview} comment={comment} onPraise={() => this.onAction('Praise', { index: item.index })} />
        )
    }

    render() {
        const { navigation } = this.props;
        const { loaded, canReward, user_integral, preview, preview_index, preview_imgs, collect, collectNum } = this.state;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#00A6F6" />
            </View>
        )

        return (
            <View style={styles.container}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.comments}
                    keyExtractor={(item, index) => { return index + '' }}
                    renderItem={this.renderItem}
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
                    ListEmptyComponent={() => {
                        return (
                            <View style={[styles.ai_ct, styles.jc_ct, styles.mb_15]}>
                                <Image source={asset.base.empty} style={[styles.empty, styles.mt_25]} />
                            </View>
                        )
                    }}
                />
                <View style={[styles.toolbar, styles.bg_white, styles.row]}>
                    <TouchableOpacity style={[styles.f6, styles.jc_ct, styles.p_5, styles.pl_15, styles.pr_15]} onPress={() => this.onAction('PublishComment')}>
                        <View style={[styles.bg_l1gray, styles.circle_5, styles.p_10]}>
                            <Text style={[styles.label_gray]}>写留言，发表看法</Text>
                        </View>
                    </TouchableOpacity>
                    {canReward ?
                        <TouchableOpacity style={[styles.f1, styles.ai_ct, styles.jc_ct]} onPress={() => this.onAction('Gift')}>
                            <Text style={[styles.icon, styles.label_20]}>{iconMap('lihe')}</Text>
                        </TouchableOpacity>
                        : null}
                    <TouchableOpacity style={[styles.f1, styles.ai_ct, styles.jc_ct]} onPress={() => this.onAction('Collect')}>
                        <Text style={[styles.icon, styles.label_20, collect && styles.label_red]}>{iconMap(collect ? 'aixin1' : 'aixin')}</Text>
                        <View style={[styles.count, styles.bg_blue]}>
                            <Text style={[styles.label_9, styles.label_white]}>{collectNum > 99 ? '99+' : collectNum}</Text>
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
                    }} />
                </Modal>

                <GiftView gift={this.gift} ref={'gift'} integral={user_integral} onSelect={(gift_id) => {
                    this.onAction('Reward', { gift_id: gift_id })
                }} onBuy={() => navigation.navigate('Recharge')} />
                <HudView ref={'hud'} />
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
    ware: {
        width: theme.window.width,
        height: theme.window.width * 0.5625,
    },
    toolbar: {
        height: 50,
        borderTopWidth: 1,
        borderTopColor: '#FAFAFA'
    },
    count: {
        position: 'absolute',
        top: 10,
        height: 13,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        right: 8,
        minWidth: 10,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 4,
        paddingRight: 4,
    },
    wid: {
        width: '48%',
    }
});

export const LayoutComponent = Article;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        course: state.course.course,
        comment: state.course.comment,
        gift: state.config.gift,
        related: state.course.related
    };
}