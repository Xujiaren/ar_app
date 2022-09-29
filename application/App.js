import React, { Component } from 'react';
import { View, StatusBar, Text, Image, TouchableOpacity, DeviceEventEmitter, Modal, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import NetInfo from "@react-native-community/netinfo";
import * as WeChat from 'react-native-wechat-lib';
import JAnalytics from 'janalytics-react-native';

import configureStore from './redux';
import {AppNav} from './config/route';
import * as request from './util/net';
import config from './config/param';
import iconMap from './config/font';
import asset from './config/asset';
import theme from './config/theme';

function getCurrentRouteName(navigationState) {
    if (!navigationState) {
      return null;
    }
    
    const route = navigationState.routes[navigationState.index];
    
    if (route.routes) {
      return getCurrentRouteName(route);
    }
    return route.routeName;
}

const store = configureStore();

class App extends Component {
    
    constructor(props) {
        super(props);

        this.share = {};
        
        this.state = {
            share: false,
            net: true,
        }

        this.onShare = this.onShare.bind(this);
    }

    componentDidMount() {
        
        this.shareSub = DeviceEventEmitter.addListener('share', (data) => {

            this.share = data;
            this.setState({
                share: true,
            })
        });

        this.statSub = DeviceEventEmitter.addListener('share', (data) => {
            
        });

        this.netSub = NetInfo.addEventListener(state => {
            this.setState({
                net: state.isConnected
            })
        });
    }

    componentWillUnmount() {
        this.shareSub && this.shareSub.remove();
        this.netSub && this.netSub();
    }

    onShare(type) {
        this.setState({
            share: false,
        }, () => {
            if(this.share.type=='vod'||this.share.type=='audio'||this.share.type=='article'||this.share.type=='live'){
                request.post('/user/share/course/'+this.share.id)
            }
            WeChat.isWXAppInstalled().then((installed) => {
                if (installed) {
                    let url = config.site;

                    if (this.share.type != 'comment') {
                        url = config.site + 'share/' + this.share.type + '.html?id=' + this.share.id + '&fromuid=' + global.uid + '&utype=' + global.utype;
                    }
                    
                    WeChat.shareWebpage({
                        title: this.share.title,
                        description: this.share.title,
                        thumbImageUrl: this.share.img,
                        webpageUrl: url,
                        scene: type
                    })
                    DeviceEventEmitter.emit('shared', this.share);

                }
            });  
        })
    }

    render() {
        const {share, net} = this.state;

        if (!net) {
            return (
                <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                    <Image source={asset.base.net} style={styles.eicon} resizeMode={'contain'}/>
                    <Text style={[styles.label_gray, styles.mt_15]}>网络不给力哦</Text>
                </View>
            )
        }

        return (
            <Provider store={store}>
                <View style={styles.container}>
                    <StatusBar barStyle="default" translucent={false} backgroundColor={'#00A6F6'}/>
                    <AppNav onNavigationStateChange={(prevState, currentState) => {
                            const currentScreen = getCurrentRouteName(currentState);
                            const prevScreen = getCurrentRouteName(prevState);

                            if (prevScreen !== currentScreen) {
                                JAnalytics.startLogPageView({pageName: currentScreen});
                                JAnalytics.stopLogPageView({pageName: prevScreen});
                            }
                        }}
                    />

                    <Modal visible={share} transparent={true} onRequestClose={() => {
                        this.setState({share:false})
                    }}>
                        <TouchableOpacity style={[styles.modal]} onPress={()=>this.setState({share:false})}/>
                        <View style={[styles.share, styles.bg_white, styles.p_25, styles.row, styles.ai_ct, styles.jc_ad]}>
                            <TouchableOpacity style={[styles.ai_ct]} onPress={() => this.onShare(0)}>
                                <Text style={[styles.icon, {fontSize: 44, color: '#1ABE4D'}]}>{iconMap('weixin')}</Text>
                                <Text style={[styles.mt_10]}>微信好友</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.ai_ct]} onPress={() => this.onShare(1)}>
                                <Text style={[styles.icon,  {fontSize: 44, color: '#1ABE4D'}]}>{iconMap('pengyouquan')}</Text>
                                <Text style={[styles.mt_10]}>微信朋友圈</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
            </Provider>
        );
    }
}

const styles =  StyleSheet.create({
    ...theme,
    eicon: {
        width: 200,
        height: 200,
    },
    share: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    }
});

export default App;