//import liraries
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import VideoPlayer from 'react-native-video-controls';

import RefreshListView, {RefreshState} from '../../../component/base/RefreshListView';
import HudView from '../../../component/base/HudView';
import iconMap from '../../../config/font';
import theme from '../../../config/theme';

// create a component
class ActivityWork extends Component {

    static navigationOptions = ({navigation}) => {
        const activity = navigation.getParam('activity', {title: '活动详情'});

		return {
            title: activity.title,
            headerRight: () => <View/>
		}
	};

    constructor(props) {
        super(props);

        const {navigation} = props;
        this.activity = navigation.getParam('activity', {});

        this.total = 0;
        this.page = 0;
        this.pages = 1;
        this.items = [];

        this.state = {
            keyword: '',
            user_vote: 0,
            refreshState: RefreshState.Idle,

            index: 0,
            is_video: this.activity.ctype == 16,

            video_url: '',
            video_preview: false,

            preview: false,
            preview_index: 0,
            preview_imgs: [],
        }
        
        this.onAction = this.onAction.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
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
        const {work, user_vote} = nextProps;

        if (work !== this.props.work) {
            this.items = this.items.concat(work.items);
            this.total = work.total;
            this.pages = work.pages;
        }

        if (user_vote !== this.props.user_vote) {
            this.setState({
                user_vote: user_vote,
            })
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    onAction(action, args) {
        const {navigation, actions, user} = this.props;

        if (!user.userId) {
            navigation.navigate('Passport');
        } else {
            if (action == 'Vote') {
                let work = this.items[args.index];
                work.isVote = true;
                actions.activity.vote({
                    join_id: work.joinId,
                    resolved: (data) => {
                        this.refs.hud.show('投票成功', 1);
                    },
                    rejected: (msg) => {
                        this.refs.hud.show(msg, 1);
                    }
                })

                this.items[args.index] = work;
                this.setState({
                    index: args.index,
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
        const {keyword} = this.state;
        
        this.total = 0;
        this.page = 0;
        this.pages = 1;
        this.items = [];

        actions.activity.userVote(this.activity.activityId);
        actions.activity.work(this.activity.activityId, keyword, 0);
        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
        const {actions} = this.props;
        const {keyword} = this.state;

        if (this.page < this.pages) {
            this.setState({refreshState: RefreshState.FooterRefreshing});
            this.page = this.page + 1;
            actions.activity.work(this.activity.activityId, keyword, this.page);
        } else {
            this.setState({refreshState: RefreshState.NoMoreData});
        }
    }

    _renderItem(item) {
        const {is_video} = this.state;
        const work = item.item;
        let thumb = '';
        if (work.galleryList && work.galleryList.length > 0) {
            thumb = work.galleryList[0].fpath;
        }

        const over = this.activity.astatus == 2;
        const disable = over || work.isVote;

        return (
            <View style={[styles.work, styles.mr_10, styles.mb_10, styles.bg_l1gray, styles.p_10, styles.circle_5]}>
                <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
                    <View style={[styles.row, styles.ai_ct]}>
                        <Image source={{uri: work.avatar}} style={[styles.avatar]}/>
                        <Text style={[styles.ml_10]}>{work.username}</Text>
                    </View>
                    <Text style={[styles.label_blue]}>编号{item.index + 1}</Text>
                </View>

                <Text style={[styles.mt_15]}>{work.workName}</Text>
                <Text style={[styles.mt_10, styles.label_dgray, styles.label_12]}>{work.workIntro}</Text>
                <TouchableOpacity style={[styles.mt_15]} onPress={() => {
                    if (is_video) {
                        this.setState({
                            video_url: thumb,
                            video_preview: true,
                        })
                    } else {
                        this.onPreview(work.galleryList, 0)
                    }
                }}>
                    <Image source={{uri: thumb + (is_video ? '?x-oss-process=video/snapshot,t_10000,m_fast' : '')}} style={[styles.work_thumb]}/>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.p_5, styles.bg_blue, disable && styles.bg_gray, styles.circle_5, styles.ai_ct, styles.jc_ct, styles.mt_15, disable && styles.disabledContainer]} disabled={disable} onPress={()=> this.onAction('Vote', {index: item.index})}>
                    <Text style={[styles.label_white]}>{over ? '已结束' : (work.isVote ? '已投票' : '投票')}({work.number}票)</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        const {user_vote, keyword, preview, preview_imgs, preview_index, video_url, video_preview} = this.state;

        return (
            <View style={styles.container}>
                <View style={[styles.p_10, styles.pl_20, styles.pr_20, styles.row, styles.ai_ct, styles.jc_sb]}>
                    <View style={[styles.bg_l1gray, styles.circle_20, styles.row, styles.ai_ct, styles.p_10]}>
                        <Text style={[styles.icon]}>{iconMap('search')}</Text>
                        <TextInput
                            style={[styles.input, styles.ml_10]}
                            placeholder={'输入关键词'}
                            value={keyword}
                            onChangeText={(text) => {this.setState({keyword:text});}}
                            onEndEditing={(e) => this._onHeaderRefresh()}
                        />
                    </View>
                    <Text style={[styles.label_gray, styles.ml_10]}>我的票数：<Text style={[styles.label_default]}>{user_vote}</Text></Text>
                </View>
                <RefreshListView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.p_20]}
                    data={this.items}
                    numColumns={2}
                    extraData={this.state}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this._onHeaderRefresh}
                    onFooterRefresh={this._onFooterRefresh}
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

                <Modal visible={video_preview} transparent={true} onRequestClose={() => {
                    this.setState({
                        video_preview: false,
                    })                    
                }}>
                    <TouchableOpacity style={[styles.modal]} onPress={()=>this.setState({video_preview:false})}/>
                    <View style={[styles.video_preview]}>
                        <VideoPlayer 
                            paused={false}
                            controls={false}
                            disableBack={true}
                            disableFullscreen={true}
                            disableVolume={true} 
                            source={{uri: video_url}} style={[styles.work_preview]}
                        />
                        <TouchableOpacity style={[styles.video_close]} onPress={()=>this.setState({video_preview:false})}>
                            <Text style={[styles.icon]}>{iconMap('guanbi')}</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <HudView ref={'hud'}/>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    input: {
        width: theme.window.width * 0.5,
    },
    work: {
        width: (theme.window.width - 60) / 2,
    },
    avatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
    },
    work_thumb: {
        width: (theme.window.width - 60) / 2 - 20,
        height: (theme.window.width - 60) / 2 - 20,
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

export const LayoutComponent = ActivityWork;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        work: state.activity.work,
        user_vote: state.activity.user_vote,
    };
}
