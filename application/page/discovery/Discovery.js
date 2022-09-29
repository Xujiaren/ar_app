//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, DeviceEventEmitter } from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';

import theme from '../../config/theme';
import connectComponent from '../../util/connect';

import * as ActivityChannelPage from './activity/ActivityChannel';
import * as SpecialChannelPage from './special/SpecialChannel';
import * as SquadChannelPage from './squad/SquadChannel';

const ActivityChannel = connectComponent(ActivityChannelPage);
const SpecialChannel = connectComponent(SpecialChannelPage);
const SquadChannel = connectComponent(SquadChannelPage);

// create a component
class Discovery extends Component {
    
    componentDidMount() {
        this.sub = DeviceEventEmitter.addListener('discover', (data) => {
            this.refs.pages && this.refs.pages.goToPage(parseInt(data));
        })
    }

    componentWillUnmount() {
        this.sub && this.sub.remove();
    }

    render() {
        const {navigation} = this.props;

        return (
            <View style={styles.container}>
                <ScrollableTabView ref={'pages'} initialPage={1} renderTabBar={() => <ScrollableTabView.DefaultTabBar style={styles.tab_container} tabStyle={styles.tab} />} tabBarUnderlineStyle={styles.tab_line} tabBarBackgroundColor={'white'} tabBarActiveTextColor={'#333333'} tabBarInactiveTextColor={'#999999'}>
                    <ActivityChannel tabLabel={'活动'} navigation={navigation}/>
                    <SpecialChannel tabLabel={'专题'} navigation={navigation}/>
                    <SquadChannel tabLabel={'线下培训'} navigation={navigation}/>
                </ScrollableTabView>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    tab_container: {
		borderBottomWidth: 1,
        borderBottomColor: '#FAFAFA',
	},
	tab: {
        paddingBottom: 2,
	},
    tab_line: {
		height: 2,
		backgroundColor: '#00A6F6',
	},
});

//make this component available to the app
export default Discovery;