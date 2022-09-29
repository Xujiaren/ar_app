//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, FlatList, TextInput, Platform, KeyboardAvoidingView, Keyboard, Modal, DeviceEventEmitter, SafeAreaView, StyleSheet } from 'react-native';
import { Header } from 'react-navigation-stack';
import ImageViewer from 'react-native-image-zoom-viewer';
import ImagePicker from 'react-native-image-picker';
import BackgroundTimer from 'react-native-background-timer';

import _ from 'lodash';
import qs from 'query-string';

import TabView from '../../component/base/TabView';
import GiftView from '../../component/base/GiftView';
import {Emoji} from '../../component/base/emoji';
import HudView from '../../component/base/HudView';
import RankView from '../../component/base/RankView';

import LivePlayer from '../../component/course/LivePlayer';
import LiveShop from '../../component/course/LiveShop';
import LiveMsg from '../../component/course/LiveMsg';
import LiveGift from '../../component/course/LiveGift'

import config from '../../config/param';
import iconMap from '../../config/font';
import asset from '../../config/asset';
import theme from '../../config/theme';
import {textToEmoji} from '../../util/emoji'

const options = {
    title: '选择照片',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '从相册选择',
    cameraType: 'back', // 'front' or 'back'
    mediaType: 'photo', // 'photo' or 'video'
    // maxWidth: 1280, // photos only
    // maxHeight: 1280, // photos only
    aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
    aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
    quality: 0.1, // 0 to 1, photos only
    angle: 0, // android only, photos only
    allowsEditing: false, // Built in functionality to resize/reposition the image after selection  原图 不裁剪
    noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
};

// create a component
class Live extends Component {

    static navigationOptions = ({navigation}) => {
        const course = navigation.getParam('course', {courseName: '资源详情', canShare: 1});
        const fullscreen = navigation.getParam('fullscreen', false);

		return {
            headerShown: !fullscreen,
            title: course.courseName || '资源详情',
            headerRight: () => {
                if (course.canShare == 0) return <View/>;
                
                return (
                    <TouchableOpacity style={[styles.mr_15]} onPress={() => DeviceEventEmitter.emit('share', {type: 'live', id: course.courseId, title: course.courseName, img: course.courseImg})}>
                        <Text style={[styles.icon]}>{iconMap('share1')}</Text>
                    </TouchableOpacity>
                )
            }
		}
	};

