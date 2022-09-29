import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, PanResponder, Image, TouchableOpacity, BackHandler } from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation';
import BackgroundTimer from 'react-native-background-timer';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-community/async-storage';

import asset from '../../config/asset';
import theme from '../../config/theme';
import * as tool from '../../util/tool';
import iconMap from '../../config/font';

const speeds = [1, 1.5, 2];

class VodPlayer extends Component {

    constructor(props) {
        super(props);

        const {source = {
            key: '',
            cover: '',
            url: '',
            duration: 0,
            showProgress: 1,
            showSpeed: 1,
        }} = props;

        this.state = {
            key: source.key,
            cover: source.cover,
            playUrl: source.url,
            duration: source.duration,
            showProgress: source.showProgress == 1,
            showSpeed: source.showSpeed == 1,
            current: 0,

            speed: 0,
            speed_choose: false,

            pan: false,
            control: true,
            paused: true,
            fullscreen: false,
        }

        this._onPauseToggle = this._onPauseToggle.bind(this);
        this._onFullToggle = this._onFullToggle.bind(this);
        this._orientationDidChange = this._orientationDidChange.bind(this);
        this.handleBackButtonPressAndroid = this.handleBackButtonPressAndroid.bind(this);
    }

    componentWillMount() {
        const {showProgress} = this.state;

        this.seekPanResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                if (!showProgress) return;
                this.fts && BackgroundTimer.clearTimeout(this.fts);

                this.setState({
                    control: !this.state.control,
                    seek: this.state.current,
                })

            },

            onPanResponderMove: (evt, gestureState) => {
                if (!showProgress) return;

                let seek = this.state.seek;
                if (gestureState.dx > 0) {
                    seek = parseInt(seek + (gestureState.dx / theme.window.width) * this.state.duration);
                } else {
                    seek = parseInt(seek + (gestureState.dx / theme.window.width) * this.state.duration);

                    if (seek < 0) seek = 0;
                }

                this.setState({
                    current: seek,
                }, () => {
                    this.player && this.player.seek(seek);
                })

                
            },
            
