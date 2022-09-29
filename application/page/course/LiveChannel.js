//import liraries
import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';

import RefreshListView, {RefreshState} from '../../component/base/RefreshListView';

import TabView from '../../component/base/TabView';
import VodCell from '../../component/course/VodCell';
import asset from '../../config/asset';
import theme from '../../config/theme';

// create a component
class LiveChannel extends Component {

    static navigationOptions = {
        title:'直播回放',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        this.total = 0;
        this.page = 0;
        this.pages = 1;
        this.items = [];

        this.state = {
            type: 0,
            refreshState: RefreshState.Idle,
        }

        this._renderItem = this._renderItem.bind(this);
        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
    }

    componentDidMount() {
        this._onHeaderRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {playback} = nextProps;

        if (playback !== this.props.playback) {
            this.items = this.items.concat(playback.items);
            this.total = playback.total;
            this.pages = playback.pages;
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    _onHeaderRefresh() {
        const {actions} = this.props;
        const {type} = this.state;

        this.total = 0;
        this.page = 0;
        this.pages = 1;
        this.items = [];

        actions.course.playback(type, 0);
        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
        const {actions} = this.props;
        const {type} = this.state;

        if (this.page < this.pages) {
            this.setState({refreshState: RefreshState.FooterRefreshing});
            this.page = this.page + 1;
            actions.course.playback(type, this.page);
        } else {
            this.setState({refreshState: RefreshState.NoMoreData});
        }
    }

    _renderItem(item) {
        const {navigation} = this.props;
        const course = item.item;
        return (
            <VodCell course={course} onPress={() => navigation.navigate('Vod', {course: course})}/>
        )
    }

    render() {
        const {type} = this.state;
        
        return (
            <View style={styles.container}>
                <TabView items={['最新', '最热']} center={true} current={type} onSelected={(index) => {
                    this.setState({
                        type: index
                    }, () => {
                        this._onHeaderRefresh();
                    })
                }}/>
                <RefreshListView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.p_20]}
                    data={this.items}
                    extraData={this.state}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this._onHeaderRefresh}
                    onFooterRefresh={this._onFooterRefresh}
                    ListEmptyComponent={() => {
                        if (this.state.refreshState == RefreshState.Idle) {
                            return (
                                <View style={[styles.ai_ct, styles.jc_ct]}>
                                    <Image source={asset.base.empty} style={[styles.empty, styles.mt_25]}/>
                                </View>
                            )
                        }

                        return null;
                    }}
                />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
});

export const LayoutComponent = LiveChannel;

export function mapStateToProps(state) {
    return {
        playback: state.course.playback,
    };
}