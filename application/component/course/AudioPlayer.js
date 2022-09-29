//import liraries
import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { Slider } from "@miblanchard/react-native-slider";

import Sound from 'react-native-sound';
import BackgroundTimer from 'react-native-background-timer';

import _ from 'lodash';

import iconMap from '../../config/font';
import theme from '../../config/theme';
import * as tool from '../../util/tool';

// create a component
class AudioPlayer extends Component {

    constructor(props) {
        super(props);

        const {source = {
            key: '',
            cover: '',
            url: '',
            duration: 0,
            showProgress:0,
        }} = props;

        this.state = {
            key: source.key,
            cover: source.cover,
            playUrl: source.url,
            duration: source.duration,
            showProgress:source.showProgress,
            paused: true,
            current: 0,
        }

        this.onLoad = this.onLoad.bind(this);
        this.onStop = this.onStop.bind(this);
        this.onPlay = this.onPlay.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const {source} = nextProps;

        if (!_.isEqual(source, this.props.source)) {
            this.setState({
                key: source.key,
                cover: source.cover,
                playUrl: source.url,
                duration: source.duration,
                paused: true,
                current: 0,
            }, () => {
                this.onLoad();
            })
        }
    }

    componentDidMount() {
        this.onLoad();
    }

    componentWillUnmount() {
        this.mts && BackgroundTimer.clearInterval(this.mts);
        this.sound && this.sound.release();
    }

    onStop() {
        if (this.sound) {
            if (this.sound.isPlaying()) {
                this.sound.pause();
                this.setState({
                    paused: true,
                })
            } else {
                this.onPlay(null, this.sound)
            }
        }
        
    }

    onLoad() {
        const {playUrl} = this.state;
        if (playUrl == '') return;

        if (this.sound) {
            this.sound.release();
        }

        this.sound = new Sound(playUrl, null, error => this.onPlay(error, this.sound));
    }

    onPlay(error, sound) {
        if (error) {
            return;
        }

        this.setState({
            paused: false,
        })

        this.mts && BackgroundTimer.clearInterval(this.mts);
        this.mts = BackgroundTimer.setInterval(() => {
            sound.getCurrentTime(sec => {
                this.props.onProgress && this.props.onProgress(parseInt(sec));
                this.setState({
                    current: sec
                })
            })
        }, 250);

        sound.play(() => {
            this.setState({
                paused: true,
            })

            this.mts && BackgroundTimer.clearInterval(this.mts);
            this.props.onEnd && this.props.onEnd();
            sound.release();
        })
    }

    render() {

        const {cover, paused, duration, current,showProgress} = this.state;

        return (
            <View style={[styles.container, styles.bg_white, styles.p_20]}>
                <Image source={{uri: cover}} style={[styles.thumb, styles.bg_l1gray, styles.as_ct, styles.mt_30]}/>
                <View style={[styles.mt_20]}/>
                <Slider maximumValue={duration} value={current} minimumTrackTintColor={'#00A6F6'} trackStyle={styles.track} onSlidingComplete={(sec) => {
                    if(showProgress==1){
                        this.setState({
                            current: sec
                        }, () => {
                            this.sound && this.sound.isPlaying() && this.sound.setCurrentTime(parseFloat(sec));
                        })
                    }
                }} renderThumbComponent={()=> {
                    return (
                        <View style={[styles.bg_blue, styles.p_5, styles.circle_10]}>
                            <Text style={[styles.label_9, styles.label_white]}>{tool.formatSTime(current)}/{tool.formatSTime(duration)}</Text>
                        </View>
                    )
                }}/>
                <View style={[styles.mt_20, styles.row, styles.ai_ct, styles.jc_sb]}>
                    <View style={[styles.f1]}>
                        <Text></Text>
                    </View>
                    <View style={[styles.row, styles.ai_ct, styles.f6]}>
                        <TouchableOpacity style={[styles.f1, styles.ai_ct]} onPress={() => this.props.onPrev && this.props.onPrev()}>
                            <Text style={[styles.icon, styles.label_20]}>{iconMap('shangyishou')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.f1, styles.ai_ct]} onPress={() => this.onStop()}>
                            <Text style={[styles.icon, styles.label_36]}>{iconMap(paused ? 'bofang' : 'zanting')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.f1, styles.ai_ct]} onPress={() => this.props.onEnd && this.props.onEnd()}>
                            <Text style={[styles.icon, styles.label_20]}>{iconMap('xiayishou')}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={[styles.f1]} onPress={() => this.props.onPlayList && this.props.onPlayList()}>
                        <Text style={[styles.icon, styles.label_20, styles.label_dgray]}>{iconMap('bofangliebiao')}</Text>
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
    },
    thumb: {
        width: theme.window.width * 0.55,
        height: theme.window.width * 0.55,
    },
    track: {
        height: 2,
        backgroundColor: 'rgba(0, 184, 248, 0.25)',
    }
});

//make this component available to the app
export default AudioPlayer;
