//import liraries
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import RefreshListView, {RefreshState} from '../../../component/base/RefreshListView';
import asset from '../../../config/asset';
import theme from '../../../config/theme';

// create a component
class MapChannel extends Component {

    static navigationOptions = {
        title:'学习地图',
        headerRight: () => <View/>
    };

    constructor(props) {
        super(props);

        this.maps = [];

        this.state = {
            refreshState: RefreshState.Idle,
        }

        this._renderItem = this._renderItem.bind(this);
        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
    }

    componentDidMount() {
        const {navigation} = this.props;

        this.focuSub = navigation.addListener('didFocus', (route) => {
            this._onHeaderRefresh();
        })
    }

    componentWillUnmount(){
        this.focuSub && this.focuSub.remove();
    }

    componentWillReceiveProps(nextProps) {
        const {map} = nextProps;

        if (map !== this.props.map) {
            this.maps = this.maps.concat(map.items);
            this.total = map.total;
            this.pages = map.pages;
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    _onHeaderRefresh() {
        const {actions} = this.props;

        this.page = 0;
        this.pages = 1;
        this.total = 0;
        this.maps = [];

        actions.course.map(0);
        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
        const {actions} = this.props;

        if (this.page < this.pages) {
            this.setState({refreshState: RefreshState.FooterRefreshing});
            this.page = this.page + 1;
            actions.course.map(this.page);
        } else {
            this.setState({refreshState: RefreshState.NoMoreData});
        }
    }

    _renderItem(item) {
        const {navigation} = this.props;
        const map = item.item;
        
        return (
            <TouchableOpacity style={[styles.pb_15, styles.b_line, styles.mb_15]} onPress={() => navigation.navigate('Map', {map: map})}>
                <Image source={{uri: map.mapImg}} style={[styles.thumb, styles.bg_l1gray, styles.circle_5]}/>
                <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.pt_15]}>
                    <Text>{map.mapName}</Text>
                    <Text style={[styles.label_gray]}>{map.finish ? '已完成' : '未完成'}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <RefreshListView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.p_20]}
                    data={this.maps}
                    extraData={this.state}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this._onHeaderRefresh}
                    onFooterRefresh={this._onFooterRefresh}
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
    thumb: {
        height: 130,
    }
});

export const LayoutComponent = MapChannel;

export function mapStateToProps(state) {
    return {
        map: state.course.map,
    };
}