//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, View, StyleSheet, Text, Image, TouchableOpacity, FlatList } from 'react-native';

import VodCell from '../../component/course/VodCell';
import VVodCell from '../../component/course/VVodCell';

import TabView from '../../component/base/TabView';
import iconMap from '../../config/font';
import asset from '../../config/asset';
import theme from '../../config/theme';

// create a component
class CourseChannel extends Component {

    static navigationOptions = {
        title:'精品资源',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);


        const {navigation} = props;
        this.channel = navigation.getParam('channel', {});
        this.ctype = navigation.getParam('ctype', 0);

        this.courses = [];

        this.state = {
            loaded: false,
            type: 0,
            single: true,
        }

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    componentDidMount() {
        this._onHeaderRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {channel} = nextProps;
        if (channel !== this.props.channel) {
            this.courses = channel;

            this.setState(({
                loaded: true,
            }))
        }
    }

    _onHeaderRefresh() {
        const {actions} = this.props;

        this.items = [];
        this.page = 1;
        this.pages = 1;
        
        actions.site.channel(this.channel.channelId, this.state.type);
    }

    renderItem(item) {
        const {navigation} = this.props;
        const {single} = this.state;
        const course = item.item;

        if (single) {
            return (
                <VodCell course={course} onPress={()=> navigation.navigate(this.ctype == 0 ? 'Vod' : 'Audio', {course: course})}/>
            )
        }
        
        return (
            <VVodCell style={[styles.vod, (item.index + 1) % 2 == 1 && styles.mr_20]} course={course} onPress={()=> navigation.navigate(this.ctype == 0 ? 'Vod' : 'Audio', {course: course})}/>
        )
    }

    render() {
        const {loaded, type, single} = this.state;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#00A6F6"/>
            </View>
        )
        
        return (
            <View style={styles.container}>
                <View style={[styles.row, styles.ai_ct]}>
                    <TabView style={[styles.f4]} items={['最新', '最热']} center={true} current={type} onSelected={(index) => {
                        this.setState({
                            type: index
                        }, () => {
                            this._onHeaderRefresh();
                        })
                    }}/>
                    <TouchableOpacity style={[styles.f1]} onPress={()=> this.setState({
                        single: !single,
                    })}>
                        <Text style={[styles.label_gray]}><Text style={[styles.icon, styles.label_gray]}>{iconMap(single ? 'danpai' : 'shuangpaibanshi')}</Text> {single ? '单排' : '双排'}版式</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    key={single ? 'list_h' : 'list_v'}
                    contentContainerStyle={[styles.p_20]}
                    numColumns={single ? 1 : 2}
                    data={this.courses}
                    extraData={this.state}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this.renderItem}
                    ListEmptyComponent={() => {
                        return (
                            <View style={[styles.ai_ct, styles.jc_ct]}>
                                <Image source={asset.base.empty} style={[styles.empty, styles.mt_25]}/>
                            </View>
                        )
                    }}
                />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    vod: {
        width: (theme.window.width - 60) / 2,
    },
});

export const LayoutComponent = CourseChannel;

export function mapStateToProps(state) {
    return {
        channel: state.site.channel,
    };
}