    constructor(props) {
        super(props);

        this.ws = null;
        this.focuSub = null;
        this.ts = parseInt(new Date().getTime() / 1000);

        const {navigation} = props;
        this.course = navigation.getParam('course', {});

        this.gift = [];
        this.giftMap = {};

        this.goods = {};
        this.goods_list = [];
        this.goodsMap = {};

        this.aitems = [];
        this.items = [];

        this.state = {
            loaded: false,

            index: 0,

            totalCount: 0,
            liveStatus: 0,
            roomStatus: 0,

            book: false,
            bookNum: 0,

            canReward: true,
            canBuy:true,

            collectNum: 0,
            collect: false,

            user_integral: 0,
            
            preview: false,
            preview_index: 0,
            preview_imgs: [],

            gift: false,
            emoji: false,
            id: '',
            content: '',

            score: false,
            courseScore: 4,
            teacherScore: 4,
            canScore: false,
            isScore: false,

            shop: false,
            card: false,
            sku: '',
            goodsLink: '',
            token: '',

            keyboardSpace: 0,
            isKeyboardOpened: false,
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.onAction = this.onAction.bind(this);
        this.onWs = this.onWs.bind(this);
        this.parseMsg = this.parseMsg.bind(this);

        this.onShop = this.onShop.bind(this);
        this.onJump = this.onJump.bind(this);
        this.onGiftToggle = this.onGiftToggle.bind(this);
        this.onPubPic = this.onPubPic.bind(this);
        this.onPub = this.onPub.bind(this);

        this._updateKeyboardSpace = this._updateKeyboardSpace.bind(this);
        this._resetKeyboardSpace = this._resetKeyboardSpace.bind(this);

        this.renderItem = this.renderItem.bind(this);
        this.renderMsg = this.renderMsg.bind(this);

        this.onShopToggle = this.onShopToggle.bind(this);
        this.renderGoods = this.renderGoods.bind(this);

        this.renderCard = this.renderCard.bind(this);
        this.onCard = this.onCard.bind(this);
    }

    componentDidMount() {
        const {navigation} = this.props;

        this.focuSub = navigation.addListener('didFocus', (route) => {
            this.onRefresh();
        });

        const updateListener = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
        const resetListener = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';

        this._listeners = [
                Keyboard.addListener(updateListener, this._updateKeyboardSpace),
                Keyboard.addListener(resetListener, this._resetKeyboardSpace)
        ];
    }

    componentWillUnmount() {
        const {user, actions} = this.props;

        if (user.userId) {
            actions.course.stat({
                course_id: this.course.courseId,
                duration: parseInt(new Date().getTime() / 1000) - this.ts,
                resolved: (data) => {
    
                },
                rejected: (res) => {
    
                },
            })
        }

        this.focuSub && this.focuSub.remove();
        this.ws && this.ws.close();
    }

    componentWillReceiveProps(nextProps) {
        const {actions} = this.props;
        const {user, course, goods, gift} = nextProps;

        if (course !== this.props.course) {

            this.course = course;
            this.ts = parseInt(new Date().getTime() / 1000);

            this.setState({
                loaded: true,

                totalCount: course.onlineNum,
                liveStatus: course.liveStatus,
                roomStatus: course.roomStatus,

                bookNum: course.bookNum,
                book: course.book,

                canReward: course.canReward == 1,
                canBuy: course.canBuy,
                isScore: course.isScore == 1,

                collectNum: course.collectNum,
                collect: course.collect,

            })
        }

        if (goods !== this.props.goods) {
            this.goods_list = goods;
            let goodsMap = {};
            goods.map((g, index) => {
                goodsMap[g.goodsId] = g;
            });

            this.goodsMap = goodsMap;
        }

        if (gift !== this.props.gift) {
            this.gift = gift;

            let giftMap = {};
            gift.map((g, index) => {
                giftMap[g.giftId] = g;
            })

            this.giftMap = giftMap;
        }

        if (user !== this.props.user) {
            if (user.userId) {
                if (global.fromuid > 0) {
                    actions.user.share({
                        from_uid: global.fromuid,
                        ctype: 3,
                        content_id: this.course.courseId,
                        resolved: (data) => {

                        },
                        rejected: (msg) => {
                            
                        }
                    })
                }

                if (_.indexOf(global.scores, this.course.courseId) >= 0 && !this.state.isScore) {
                    this.setState({
                        canScore: true,
                    })
                }

                if (!this.state.isScore) {
                    BackgroundTimer.setTimeout(() => {
                        this.setState({
                            score: true,
                            canScore: true,
                        })
                        
                        global.scores.push(this.course.courseId);
                    }, 1000 * 60 * 10);
                }
                

                this.onWs(user);

                this.setState({
                    token: user.arToken,
                    user_integral: user.integral,
                })
            }
        }
    }

    onRefresh() {
        const {actions} = this.props;
        actions.config.config();
        actions.config.gift(1);
        actions.course.info(this.course.courseId);
        actions.course.goods(this.course.courseId);
        actions.user.user();
    }

    onAction(action, args) {
        const {navigation, actions, user} = this.props;
        const {emoji, content, collect, collectNum, book, bookNum, courseScore, teacherScore} = this.state;

        if (!user.userId) {
            navigation.navigate('Passport');
        } else {
            if (action == 'Buy') {
                navigation.navigate('CourseOrder', {course: this.course});
            } else if (action == 'Gift') {
                this.onGiftToggle();
            } else if (action == 'Reward') {
                const gift_id = args.gift_id;

                actions.user.reward({
                    gift_id: gift_id,
                    course_id: this.course.courseId,
                    resolved: (data) => {
                        this.refs.gift && this.refs.gift.hide();
                        actions.user.user();
                        this.onPub('gift', user.nickname + '&' + gift_id);
                    },
                    rejected: (res) => {

                    },
                })

            } else if (action == 'PubPic') {
                Keyboard.dismiss();
                this.onPubPic();
            } else if (action == 'Pub') {
                if (emoji) {
                    this.refs.emoji && this.refs.emoji.hide();
                }

                this.onPub('text', content);

            } else if (action == 'Emoji') {
                Keyboard.dismiss();
                if (emoji) {
                    this.refs.emoji && this.refs.emoji.hide();
                } else {
                    this.refs.emoji && this.refs.emoji.show();
                }

                this.setState({
                    emoji: !emoji,
                })
            } else if (action == 'PubScore') {

                actions.course.score({
                    course_id: this.course.courseId,
                    score: courseScore,
                    teacher_score: teacherScore,
                    resolved: (data) => {
                        this.refs.hud.show('评分成功', 1);
                        this.setState({
                            score: false,
                            isScore: true,
                        })
                    },
                    rejected: (res) => {
                        this.refs.hud.show('系统错误，请稍后再试。', 1);
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

            } else if (action == 'Book') {

                if (book) {
                    actions.user.unbook({
                        course_id: this.course.courseId,
                        resolved: (data) => {
                            this.setState({
                                book: false,
                                bookNum: bookNum - 1,
                            })
                        },
                        rejected: (msg) => {
        
                        }
                    })
                } else {
                    actions.user.book({
                        course_id: this.course.courseId,
                        resolved: (data) => {
                            this.setState({
                                book: true,
                                bookNum: bookNum + 1,
                            })
                        },
                        rejected: (msg) => {
        
                        }
                    })
                }
                
            }
        }
    }

    onShopToggle() {
        this.setState({
            shop: !this.state.shop,
        })
    }

    onShop(goods) {
        if (global.cardCodes.length > 1) {
            this.setState({
                shop: false,
                card: true,
                sku: goods.sku,
                goodsLink: goods.goodsLink,
            })
        } else {
            this.setState({
                shop: false,
                sku: goods.sku,
                goodsLink: goods.goodsLink,
            }, () => {
                this.onJump(goods.sku);
            })
        }
    }

    onJump(sku) {
        const {navigation, actions} = this.props;
        const {token, goodsLink} = this.state;
        
        if (global.fromuid > 0) {
            actions.course.shareGoods({
                fromuid: global.fromuid,
                sku_code: sku,
                resolved: (data) => {
                    if (data.itemLink) {
                        navigation.navigate('Web', {link: data.itemLink + '&token=' + token});
                    } else {
                        navigation.navigate('Web', {link: goodsLink + '&token=' + token});
                    }
                },
                rejected: (msg) => {
                    navigation.navigate('Web', {link: goodsLink + '&token=' + token});
                }
            })
        } else {
            navigation.navigate('Web', {link: goodsLink + '&token=' + token});
        }
        
    }

    onGiftToggle() {
        this.refs.gift && this.refs.gift.show();
    }

    onPubPic() {
        const {actions} = this.props;

        ImagePicker.showImagePicker(options, (response) => {
            if (response.uri) {
                actions.site.upload({
                    file:'data:image/jpeg;base64,' + response.data,
                    resolved: (data) => {
                        this.onPub('img', data);
                        this.refs.input && this.refs.input.focus();
                    },
                    rejected: (msg) => {

                    },
                });
            }
        });
    }

    onPub(mtype, msg) {
        const {config} = this.props;
        const words = config.ban_words.split(',');

        let canPub = true;
        for (let i = 0; i < words.length; i++) {
            if (msg.indexOf(words[i]) >= 0) {
                canPub = false;
                break;
            }
        }

        if (canPub) {
            const param = {
                mtype: mtype,
                msg: msg,
            }
    
            this.ws && this.ws.send(JSON.stringify(param));
    
            this.setState({
                index: 1,
                content: '',
            },()=>{
                Keyboard.dismiss();
            })
        } else {
            this.refs.hud && this.refs.hud.show('请注意您的言论！', 1);
        }
        
    }

    onWs(user) {
        if (this.ws) return;

        const params = {
            name: user.nickname,
            avatar: user.avatar,
            uid: user.userId,
        }

        const url = (global.utype == 0 ? config.ws : config.ws_corp) + this.course.courseId + '?' + qs.stringify(params);

        this.ws = new WebSocket(url);

        this.ws.onmessage = (e) => {
            this.parseMsg(JSON.parse(e.data));
        }

        this.ws.onclose = (e) => {
            console.info(e);
        }
    }

    parseMsg(msg) {
        const {navigation} = this.props;

        if (msg.type == 'event-system') {           //在线情况

            if (this.state.totalCount != msg.totalCount) {
                this.setState({
                    totalCount: this.course.onlineNum + msg.totalCount,
                })
            }

        } else if (msg.type == 'event-live') {      //直播情况

            this.setState({
                liveStatus: msg.liveStatus,
                roomStatus: msg.roomStatus,
            })

        } else if (msg.type == 'event-join') {      //有人进来

            
            this.refs.livemsg && this.refs.livemsg.push(msg.user.name + '来了');
            
        } else if (msg.type == 'event-leave') {     //有人离开

        } else if (msg.type == 'event-keyword') {   //触发关键词
            
            this.refs.hud && this.refs.hud.show(msg.msg.msg, 1);

        } else if (msg.type == 'event-msg') {       //用户发言
            
            const id = msg.id;
            const mtype = msg.msg.mtype;
            const admin = msg.user.admin;
            
            if (mtype == 'goods') {
                const goodsId = parseInt(msg.msg.msg);

                if (goodsId in this.goodsMap) {
                    let goods = this.goodsMap[goodsId];
                    goods.id = msg.id;
                    this.refs.shop && this.refs.shop.push(goods);
                }

                
            } else if (mtype == 'gift') {

                const arr = msg.msg.msg.split('&');
                const giftId = parseInt(arr[1]);

                if (giftId in this.giftMap) {
                    this.refs.livegift && this.refs.livegift.push(arr[0], this.giftMap[giftId]);
                }
                

            } else {

                if (admin == 1) {
                    this.aitems.push(msg);
                }

                if (this.items.length > 200) {
                    this.items.shift();
                }
                if(admin == 0){
                    this.items.push(msg);
                }
                
            }
            this.setState({
                id: id,
            }, () => {
                setTimeout(() => this.refs.msg && this.refs.msg.scrollToEnd && this.refs.msg.scrollToEnd(), 400);
            })

        } else if (msg.type == 'event-cancel') {    //撤销发言
            const id = msg.msg.msg;

            let items = [];
            let aitems = [];
            this.items.map((item, index) => {
                if (item.id != id) items.push(item);
            })

            this.aitems.map((item, index) => {
                if (item.id != id) aitems.push(item);
            })

            this.items = items;
            this.aitems = aitems;

            this.setState({
                id: id,
            })

        }  else if (msg.type == 'event-mute') {     //禁言
            
            this.refs.hud.show(msg.msg.msg, 1);

        } else if (msg.type == 'event-restore') {   //恢复发言

            this.refs.hud.show(msg.msg.msg, 1);

        } else if (msg.type == 'event-kick-user') { //被踢出房间
            this.refs.hud.show(msg.msg.msg, 1, () => {
                navigation.goBack();
            });
        } else if (msg.type == 'event-leave') {
            this.refs.hud.show(msg.user.name + msg.msg.msg, 1);
        }
    }

    _updateKeyboardSpace(event) {
		if (!event.endCoordinates) {
			return;
        }

		if (Platform.OS !== 'ios') {
            this.setState({
                keyboardSpace: event.endCoordinates.screenY,
                isKeyboardOpened: true
            });
		}
	}

	_resetKeyboardSpace(event) {
		this.setState({
			keyboardSpace: 0,
			isKeyboardOpened: false
		});
    }

    onCard(card) {
        const {actions, user} = this.props;
        const {sku} = this.state;

        actions.passport.swicthCard({
            phone: user.mobile,
            cardCode: card,
            resolved: (data) => {
                this.setState({
                    token: data.token,
                    card: false,
                }, () => {
                    this.onJump(sku)
                })
            },
            rejected: (msg) => {
                
            }
        })
    }

    renderGoods(item) {
        const goods = item.item;
        return (
            <TouchableOpacity style={[ styles.p_15, styles.b_line, styles.row]} onPress={() => this.onShop(goods)}>
                <Image source={{uri: goods.goodsImg}} style={[styles.goods_img, styles.f1]}/>
                <View style={[styles.jc_sb, styles.f4, styles.goods_intro, styles.ml_10]}>
                    <Text style={[styles.label_12]}>{goods.goodsName}</Text>
                    <Text style={[styles.label_12, styles.label_red]}>¥{parseFloat(goods.goodsPrice).toFixed(2)}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderCard(item) {
        const card = item.item;

        return (
            <TouchableOpacity style={[styles.p_15, styles.pl_20, styles.pr_20, styles.b_line]} onPress={() => this.onCard(card)}>
                <Text style={[styles.label_blue, styles.label_16]}>{card}</Text>
            </TouchableOpacity>
        )
    }

    renderItem(item) {
        const {user} = this.props;
        const {emoji} = this.state;
        const message = item.item;

        const msg = message.msg;
        const muser = message.user;
        const owner = muser.uid == user.userId;

        if (owner) {
            return (
                <TouchableWithoutFeedback onPress={()=> {
                    Keyboard.dismiss();
                    if (emoji) {
                        this.onAction('Emoji');
                    }
                    
                }}>
                <View style={[styles.p_10, styles.row, styles.ai_ct, styles.jc_fe]}>
                    <View style={styles.avatar_small}/>
                    <View style={[styles.mr_10]}>
                        {msg.mtype == 'img' ?
                            <View style={[styles.row, styles.jc_fe, styles.ai_ct, styles.mt_5, styles.msg]}>
                                <View style={[styles.circle_10, styles.bg_blue, styles.overflow_h]}>
                                    {this.renderMsg(msg, owner)}
                                </View>
                            </View>
                        : 
                            <View style={[styles.row, styles.jc_fe, styles.ai_ct, styles.mt_5, styles.msg]}>
                                <View style={[styles.bg_blue, styles.circle_10, styles.p_10, styles.pl_15, styles.pr_15]}>
                                    {this.renderMsg(msg, owner)}
                                </View>
                                <View style={styles.rtriangle}/>
                            </View>
                        }
                    </View>
                    <Image source={{uri: muser.avatar.length > 0 ? muser.avatar : asset.user.avatar.uri }} style={styles.avatar_small}/>
                </View>
                </TouchableWithoutFeedback>
            )
        }

        return (
            <TouchableWithoutFeedback onPress={()=> {
                Keyboard.dismiss();
                if (emoji) {
                    this.onAction('Emoji');
                }
                
            }}>
            <View style={[styles.p_10, styles.row, styles.ai_ct, styles.jc_fs]}>
                <Image source={{uri: muser.avatar.length > 0 ? muser.avatar : asset.user.avatar.uri}} style={styles.avatar_small}/>
                <View style={[styles.ml_10]}>
                    <Text style={[styles.label_12, styles.label_dgray, muser.admin == 1 && styles.label_blue]}>{muser.name}</Text>
                    {msg.mtype == 'img' ?
                        <View style={[styles.row, styles.jc_fs, styles.ai_ct, styles.mt_5, styles.msg]}>
                            <View style={[styles.circle_10, styles.bg_lgray, styles.overflow_h]}>
                                {this.renderMsg(msg, owner)}
                            </View>
                        </View>
                    : 
                        <View style={[styles.row, styles.jc_fs, styles.ai_ct, styles.mt_5, styles.msg]}>
                            <View style={styles.ltriangle}/>
                            <View style={[styles.bg_lgray, styles.circle_10, styles.p_10, styles.pl_15, styles.pr_15]}>
                                {this.renderMsg(msg, owner)}
                            </View>
                        </View>
                    }
                </View>
            </View>
            </TouchableWithoutFeedback>
        )
    }

    renderMsg(msg, owner) {
        const {index} = this.state;
        let replyList = textToEmoji(msg.msg);
        let on = index === 1;

        if (msg.mtype == 'img') {
            return (
                <TouchableOpacity onPress={() => this.setState({
                    preview: true,
                    preview_index: 0,
                    preview_imgs: [{
                        url: msg.msg,
                    }]
                })}>
                    <Image source={{uri: msg.msg}} style={[styles.thumb, styles.circle_10]} resizeMode={'contain'}/>
                </TouchableOpacity>
            )
        } else if (msg.mtype == 'url') {
            return (
                <TouchableOpacity>
                    <Text style={[styles.label_default, owner && styles.label_white]}>{msg.msg}</Text>
                </TouchableOpacity>
            )
        }

        return (
            <View style={[styles.msgw,styles.row, styles.ai_ct, styles.wrap]}>
                {
                    replyList.map((rpy,idx)=>{
                        return(
                            <View key={'rpy' + idx} style={[styles.row]}>
                                {
                                    rpy.msgType === 'text' ?
                                    <Text style={[styles.label_default, owner && on && styles.label_white ]}>{rpy.msgCont}</Text>
                                    :
                                    <Image source={{uri:rpy.msgImage}} style={{width:20, height:20}} />
                                }
                            </View>
                        )
                    })
                }
            </View>
        );
    }

    render() {
        const {navigation} = this.props;
        const {loaded, canReward, canBuy, isScore, collectNum, collect, index, emoji, user_integral, preview, preview_index, preview_imgs, content, isKeyboardOpened, keyboardSpace, book, bookNum, roomStatus, liveStatus, totalCount, score, courseScore, teacherScore, canScore, card, shop} = this.state;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#00A6F6"/>
            </View>
        )

        const enable = content.length > 0;
        const kType = Platform.OS === 'ios' ? 'padding' : 'padding';
        
        console.info(keyboardSpace);
        let ks = isKeyboardOpened ? (0 - keyboardSpace) : 0;

        if (Platform.OS === 'ios') {
            ks = 90;
        }    

        return (
            <KeyboardAvoidingView style={styles.f1} behavior={kType} keyboardVerticalOffset={ks}>

                <LivePlayer 
                    ref={e => { this.player = e; }}
                    source={{
                        cover: this.course.courseImg,
                        uri: this.course.liveUrl,
                        restTime: this.course.resetTime,
                    }} 
                    ad={{
                        preVideos: this.course.preVideos,
                        inVideos: this.course.inVideos,
                        endVideos: this.course.endVideos
                    }}

                    book={book} 
                    bookNum={bookNum} 
                    liveStatus={liveStatus} 
                    roomStatus={roomStatus} 
                    totalCount={totalCount}
                    canBuy = {canBuy}
                    
                    onBook={() => this.onAction('Book')}
                    onBuy={()=> this.onAction('onBuy')}
                    onFullScreen={(status) => {
                        navigation.setParams({'fullscreen': status});
                    }}
                />
                <TabView items={['主讲区', '讨论区']} center={true} current={index} onSelected={(index) => {
                    this.setState({
                        index: index,
                    }, () => {
                        setTimeout(() => this.refs.msg && this.refs.msg.scrollToEnd(), 200);
                    })
                }}/>
                <FlatList
                    ref={'msg'}
                    style={styles.f1}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.p_10}
                    data={index == 0 ? this.aitems : this.items}
                    extraData={this.state.id}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this.renderItem}
                />

                {canBuy ?
                    <View style={[styles.toolbar, styles.bg_white, styles.jc_ct, styles.p_5, styles.pl_15, styles.pr_15]}>
                        <TouchableOpacity style={[styles.bg_blue, styles.circle_5, styles.jc_ct, styles.ai_ct, styles.p_10]} onPress={() => this.onAction('Buy')}>
                            <Text style={[styles.label_white]}>购买资源</Text>
                        </TouchableOpacity>
                    </View>
                : (
                    index == 1 ?
                    <View style={[styles.toolbar, styles.bg_white, styles.row, styles.ai_ct, styles.jc_sb]}>
                        {canReward ?
                        <TouchableOpacity style={[styles.f1, styles.ai_ct, styles.jc_ct]} onPress={() => this.onAction('Gift')}>
                            <Text style={[styles.icon, styles.label_20]}>{iconMap('lihe')}</Text>
                        </TouchableOpacity>
                        : null}
                        <TouchableOpacity style={[styles.f1, styles.ai_ct, styles.jc_ct]} onPress={() => this.onAction('Collect')}>
                            <Text style={[styles.icon, styles.label_20, collect && styles.label_red]}>{iconMap(collect ? 'aixin1' : 'aixin')}</Text>
                            <View style={[styles.count, styles.bg_blue]}>
                                <Text style={[styles.label_9 ,styles.label_white]}>{collectNum > 99 ? '99+' : collectNum}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.f1, styles.ai_ct, styles.jc_ct]} onPress={() => this.onAction('Emoji')}>
                            <Text style={[styles.icon, styles.label_20]}>{iconMap('biaoqing')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.f1, styles.ai_ct, styles.jc_ct]} onPress={() => this.onAction('PubPic')}>
                            <Text style={[styles.icon, styles.label_20]}>{iconMap('tupian')}</Text>
                        </TouchableOpacity>
                        <View style={[styles.f6, styles.row, styles.ai_ct, styles.jc_sb]}>
                            <TextInput 
                                style={[styles.input, styles.f1, styles.circle_5, styles.bg_l1gray, styles.p_5, styles.pl_10, styles.pr_10]} 
                                ref={"input"}
                                placeholder={'写留言，发表看法'} 
                                value={content} 
                                onChangeText={(text) => {this.setState({content:text});}}
                                onSubmitEditing={() => {
                                    this.onAction('Pub');
                                }}
                            />
                        </View>
                        <TouchableOpacity style={[styles.p_5, styles.pl_15, styles.pr_15, styles.ml_10, styles.bg_blue, !enable && styles.disabledContainer, styles.circle_5]} disabled={!enable} onPress={() => this.onAction('Pub')}>
                            <Text style={[styles.label_white]}>发送</Text>
                        </TouchableOpacity>
                    </View>
                    : null
                )}

                {canScore && !isScore ? 
                <TouchableOpacity style={[styles.score_guide, styles.p_5]} onPress={() => this.setState({
                    score: true,
                })}>
                    <Image source={asset.course.score} style={[styles.shop_icon]}/>
                </TouchableOpacity> : null}

                <TouchableOpacity style={[styles.shop_guide, styles.p_5]} onPress={() => this.onShopToggle()}>
                    <Image source={asset.course.shop} style={[styles.shop_icon]}/>
                    <View style={[styles.shop_dot, styles.bg_red]}>
                        <Text style={[styles.label_12, styles.label_white]}>{this.goods_list.length}</Text>
                    </View>
                </TouchableOpacity>

                <Modal visible={shop} transparent={true} onRequestClose={() => {
                    this.setState({
                        shop: false,
                    })
                }}>
                    <TouchableOpacity style={[styles.modal]} onPress={() => this.setState({
                        shop: false,
                    })}/>
                    <View style={[styles.shop, styles.bg_white, styles.circle_5]}>
                        <FlatList
                            contentContainerStyle={[styles.p_10]}
                            data={this.goods_list}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) =>  {return index + ''}}
                            renderItem={this.renderGoods}
                        />
                    </View>
                </Modal>

