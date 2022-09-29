//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, View, Image, Text, TouchableOpacity, FlatList, Modal, DeviceEventEmitter, Alert, StyleSheet } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Carousel from 'react-native-looped-carousel';

import RankView from '../../component/base/RankView';
import VodPlayer from '../../component/course/VodPlayer';
import Chapter from '../../component/course/Chapter';
import GiftView from '../../component/base/GiftView';
import HtmlView from '../../component/base/HtmlView';
import HudView from '../../component/base/HudView';
import CommentCell from '../../component/base/CommentCell';
import VVodCell from '../../component/course/VVodCell';
import iconMap from '../../config/font';
import asset from '../../config/asset';
import theme from '../../config/theme';

// create a component
class Vod extends Component {

    static navigationOptions = ({ navigation }) => {
        const course = navigation.getParam('course', { courseName: '资源详情', canShare: 1 });
        const fullscreen = navigation.getParam('fullscreen', false);

        return {
            headerShown: !fullscreen,
            title: course.courseName || '资源详情',
            headerRight: () => {
                if (course.canShare == 0) return <View />;

                return (
                    <TouchableOpacity style={[styles.mr_15]} onPress={() => DeviceEventEmitter.emit('share', { type: 'vod', id: course.courseId, title: course.courseName, img: course.courseImg })}>
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
        this.levelId = navigation.getParam('level_id', 0);
        this.planId = navigation.getParam('planId', 0);

        this.gift = [];
        this.comments = [];
        this.related = [];
        this.chapters = [];
        this.coursewareList = [];
        this.sync = 0;

        this.state = {
            loaded: false,
            cy: 0,

            index: 0,
            comment_index: 0,
            currentPage: 0,

            cindex: 0,
            ccindex: 0,
            mediaId: '',
            playUrl: '',
            duration: 0,

            user_integral: 0,

            canReward: true,
            canBuy: true,

            score: false,
            courseScore: 4,
            teacherScore: 4,
            isScore: false,

            preview: false,
            preview_index: 0,
            preview_imgs: [],

            isFollow: false,

            collectNum: 0,
            collect: false,

            like: false,
            likeNum: 0,

            cert: false,
            certList: [],
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.onAction = this.onAction.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.onNext = this.onNext.bind(this);
        this.onSync = this.onSync.bind(this);
        this.onPreview = this.onPreview.bind(this);

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
            this.chapters = course.chapterList;
            this.coursewareList = course.coursewareList;

            this.setState({
                loaded: true,

                canReward: course.canReward == 1,
                canBuy: course.canBuy,
                isScore: course.isScore == 1,

                isFollow: course.teacherId > 0 ? course.teacher.isFollow : false,
                collectNum: course.collectNum,
                collect: course.collect,
                like: course.like,
                likeNum: course.likeNum,
            });
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
        const { isFollow, collect, collectNum, like, likeNum, courseScore, teacherScore } = this.state;

        if (!user.userId) {
            navigation.navigate('Passport');
        } else {
            if (action == 'Score') {
                this.setState({
                    score: true,
                })
            } else if (action == 'PubScore') {

                actions.course.score({
                    course_id: this.course.courseId,
                    score: courseScore,
                    teacher_score: teacherScore,
                    resolved: (data) => {
                        this.refs.hud.show('评分成功', 1);
                        actions.course.info(this.course.courseId);
                        this.setState({
                            score: false,
                            isScore: true,
                        })
                    },
                    rejected: (res) => {
                        this.refs.hud.show('系统错误，请稍后再试。', 1);
                    },
                })

            } else if (action == 'Buy') {
                navigation.navigate('CourseOrder', { course: this.course });
            } else if (action == 'Gift') {
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

            } else if (action == 'Follow') {

                if (isFollow) {
                    actions.user.unfollowTeacher({
                        teacher_id: this.course.teacherId,
                        resolved: (data) => {
                            this.setState({
                                isFollow: false,
                            });

                        },
                        rejected: (res) => {

                        },
                    });
                } else {
                    actions.user.followTeacher({
                        teacher_id: this.course.teacherId,
                        resolved: (data) => {
                            this.setState({
                                isFollow: true,
                            });

                        },
                        rejected: (res) => {

                        },
                    });
                }

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
                    comment_index: args.index
                })
            }
        }
    }

    onPlay() {
        const { actions } = this.props;
        const { canBuy, cindex, ccindex } = this.state;

        if (canBuy) {
            return;
        }

        this.sync = 0;

        if (this.chapters[cindex] && this.chapters[cindex].child[ccindex]) {
            const chapter = this.chapters[cindex].child[ccindex];

            console.info(chapter.coursewarePageStart);

            if (chapter.coursewarePageStart > 0) {
                this.setState({
                    currentPage: chapter.coursewarePageStart,
                }, () => {
                    this._carousel && this._carousel.animateToPage(chapter.coursewarePageStart);
                })

            }



            actions.course.verify({
                media_id: chapter.mediaId,
                resolved: (data) => {
                    this.setState({
                        mediaId: chapter.mediaId,
                        cindex: cindex,
                        ccindex: ccindex,
                        duration: data.duration,
                        playUrl: data.m38u,
                    })
                },
                rejected: (res) => {

                },
            })
        }
    }

    onNext() {
        const { navigation, actions } = this.props;
        let cindex = this.state.cindex;
        let ccindex = this.state.ccindex;

        const chapter = this.chapters[cindex];

        if (ccindex < chapter.child.length - 1) {
            ccindex++;
        } else if (cindex < this.chapters.length - 1) {
            cindex++;
            ccindex = 0;
        } else {
            cindex = 0;
            ccindex = 0;
        }

        this.setState({
            cindex: cindex,
            ccindex: ccindex,
        }, () => {
            if (ccindex === 0 && cindex === 0) {

                if (this.levelId > 0) {
                    actions.course.levelStatus({
                        level_id: this.levelId,
                        resolved: (data) => {
                            if (data.finishStatus == 1) {
                                Alert.alert('学习地图', '恭喜您完成学习', [
                                    {
                                        text: '确认', onPress: () => {
                                            navigation.goBack();
                                        }
                                    }
                                ], { cancelable: false });
                            }
                        },
                        rejected: (res) => {

                        },
                    })
                } else if (this.planId > 0) {
                    actions.study.planStatus({
                        plan_id: this.planId,
                        resolved: (data) => {
                            if (data.isFinish == 1) {
                                this.setState({
                                    cert: true,
                                    certList: data.certDTOList,
                                })
                            }
                        },
                        rejected: (res) => {

                        },
                    })
                } else {
                    Alert.alert('学习资源', '恭喜您完成学习', [
                        {
                            text: '确认', onPress: () => {
                                navigation.goBack();
                            }
                        }
                    ], { cancelable: false });
                }

            } else {
                this.onPlay();
            }
        })
    }

    onSync(duration) {
        const { actions } = this.props;
        const { cindex, ccindex } = this.state;

        if (this.course.chapterList[cindex] && this.course.chapterList[cindex].child[ccindex]) {
            if (this.sync % 16 == 0) {
                actions.user.studySync({
                    levelId: this.levelId,
                    course_id: this.course.courseId,
                    chapter_id: this.course.chapterList[cindex].chapterId,
                    cchapter_id: this.course.chapterList[cindex].child[ccindex].chapterId,
                    duration: duration,
                    resolved: (data) => {

                    },
                    rejected: (res) => {

                    },
                })
            }

            this.sync++;
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
        const { navigation } = this.props;
        const { cindex, ccindex, isFollow, like, likeNum, isScore } = this.state;

        return (
            <View>
                <View style={[styles.p_20, styles.bg_white]}>
                    <Text style={[styles.label_18]} numberOfLines={2}>{this.course.courseName}</Text>
                    <View style={[styles.row, styles.jc_sb, styles.mt_10, styles.ai_ct]}>
                        <RankView value={parseInt(this.course.score)} label={'综合评分' + parseFloat(this.course.score).toFixed(1)} />
                        <View style={[styles.row, styles.ai_ct]}>
                            <TouchableOpacity onPress={() => this.onAction('Like')}>
                                <Text style={[styles.label_gray, styles.label_12, like && styles.label_red]}><Text style={[styles.icon, like && styles.label_red]}>{iconMap(like ? 'dianzan1' : 'dianzan')}</Text> {likeNum}</Text>
                            </TouchableOpacity>
                            {!isScore ?
                                <TouchableOpacity style={[styles.bg_l1gray, styles.circle_5, styles.p_5, styles.ml_10]} onPress={() => this.onAction('Score')}>
                                    <Text style={[styles.label_12, styles.label_blue]}>评分</Text>
                                </TouchableOpacity>
                                : null}
                        </View>
                    </View>
                    <Text style={[styles.label_12, styles.label_gray]}>共 {this.course.chapter} 讲 {this.course.learn}人已学</Text>
                    {this.course.teacherId > 0 ?
                        <View style={[styles.bg_l1gray, styles.p_15, styles.mt_20]}>
                            <View style={[styles.row, styles.jc_sb, styles.ai_ct]}>
                                <View style={[styles.row, styles.ai_ct]}>
                                    <Image source={{ uri: this.course.teacher.teacherImg }} style={[styles.teacher_avatar, styles.bg_l1gray]} />
                                    <Text style={[styles.ml_10]}>{this.course.teacherName}</Text>
                                    <TouchableOpacity style={[styles.teacher_follow, styles.bg_white, isFollow && styles.bg_blue, styles.ml_10]} onPress={() => this.onAction('Follow')}>
                                        <Text style={[styles.label_blue, isFollow && styles.label_white, styles.label_12]}>{isFollow ? '已关注' : '+ 关注'}</Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={() => navigation.navigate('Teacher', { teacher: this.course.teacher })}>
                                    <Text style={[styles.label_gray]}>全部资源<Text style={[styles.icon, styles.label_gray]}>{iconMap('right')}</Text></Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.label_dgray, styles.mt_15]}>{this.course.teacher.content}</Text>
                        </View>
                        : null}
                    <Text style={[styles.label_16, styles.mt_15]}>要点介绍</Text>
                    <HtmlView style={[styles.mt_15]} source={{ html: this.course.content }} />
                </View>
                <Chapter items={this.chapters} cindex={cindex} ccindex={ccindex} style={styles.bg_white} onSelected={(cindex, ccindex) => {
                    this.setState({
                        cindex: cindex,
                        ccindex: ccindex,
                    }, () => {
                        this.onPlay()
                    })
                }} />
                {this.related.length > 0 ?
                    <View style={[styles.bg_white, styles.p_20, styles.mt_15]}>
                        <View style={[styles.row, styles.jc_sb, styles.ai_ct]}>
                            <Text style={[styles.label_16]}>关联资源</Text>
                            <TouchableOpacity style={[styles.row, styles.ai_ct]} onPress={() => navigation.navigate('Related', { course: this.course })}>
                                <Text style={[styles.label_14, styles.label_gray]}>查看全部</Text>
                                <Text style={[styles.icon, styles.label_gray]}>{iconMap('right')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.row, styles.wrap, styles.mt_15]}>
                            {this.related.map((course, index) => {
                                if (index < 4)
                                    return (
                                        <VVodCell style={[styles.vod, (index + 1) % 2 == 1 && styles.mr_10, styles.wid]} course={course} onPress={() => navigation.push('Vod', { course: course })} />
                                    )
                            })}
                        </View>
                    </View> : null}
                <View style={[styles.mt_10, styles.bg_white, styles.p_15, styles.pl_20, styles.pr_20]} onLayout={(e) => {
                    this.setState({
                        cy: e.nativeEvent.layout.y,
                    })
                }}>
                    <Text style={[styles.label_16]}>精选评论 <Text style={[styles.label_gray]}>({this.comments.length})</Text></Text>
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
            <CommentCell comment={comment} onPreview={this.onPreview} onPraise={() => this.onAction('Praise', { index: item.index })} />
        )
    }

