//import liraries
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import _ from 'lodash';
import { RtmpView } from 'react-native-rtmpview';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation';

import theme from '../../config/theme';
import iconMap from '../../config/font';

// create a component
class LivePlayer extends Component {

    constructor(props) {
        super(props);

        this.ts = null;

        this.state = {
            liveStatus: props.liveStatus || 0,
            roomStatus: props.roomStatus || 0,
            totalCount: props.totalCount || 0,
            canBuy : props.canBuy || false ,

            book: props.book || false,
            bookNum: props.bookNum || 0,
            restTime: props.source.restTime || 0,

            fullscreen: false,
        }

        this._onCount = this._onCount.bind(this);
        this._orientationDidChange = this._orientationDidChange.bind(this);
        this._onFull = this._onFull.bind(this);
        this._onFullToggle = this._onFullToggle.bind(this);
    }

    componentDidMount() {
        const {liveStatus} = this.state;

        Orientation.lockToPortrait();

        if (liveStatus == 1) {
            this.player.initialize();
        }

        this._onCount();

        Orientation.addOrientationListener(this._orientationDidChange);
    }

    componentWillReceiveProps(nextProps) {
        const {liveStatus, roomStatus, totalCount, book, bookNum,canBuy} = nextProps;

        if (liveStatus !== this.props.liveStatus) {

            this.setState({
                liveStatus: liveStatus,
            }, () => {
                if (liveStatus == 1) {
                    this.player.initialize();
                }
            })
        }

        if (roomStatus !== this.props.roomStatus) {
            this.setState({
                roomStatus: roomStatus,
            })
        }

        if (totalCount !== this.props.totalCount) {
            this.setState({
                totalCount: totalCount
            })
        }

        if (book !== this.props.book) {
            this.setState({
                book: book
            })
        }

        if (bookNum !== this.props.bookNum) {
            this.setState({
                bookNum: bookNum
            })
        }

        if(canBuy !== this.props.canBuy){
            this.setState({
                canBuy:canBuy
            })
        }
    }

    componentWillUnmount() {
        this.sub && this.sub.remove();
        this.ts && clearTimeout(this.ts);

        Orientation.lockToPortrait();
        Orientation.removeOrientationListener(this._orientationDidChange);
    }

    _onFull(status) {
        const {onFullScreen} = this.props;

        this.setState({
            fullscreen: status
        }, () => {
            if (status) {
                Orientation.lockToLandscapeRight();
            } else {
                Orientation.lockToPortrait();
            }

            onFullScreen && onFullScreen(status);
        })
    }

    _orientationDidChange(orientation) {
        if (orientation == 'LANDSCAPE') {
            this._onFull(true)
        } else {
            this._onFull(false)
        }
    }

    _onCount() {
        let restTime = this.state.restTime;

            if (restTime > 0) {
                this.ts = setTimeout(() => {
                    restTime--;
    
                    this.setState({
                        restTime: restTime
                    }, () => {
                        this._onCount();
                    })
                }, 1000);
            } else {
                this.ts && clearTimeout(this.ts);
            }
    }

    _onFullToggle() {
        this._onFull(!this.state.fullscreen)        
    }

    render() {
        const {source, ad, onBook, style={}} = this.props;
        const {canBuy, liveStatus, totalCount, restTime, book, bookNum, fullscreen} = this.state;

        const preMedia = ad.preVideos.length > 0 ? ad.preVideos[_.random(0, ad.preVideos.length - 1)] : null;
        const endMedia = ad.endVideos.length > 0 ? ad.endVideos[_.random(0, ad.endVideos.length - 1)] : null;

        if (liveStatus == 0) {

            return (
                <View style={[styles.container, styles.bg_black]}>
                    {
                        preMedia ?
                        (
                            preMedia.mtype == 0 ?
                            <Video source={{uri: preMedia.mediaUrl}} resizeMode={'cover'} style={styles.container} repeat={true}/>
                            : <Image source={{uri: preMedia.mediaUrl}} style={styles.container}/>
                        )
                        : <Image source={{uri: source.cover}} style={styles.container}/>
                    }
                    

                    <View style={[styles.p_10, styles.tipbar, styles.row, styles.ai_ct, styles.jc_sb]}>
                        <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
                            <Text style={[styles.white_label]}>即将开始</Text>
                        </View>
                        <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
                            <Text style={[styles.white_label, styles.sm_label]}>{bookNum}人已预约</Text>
                            <TouchableOpacity style={[styles.ml_10, styles.bg_blue, styles.p_5, styles.pl_15, styles.pr_15, styles.circle_5, book && styles.disabledContainer]} onPress={() => onBook && onBook()}>
                                <Text style={[styles.sm_label, styles.white_label]}>{book ? '取消预约' : '预约'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        }

        if (liveStatus == 2) {
            return (
                <View style={[styles.container, styles.bg_black]}>
                    {
                        endMedia ?
                        (
                            endMedia.mtype == 0 ?
                            <Video source={{uri: endMedia.mediaUrl}} resizeMode={'cover'} style={styles.container} repeat={true}/>
                            : <Image source={{uri: endMedia.mediaUrl}} style={styles.container}/>
                        )
                        : <Image source={{uri: source.cover}} style={styles.container}/>
                    }

                    <View style={[styles.p_10, styles.tipbar, styles.row, styles.ai_ct, styles.jc_sb]}>
                        <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
                            <Text style={[styles.white_label]}>已结束</Text>
                        </View>
                    </View>
                </View>
            )
        }
        
        return (
            <View style={[styles.container, styles.bg_black, fullscreen && styles.fcontainer]}>
                {!canBuy ?
                <RtmpView
                    style={[styles.container, fullscreen && styles.fplayer]}
                    ref={e => { this.player = e; }}
                    url={source.uri}
                />
                : null}
                <View style={[styles.p_10, styles.tipbar, styles.row, styles.ai_ct, styles.jc_fe]}>
                    <Text style={[styles.white_label, styles.sm_label]}>{totalCount}人在线</Text>
                    <TouchableOpacity style={[styles.p_5]} onPress={this._onFullToggle}>
                        <Text style={[styles.icon, styles.white_label, styles.default_label]}>{iconMap('quanping')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    container: {
        width: theme.window.width,
        height: theme.window.width * 0.5625 
    },
    fplayer: {
        width: theme.window.height,
        height: theme.window.width,
    },
    fcontainer: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
    },
    tipbar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 166, 246, 0.3)'
    },
    live_btn:{
        width:54,
        height:23,
        borderRadius:5,
        backgroundColor:'#00A6F6',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    pay_btn:{
        position: 'absolute',
        top:'50%',
        left:'50%',
        width:120,
        height:30,
        marginLeft:-60,
        marginTop:-15,
        backgroundColor:'#00A6F6',
        borderRadius:5,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    }
});

//make this component available to the app
export default LivePlayer;