                <Modal visible={card} transparent={true} onRequestClose={() => {
                    this.setState({
                        card: false,
                    })
                }}>
                    <TouchableOpacity style={[styles.modal]} onPress={() => this.setState({
                        card: false,
                    })}/>
                    <View style={[styles.card, styles.bg_white, styles.circle_5]}>
                        <FlatList
                            contentContainerStyle={[styles.pt_15, styles.pb_15, styles.b_line]}
                            data={global.cardCodes}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) =>  {return index + ''}}
                            renderItem={this.renderCard}
                        />
                        <TouchableOpacity style={[styles.exit]} onPress={() => this.setState({
                                card: false
                            })} hitSlop={{top: 5, left: 5, bottom: 5, right: 5}}>
                            <Text style={[styles.icon]}>{iconMap('guanbi')}</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                <LiveShop ref={'shop'} onPress={(goods) => this.onShop(goods)}/>
                <LiveMsg ref={'livemsg'}/>
                <LiveGift ref={'livegift'}/>

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

                <GiftView gift={this.gift} ref={'gift'} integral={user_integral} onSelect={(gift_id) => {
                    this.onAction('Reward', {gift_id: gift_id})
                }} onBuy={() => navigation.navigate('Recharge')}/>

                <Emoji ref={'emoji'} onSelect={(key) => {
                    this.setState({
                        content : content + key,
                    })
                }}/>

                <Modal visible={score} transparent={true} onRequestClose={() => {
                    this.setState({score:false})
                }}>
                    <TouchableOpacity style={[styles.modal]} onPress={()=>this.setState({score:false})}/>
                    <View style={[styles.score, styles.bg_white, styles.circle_5, styles.pt_15]}>
                        <View style={[styles.p_15,  styles.b_line, styles.ai_ct]}>
                            <View style={[styles.row, styles.ai_ct, styles.p_10]}>
                                <Text style={[styles.label_16, styles.mr_15]}>资源评分</Text>
                                <RankView value={courseScore} onChoose={(value) => {
                                    this.setState({
                                        courseScore: value,
                                    })
                                }}/>
                            </View>
                            <View style={[styles.row, styles.ai_ct, styles.p_10]}>
                                <Text style={[styles.label_16, styles.mr_15]}>老师评分</Text>
                                <RankView value={teacherScore} onChoose={(value) => {
                                    this.setState({
                                        teacherScore: value,
                                    })
                                }}/>
                            </View>
                        </View>
                        <View style={[styles.row]}>
                            <TouchableOpacity style={[styles.f1, styles.p_15, styles.ai_ct]} onPress={()=>this.setState({score:false})}>
                                <Text style={[styles.label_gray]}>取消</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.f1, styles.p_15, styles.ai_ct, styles.r_line]} onPress={() => this.onAction('PubScore')}>
                                <Text>提交</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <HudView ref={'hud'}/>
            </KeyboardAvoidingView>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    msg: {
        width: theme.window.width * 0.6,
    },
    msgw:{
        maxWidth:theme.window.width * 0.65 - 30
    },
    avatar_small:{
        width:36,
        height:36,
        borderRadius:18,
    },
    ltriangle: {
        marginRight: -2,
		borderTopWidth: 5,
		borderRightWidth: 5,
		borderBottomWidth: 5,
		borderLeftWidth: 0,
		borderTopColor: 'transparent',
		borderRightColor: '#F5F5F5',
		borderBottomColor: 'transparent',
		borderLeftColor: 'transparent',
		width: 0,
		height: 0,
		backgroundColor: 'transparent',
		borderStyle: 'solid',
    },
    rtriangle: {
        marginLeft: -2,
		borderTopWidth: 5,
		borderRightWidth: 0,
		borderBottomWidth: 5,
		borderLeftWidth: 5,
		borderTopColor: 'transparent',
		borderRightColor: 'transparent',
		borderBottomColor: 'transparent',
		borderLeftColor: '#00A6F6',
		width: 0,
		height: 0,
		backgroundColor: 'transparent',
		borderStyle: 'solid',
    },
    thumb: {
        width: 120,
        height: 160,
    },
    dot: {
        width: 10,
        height: 4,
    },
    toolbar: {
        height: 50,
        borderTopWidth: 1,
        borderTopColor: '#FAFAFA'
    },
    count:{
        position:'absolute',
        top:0,
        height:13,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        right:4,
        minWidth:10,
        paddingTop:0,
        paddingBottom:0,
        paddingLeft:4,
        paddingRight:4,
    },
    score_guide: {
        position: 'absolute',
        bottom: 140,
        right: 20,
    },
    score: {
        position: 'absolute',
        top: 250,
        left: 50,
        right: 50,
    },
    shop_guide: {
        position: 'absolute',
        bottom: 80,
        right: 20,
    },
    shop_icon: {
        width: 40,
        height: 40,
    },
    shop_dot: {
        padding: 2,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white',
        position: 'absolute',
        top: 0,
        right: 0,
    },
    shop: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: theme.window.width * 0.5,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    goods_img: {
        height: 55,
    },
    goods_intro: {
        height: 55,
    },
    input: {
        width: theme.window.width / 2 - 30,
    },
    card: {
        position: 'absolute',
        top: theme.window.width * 0.5,
        left: 50,
        right: 50,
    },
    exit: {
        position: 'absolute',
        top: 10,
        right: 10,
    }
});

export const LayoutComponent = Live;

export function mapStateToProps(state) {
    return {
        config: state.config.config,
        user: state.user.user,
        gift: state.config.gift,
        course: state.course.course,
        goods: state.course.goods,
    };
}