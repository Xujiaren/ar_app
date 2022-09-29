import React, { Component } from 'react';

import {YellowBox, Platform} from 'react-native';

import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { setCustomText, setCustomTextInput } from 'react-native-global-props';
import store from 'react-native-simple-store';
import Sound from 'react-native-sound';
import BackgroundTimer from 'react-native-background-timer';
import * as WeChat from 'react-native-wechat-lib';
import SplashScreen from 'react-native-splash-screen';
import JPush from 'jpush-react-native';
import config from './config/param';
import App from './App';

function init() {

    console.disableYellowBox = true;
    YellowBox.ignoreWarnings(['Warning: ...']);


    enableScreens();

    const customTextProps = {
        style: {
            fontSize: 14,
            color: '#333333',
            fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue' : 'Roboto',
        },
    };

    const customTextInputProps = {
        underlineColorAndroid: 'transparent',
        autoCapitalize: 'none',
        autoCorrect: false,
        clearButtonMode: 'while-editing',
    }
    
    setCustomText(customTextProps);
    setCustomTextInput(customTextInputProps);

    Sound.setActive(true);
    Sound.enableInSilenceMode(true);
    Sound.setCategory('Playback', true);

    global.os = Platform.OS === 'ios' ? 1 : 2;
    global.uid = 0;
    global.fromuid = 0;
    global.token = '';
    global.tip = 1;
    global.cards = [];
    global.cardCodes = [];
    global.utype = 0;
    global.ticon = [];
    global.agree = 0;
    global.scores = [];

    class Root extends Component {

        constructor(props){
            super(props);
            this.state = {
                loaded: false,
            };
        }

        componentDidMount() {
            SplashScreen.hide();

            WeChat.registerApp(config.wechat, config.universalLink).then(res => {
                //console.info(res);
            });

            JPush.init();

            //连接状态
            this.connectListener = result => {
                console.log("connectListener:" + JSON.stringify(result))
            };

            JPush.addConnectEventListener(this.connectListener);

            //通知回调
            this.notificationListener = result => {
                console.log("notificationListener:" + JSON.stringify(result))
            };
            
            JPush.addNotificationListener(this.notificationListener);

            //本地通知回调
            this.localNotificationListener = result => {
                console.log("localNotificationListener:" + JSON.stringify(result))
            };

            JPush.addLocalNotificationListener(this.localNotificationListener);
            
            //tag alias事件回调
            this.tagAliasListener = result => {
                console.log("tagAliasListener:" + JSON.stringify(result))
            };
            JPush.addTagAliasListener(this.tagAliasListener);
            
            //手机号码事件回调
            this.mobileNumberListener = result => {
                console.log("mobileNumberListener:" + JSON.stringify(result))
            };
            
            JPush.addMobileNumberListener(this.mobileNumberListener);

            store.get(["token", "tip", "cards", "utype", "ticon", "agree", "cardcodes"]).then(data => {
                global.token = data[0] || '';
                global.tip = data[1] || 1;
                global.cards = data[2] || [];
                global.utype = data[3] || 0;
                global.ticon = data[4] || [];
                global.agree = data[5] || 0;
                global.cardCodes = data[6] || [];

                this.setState({
                    loaded: true
                })
            });

            BackgroundTimer.start();
        }

        componentWillUnmount() {
            BackgroundTimer.stop();
        }

        render() {
            if (!this.state.loaded) return null;

            return (
                <App/>
            );
        }
    }

    return Root;
}

module.exports = init;