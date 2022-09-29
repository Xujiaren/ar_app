//import liraries
import React, { Component } from 'react';
import { View, TouchableOpacity, ScrollView, Text, Modal, Image, DeviceEventEmitter, StyleSheet, Alert } from 'react-native';
import qs from 'query-string';

import RefreshListView, {RefreshState} from '../../../component/base/RefreshListView';
import theme from '../../../config/theme';

// create a component
class MessageInfo extends Component {

    static navigationOptions = ({navigation}) => {
        const type = navigation.getParam('type', 0);
		return {
            title: type == 0 ? '特定消息' : '系统通知',
            headerRight: () => {
                return (
                    <View style={[styles.row, styles.ai_ct]}>
                        {type == 1 ?
                        <TouchableOpacity style={[styles.mr_15]} onPress={()=> DeviceEventEmitter.emit('removeall')}><Text>清空</Text></TouchableOpacity>
                        : null}
                        <TouchableOpacity style={[styles.mr_15]} onPress={()=> DeviceEventEmitter.emit('readall')}><Text>已读</Text></TouchableOpacity>
                    </View>
                )
            }
		}
    };

    constructor(props) {
        super(props);

        const {navigation} = this.props;
        this.type = navigation.getParam('type', 0);

        this.page = 0;
        this.pages = 1;
        this.total = 0;
        this.items = [];

        this.state = {
            preview: false,
            preview_index: 0,

            type: 0,
            refreshState: RefreshState.Idle,
        }

        this.onPreview = this.onPreview.bind(this);
        this.onJump = this.onJump.bind(this);

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    componentDidMount() {
        const {actions} = this.props;

        this.page = 0;
        this.pages = 1;
        this.total = 0;
        this.items = [];

        this.rsub = DeviceEventEmitter.addListener('removeall', (data) => {
            let mids = [];
            this.items.map((item, index) => {
                mids.push(this.type == 1 ? item.remindId : item.messageId);
            });

            if (mids.length > 0) {

                Alert.alert('消息管理', '确定删除消息?', [
                    {
                        text: '取消',
                        onPress: () => {
                            return true;
                        },
                        style: 'cancel',
                    },
                    {
                        text: '确认',
                        onPress: () =>  {
                            actions.user.messageOperate({
                                type: this.type,
                                message_ids: mids.join(','),
                                operate: 1,
                                resolved: (data) => {
                                    actions.user.unread();
                                    this._onHeaderRefresh();
                                },
                                rejected: (msg) => {
                                    
                                }
                            })
                        },
                    }
                ])
                
            }
        })

        this.sub = DeviceEventEmitter.addListener('readall', (data) => {
            let mids = [];
            this.items.map((item, index) => {
                mids.push(this.type == 1 ? item.remindId : item.messageId);
            });

            if (mids.length > 0) {
                actions.user.messageOperate({
                    type: this.type,
                    message_ids: mids.join(','),
                    operate: 0,
                    resolved: (data) => {
                        actions.user.unread();
                        this._onHeaderRefresh();
                    },
                    rejected: (msg) => {
                        
                    }
                })
            }
        })

        this._onHeaderRefresh();
    }

    componentWillUnmount() {
        this.rsub && this.rsub.remove();
        this.sub && this.sub.remove();
    }
    
    componentWillReceiveProps(nextProps) {
        const {remind, message} = nextProps;

        if (remind !== this.props.remind) {
            this.pages = remind.pages;
            this.total = remind.total;
            this.items = this.items.concat(remind.items);
        }

        if (message !== this.props.message) {
            this.pages = message.pages;
            this.total = message.total;
            this.items = this.items.concat(message.items);
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    onPreview(index) {
        const {actions} = this.props;
        const item = this.items[index];

        actions.user.messageOperate({
            type: this.type,
            message_ids: this.type == 1 ? item.remindId : item.messageId,
            operate: 0,
            resolved: (data) => {
                if (this.type == 0 && item.link) {

                    this.onJump(item.link);
        
                } else {
                    this.setState({
                        preview: true,
                        preview_index: index,
                    })
                }
            },
            rejected: (msg) => {
                
            }
        })
    }

    onJump(link) {
        const {navigation} = this.props;

        let data = qs.parseUrl(link);

        let page = '';
        let args = {};
        if (link.substring(0, 4) === 'http') {
            page = 'Web';
            args = {link: link};
        } else if (data.url.indexOf('courseDesc') !== -1) {
            const courseId = data.query['course_id'];
            page = 'Vod';
            args = {course: {courseId: courseId, courseName: ''}};
        } else if (data.url.indexOf('liveDesc') !== -1) {
            const courseId = data.query['course_id'];
            page = 'Live';
            args = {course: {courseId: courseId, courseName: ''}};
        } else if (data.url.indexOf('consultDesc') !== -1) {
            const courseId = data.query['course_id'];
            page = 'Article';
            args = {course: {courseId: courseId, courseName: ''}};
        } else if (data.url.indexOf('audioDeSC') !== -1) {
            const courseId = data.query['course_id'];
            page = 'Audio';
            args = {course: {courseId: courseId, courseName: ''}};
        } else if (data.url.indexOf('groupDeSC') !== -1) {
            const activityId = data.query['group_id'];
            page = 'Group';
            args = {group: {activityId: activityId}};
        }
        
        console.info(args);
        navigation.navigate(page, args);
    }

    _onHeaderRefresh() {
        const {actions} = this.props;

        this.page = 0;
        this.pages = 1;
        this.total = 0;
        this.items = [];

        if (this.type == 1) {
            actions.user.remind(0);
        } else {
            actions.user.message(0);
        }

        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
        const {actions} = this.props;

        if (this.page < this.pages) {
            this.setState({refreshState: RefreshState.FooterRefreshing});
            this.page = this.page + 1;
            if (this.type == 1) {
                actions.user.remind(this.page);
            } else {
                actions.user.message(this.page);
            }

        } else {
            this.setState({refreshState: RefreshState.NoMoreData});
        }
    }

    _renderItem(item) {
        const {actions} = this.props;
        const message = item.item;

        return (
            <TouchableOpacity style={[styles.bg_white, styles.circle_5, styles.p_10, styles.pl_15, styles.pr_15, styles.mb_15, styles.item]} onPress={()=> this.onPreview(item.index)}>
                {this.type == 1 ?
                <View style={[styles.b_line, styles.pb_10]}>
                    <Text style={[styles.label_16]}>{message.title}</Text>
                    <Text style={[styles.label_gray, styles.mt_10]} numberOfLines={1}>{message.content}</Text>
                    <Text style={[styles.label_12, styles.label_gray, styles.mt_10]}>{message.pubTimeFt}</Text>
                </View>
                : 
                <View style={[styles.b_line, styles.pb_10]}>
                    
                    <Text style={[styles.label_16]}>{message.title}</Text>
                    <View style={[styles.row, styles.ai_fs, styles.mt_10]}>
                        {message.messageImg != '' ? 
                        <Image source={{uri: message.messageImg}} style={[styles.thumb, styles.mr_10]}/> : 
                        null}
                        <View style={[message.messageImg != '' && styles.message_info]}>
                            <Text style={[styles.label_gray]} numberOfLines={2}>{message.summary}</Text>
                            <Text style={[styles.label_12, styles.label_gray, styles.mt_10]}>{message.pubTimeFt}</Text>
                        </View>
                    </View>
                    
                </View>
                }
                <View style={[styles.mt_10, styles.ai_end]}>
                    <Text style={[styles.label_gray]}>点击查看详情</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const {preview, preview_index} = this.state;

        const msg = this.items[preview_index] ? this.items[preview_index] : {};

        return (
            <View style={styles.container}>
                <RefreshListView
                    contentContainerStyle={[styles.p_20]}
                    showsVerticalScrollIndicator={false}
                    data={this.items}
                    extraData={this.state}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this._onHeaderRefresh}
                    onFooterRefresh={this._onFooterRefresh}
                />

                <Modal visible={preview} transparent={true} onRequestClose={() => {
                    this.setState({preview:false})
                }}>
                    <TouchableOpacity style={[styles.modal]} onPress={()=>this.setState({preview:false})}/>
                    <View style={[styles.msg, styles.bg_white, styles.circle_5]}>
                        <ScrollView contentContainerStyle={[styles.p_20]}>
                            <Text style={[styles.label_16]}>{msg.title}</Text>
                            <Text style={[styles.label_12, styles.label_gray, styles.mt_5]}>{msg.pubTimeFt}</Text>
                            {msg.messageImg && msg.messageImg != '' ?
                            <Image source={{uri: msg.messageImg}} style={[styles.pic, styles.as_ct, styles.mt_10]}/>
                            : null}
                            <Text style={[styles.label_gray, styles.mt_10]}>{msg.content}</Text>
                        </ScrollView>
                        <TouchableOpacity style={[styles.p_15, styles.ai_ct]} onPress={()=>this.setState({preview:false})}>
                            <Text>关闭</Text>
                        </TouchableOpacity>
                    </View>
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
    item: {
        borderWidth: 1,
        borderColor: '#EBEBEB'
    },
    thumb: {
        width: 48,
        height: 48,
    },
    pic: {
        width: theme.window.width - 80,
        height: theme.window.width - 80,
    },
    message_info: {
        width: theme.window.width - 140,
    },
    msg: {
        position:'absolute',
        top: theme.window.height * 0.15,
        left: theme.window.width * 0.1,
        right: theme.window.width * 0.1,
        bottom: theme.window.height * 0.15,
    }
});

export const LayoutComponent = MessageInfo;

export function mapStateToProps(state) {
    return {
        remind: state.user.remind,
        message: state.user.message,
    };
}