            onPanResponderRelease: (evt, gestureState) => {
                if (!showProgress) return;

                this.fts = BackgroundTimer.setTimeout(() => {
                    this.setState({
                        control: false,
                        speed_choose: false,
                    })
                }, 5000);
            },
        });
    }

    componentDidMount() {
        Orientation.lockToPortrait();
        Orientation.addOrientationListener(this._orientationDidChange);

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonPressAndroid)
    }

    componentWillUnmount() {
        this.setState({
            paused: true,
        })
        Orientation.lockToPortrait();
        Orientation.removeOrientationListener(this._orientationDidChange);

        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonPressAndroid)

        this.blurSub && this.blurSub.remove();
        this.focuSub && this.focuSub.remove();
    }

    componentWillReceiveProps(nextProps) {
        const {source} = nextProps;

        if (source !== this.props.source) {
            AsyncStorage.getItem(source.key).then(data => {
                let current = parseInt(data || 0);

                if (current >= source.duration - 1) {
                    current = 0;
                }

                this.setState({
                    key: source.key,
                    current: current,
                    cover: source.cover,
                    playUrl: source.url,
                    duration: source.duration,
                    // paused:!source.canPlay
                })
            })
            
        }
    }

    handleBackButtonPressAndroid() {
        const {fullscreen} = this.state;

        if (fullscreen) {
            StatusBar.setHidden(false);
            Orientation.lockToPortrait();
            this.player && this.player.dismissFullscreenPlayer();
            return true;
        }
        
        return false;
    }

    _onPauseToggle() {
        this.setState({
            paused: !this.state.paused
        })
    }

    _onSpeed(index) {
        this.setState({
            speed: index,
            speed_choose: false,
        });
    }

    _orientationDidChange(orientation) {
        if (orientation == 'LANDSCAPE') {
            Orientation.lockToLandscapeLeft();
            this.player && this.player.presentFullscreenPlayer();
        } else {
            Orientation.lockToPortrait();
            this.player && this.player.dismissFullscreenPlayer();
        }
    }

    _onFullToggle() {
        let fullscreen = this.state.fullscreen;

        if (fullscreen) {
            StatusBar.setHidden(false);
            Orientation.lockToPortrait();
            this.player && this.player.dismissFullscreenPlayer();
        } else {
            StatusBar.setHidden(true);
            Orientation.lockToLandscapeLeft();
            this.player && this.player.presentFullscreenPlayer();
        }
    }

    render() {
        const {onEnd, onProgress, onFullscreen} = this.props;
        const {cover, key, playUrl, duration, current, control, paused, speed, speed_choose, fullscreen, showSpeed, showProgress} = this.state;

        if (playUrl == '') {
            return <Image source={{uri: cover}} style={[styles.container]}/>
        }

        return (
 
            <View style={[styles.container, fullscreen && styles.fbox, styles.bg_black, fullscreen && styles.ftbox]}>
                <Video 
                    paused = {paused}
                    ref={e => { this.player = e; }}
                    poster={cover}
                    rate={speeds[speed]}
                    posterResizeMode={'cover'}
                    source={{uri: playUrl}} 
                    resizeMode={'cover'} 
                    style={[styles.container, fullscreen && styles.fcontainer]}

                    fullscreenAutorotate={true}
                    fullscreenOrientation={'landscape'}

                    onFullscreenPlayerWillPresent={() => {
                        this.setState({
                            fullscreen: true
                        })

                        onFullscreen && onFullscreen(true);
                    }}

                    onFullscreenPlayerWillDismiss={() => {
                        this.setState({
                            fullscreen: false
                        })

                        onFullscreen && onFullscreen(false);
                    }}

                    onLoad={(data) => {
                        console.info('load');
                        this.setState({
                            paused: false,
                            duration: parseInt(data.duration)
                        }, () => {
                            if (current >= 0) {
                                this.player.seek(current);
                            }
                        })
                    }}

                    onProgress={(data) => {
                        const current = parseInt(data.currentTime);
                        AsyncStorage.setItem(key, current + '').then(status => {
                            
                        })
                        this.setState({
                            current: current,
                        })

                        onProgress && onProgress(current)
                    }}

                    onEnd={(data) => {
                        this.setState({
                            paused: true,
                        }, () => {
                            onEnd && onEnd();
                        })
                    }}
                />
                <View {...this.seekPanResponder.panHandlers} collapsable={false} style={[styles.hand]}>
                    <TouchableOpacity style={[styles.f1]} onPress={() => this.setState({
                        control: !this.state.control
                    })}/>
                </View>
                {playUrl != '' && control && speed_choose ?
                <View style={[styles.speed]}>
                    {speeds.map((speed, index) => {
                        return (
                            <TouchableOpacity key={'speed_' + index} style={[styles.p_10, styles.ai_ct]} onPress={() => this._onSpeed(index)}>
                                <Text style={[styles.label_white, styles.label_12]}>{speed}x</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                : null}
                {playUrl != '' && control ?
                <View style={[styles.p_5, styles.tipbar, styles.row, styles.ai_ct, styles.jc_sb]} onLayout={() => {
                    this.fts && BackgroundTimer.clearTimeout(this.fts);
                    this.fts = BackgroundTimer.setTimeout(() => {
                        this.setState({
                            control: false,
                        })
                    }, 5000)
                }}>
                    <TouchableOpacity onPress={this._onPauseToggle} hitSlop={{top: 5, left: 5, bottom: 5, right: 5}}>
                        <Text style={[styles.icon, styles.label_white]}>{iconMap(!paused ? 'zanting' : 'bofang')}</Text>
                    </TouchableOpacity>
                    {showProgress ?
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={duration}
                        minimumTrackTintColor="#F4623F"
                        maximumTrackTintColor="#FFFFFF"
                        value={current}
                        thumbImage={asset.course.track}
                        onValueChange={(value) => {
                            this.setState({
                                current: value,
                            }, () => {
                                this.player.seek(value);
                            })
                            
                        }}
                    />
                    : null}

                    <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
                        <Text style={[styles.label_9, styles.label_white]}>{tool.formatSTime(current) + '/' + tool.formatSTime(duration)}</Text>
                        {showSpeed ?
                        <TouchableOpacity style={[styles.ml_10]} onPress={() => {
                            this.setState({
                                speed_choose: !speed_choose,
                            })
                        }}>
                            <Text style={[styles.label_white, styles.label_12]}>{speeds[speed]}x</Text>
                        </TouchableOpacity>
                        : null}
                        <TouchableOpacity onPress={this._onFullToggle} style={[styles.m_10]}>
                            <Text style={[styles.icon, styles.label_white]}>{iconMap(fullscreen ? 'suoxiao' : 'quanping')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                : null}
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
    ftbox: {
        width: theme.window.height,
        height: theme.window.width,
    },
    fbox: {
        position: 'absolute',
        top: 0,
        left:0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
    },
    fcontainer: {
        width: theme.window.height,
        height: theme.window.width,
    },
    hand: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    tipbar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    speed: {
        position: 'absolute',
        right: 15,
        bottom: 45,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    slider: {
        width: '65%',
        height: 30,
    }
});

//make this component available to the app
export default VodPlayer;