    render() {
        const { navigation } = this.props;
        const { loaded, cy, index, currentPage, canReward, canBuy, mediaId, playUrl, duration, user_integral, preview, preview_index, preview_imgs, collect, collectNum, score, courseScore, teacherScore, cert, certList } = this.state;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#00A6F6" />
            </View>
        )

        return (
            <View style={styles.container}>
                <VodPlayer
                    ref={e => { this.player = e; }}
                    source={{
                        cover: this.course.courseImg,
                        key: mediaId,
                        url: playUrl,
                        duration: duration,
                        showProgress: this.course.showProgress,
                        showSpeed: this.course.canDoubleSpeed,
                    }}



                    onProgress={(duration) => {
                        this.onSync(duration);
                    }}

                    onEnd={() => {
                        this.onNext();
                    }}

                    onFullscreen={(full) => {
                        navigation.setParams({ fullscreen: full })
                    }}
                />
                <View style={[styles.row, styles.jc_ad, styles.pt_15, styles.b_line, styles.bg_white]}>
                    <TouchableOpacity style={[styles.ai_ct]} onPress={() => this.setState({
                        index: 0,
                    })}>
                        <Text style={[styles.label_gray, styles.label_default]}>简介</Text>
                        <View style={[styles.dot, styles.mt_5, index == 0 && styles.bg_blue]} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.ai_ct]} onPress={() => this.setState({
                        index: 1,
                    })}>
                        <Text style={[styles.label_gray]}>资料</Text>
                        <View style={[styles.dot, styles.mt_5, index == 1 && styles.bg_blue]} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.ai_ct]} onPress={() => {
                        this.refs.seg && this.refs.seg.scrollToOffset({ offset: cy, animated: true });
                    }}>
                        <Text style={[styles.label_gray]}>评论({this.course.comment})</Text>
                        <View style={[styles.dot, styles.mt_5]} />
                    </TouchableOpacity>
                </View>
                {index == 0 ?
                    <FlatList
                        ref={'seg'}
                        data={this.comments}
                        extraData={this.state}
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
                    :
                    <View style={[styles.f1, styles.ai_ct, styles.jc_ct]}>
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
                    </View>
                }

                <View style={[styles.toolbar, styles.bg_white, styles.row]}>
                    {canReward ?
                        <TouchableOpacity style={[styles.f1, styles.ai_ct, styles.jc_ct]} onPress={() => this.onAction('Gift')}>
                            <Text style={[styles.icon, styles.label_20]}>{iconMap('lihe')}</Text>
                        </TouchableOpacity>
                        : null}
                    <TouchableOpacity style={[styles.f1, styles.ai_ct, styles.jc_ct]} onPress={() => this.onAction('PublishComment')}>
                        <Text style={[styles.icon, styles.label_20]}>{iconMap('xiaoxi')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.f1, styles.ai_ct, styles.jc_ct]} onPress={() => this.onAction('Collect')}>
                        <Text style={[styles.icon, styles.label_20, collect && styles.label_red]}>{iconMap(collect ? 'aixin1' : 'aixin')}</Text>
                        <View style={[styles.count, styles.bg_blue]}>
                            <Text style={[styles.label_9, styles.label_white]}>{collectNum > 99 ? '99+' : collectNum}</Text>
                        </View>
                    </TouchableOpacity>
                    {canBuy ?
                        <View style={[styles.f6, styles.jc_ct, styles.p_5, styles.pl_15, styles.pr_15]}>
                            <TouchableOpacity style={[styles.bg_blue, styles.circle_5, styles.jc_ct, styles.ai_ct, styles.p_10]} onPress={() => this.onAction('Buy')}>
                                <Text style={[styles.label_white]}>购买资源</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={[styles.f6, styles.jc_ct, styles.p_5, styles.pl_15, styles.pr_15]}>
                            <TouchableOpacity style={[styles.bg_blue, styles.circle_5, styles.jc_ct, styles.ai_ct, styles.p_10]} onPress={() => this.onPlay()}>
                                <Text style={[styles.label_white]}>开始学习</Text>
                            </TouchableOpacity>
                        </View>
                    }

                </View>

                <Modal visible={score} transparent={true} onRequestClose={() => {
                    this.setState({ score: false })
                }}>
                    <TouchableOpacity style={[styles.modal]} onPress={() => this.setState({ score: false })} />
                    <View style={[styles.score, styles.bg_white, styles.circle_5, styles.pt_15]}>
                        <View style={[styles.p_15, styles.b_line, styles.ai_ct]}>
                            <View style={[styles.row, styles.ai_ct, styles.p_10]}>
                                <Text style={[styles.label_16, styles.mr_15]}>资源评分</Text>
                                <RankView value={courseScore} onChoose={(value) => {
                                    this.setState({
                                        courseScore: value,
                                    })
                                }} />
                            </View>
                            <View style={[styles.row, styles.ai_ct, styles.p_10]}>
                                <Text style={[styles.label_16, styles.mr_15]}>老师评分</Text>
                                <RankView value={teacherScore} onChoose={(value) => {
                                    this.setState({
                                        teacherScore: value,
                                    })
                                }} />
                            </View>
                        </View>
                        <View style={[styles.row]}>
                            <TouchableOpacity style={[styles.f1, styles.p_15, styles.ai_ct]} onPress={() => this.setState({ score: false })}>
                                <Text style={[styles.label_gray]}>取消</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.f1, styles.p_15, styles.ai_ct, styles.r_line]} onPress={() => this.onAction('PubScore')}>
                                <Text>提交</Text>
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
                    }} />
                </Modal>

                <GiftView gift={this.gift} ref={'gift'} integral={user_integral} onSelect={(gift_id) => {
                    this.onAction('Reward', { gift_id: gift_id })
                }} onBuy={() => navigation.navigate('Recharge')} />

                <Modal visible={cert} transparent={true} onRequestClose={() => {
                    this.setState({
                        cert: false
                    }, () => {
                        navigation.goBack();
                    })
                }}>
                    <TouchableOpacity style={[styles.modal]} onPress={() => {
                        this.setState({
                            cert: false
                        }, () => {
                            navigation.goBack();
                        })
                    }} />
                    <View style={[styles.cert, styles.bg_white, styles.circle_5, styles.p_15]}>
                        <Text style={[styles.label_16, styles.as_ct]}>恭喜您完成学习计划</Text>
                        <View style={[styles.row, styles.ai_ct, styles.jc_ct, styles.mt_15]}>
                            {certList.map((cert, index) => {
                                return (
                                    <View style={[styles.mr_10, styles.row.ai_ct, styles.jc_ct]}>
                                        <View style={[styles.cert_thumb, styles.bg_l1gray, styles.circle_5]} />
                                        <Text style={[styles.mt_5, styles.as_ct]}>xxxx</Text>
                                    </View>
                                )
                            })}
                        </View>
                        <TouchableOpacity style={[styles.p_15, styles.ai_ct, styles.jc_ct, styles.mt_10]} onPress={() => {
                            this.setState({
                                cert: false
                            }, () => {
                                navigation.goBack();
                            })
                        }}>
                            <Text>确定</Text>
                        </TouchableOpacity>
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
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA'
    },
    video: {
        height: theme.window.width * 0.5625
    },
    dot: {
        width: 10,
        height: 4,
    },
    teacher_avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    teacher_follow: {
        padding: 2,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#00A6F6'
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
    score: {
        position: 'absolute',
        top: 250,
        left: 50,
        right: 50,
    },
    cert: {
        position: 'absolute',
        top: 250,
        left: 50,
        right: 50,
    },
    cert_thumb: {
        width: 90,
        height: 75,
    },
    wid: {
        width: '48%',
    }
});

export const LayoutComponent = Vod;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        course: state.course.course,
        comment: state.course.comment,
        gift: state.config.gift,
        related: state.course.related
    };
}