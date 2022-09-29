import React, { Component } from 'react';
import VideoPlayer from 'react-native-video-controls';

import { DeviceEventEmitter } from 'react-native'

import HTML from 'react-native-render-html';
import Video from 'react-native-video';

import theme from '../../config/theme';

const IGNORED_TAGS = ['head', 'scripts', 'track', 'embed', 'object', 'param', 'source', 'canvas', 'noscript',
'caption', 'col', 'colgroup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'button', 'datalist', 'fieldset', 'form',
'input', 'label', 'legend', 'meter', 'optgroup', 'option', 'output', 'progress', 'select', 'textarea', 'details', 'diaglog',
'menu', 'menuitem', 'summary'];

const IGNORED_STYLES = ['line-height', 'font-family'];

class HtmlPlayer extends Component {

    constructor(props) {
        super(props)

        this.vkey = props.vkey;

        this.state = {
            paused: true,
            currentTime: 0,
        }
    }

    componentDidMount() {
        this.sub = DeviceEventEmitter.addListener('video', (data) => {
            if (this.vkey !== data) {
                this.setState({
                    paused: true,
                })
            }
        })
    }

    componentWillUnmount() {
        this.sub && this.sub.remove();
    }

    render() {
        const {src, poster, vkey} = this.props;
        const {paused} = this.state;

        const cover = poster != "" ? poster : src + "?x-oss-process=video/snapshot,t_10000,m_fast";
        
        return (
            <VideoPlayer 
                source={{uri: src}} 
                poster={cover} 
                style={{width: theme.window.width - 40, height: (theme.window.width - 40) * 0.563,marginBottom: 10,marginTop: 10,}} 
                paused={paused} 
                controls={false}
                disableSeekbar={true}
                disableBack={true}
                disableFullscreen={true}
                disableVolume={true}
                ref={ref => (this.player = ref)}
                onPlay={(data)=> {
                    this.setState({
                        paused: false,
                    })
                    DeviceEventEmitter.emit('video', vkey);
                    
                }}
            />
        )
    }
}


const renderers = {
    video : (htmlAttribs, children, convertedCSSStyles, passProps) => {
        return  <HtmlPlayer src={htmlAttribs.src} poster={htmlAttribs.poster} key={passProps.key} vkey={passProps.key}/>       
    },
    audio : (htmlAttribs, children, convertedCSSStyles, passProps) => {
        return  <Video audioOnly={true} controls={true} key={passProps.key} source={{uri: htmlAttribs.src}} poster={htmlAttribs.poster} style={{width: theme.window.width - 30, height: 50}} paused={false}/>
    }
}

class HtmlView extends Component {
    render() {
        
        return <HTML {...this.props} 
                imagesMaxWidth={theme.window.width - 40} 
                ignoredStyles={IGNORED_STYLES}  
                renderers={renderers}             
                ignoredTags={IGNORED_TAGS} 
                // onLinkPress={(evt, href) => {
                //     // Linking.openURL(href);
                //     // console.log(href)
                // }}
                onLinkPress = {this.props.onLinkPress}
        />
    }
}

//make this component available to the app
export default HtmlView;