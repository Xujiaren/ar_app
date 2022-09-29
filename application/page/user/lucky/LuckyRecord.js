//import liraries
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

import RefreshListView, {RefreshState} from '../../../component/base/RefreshListView';
import asset from '../../../config/asset';
import theme from '../../../config/theme';

// create a component
class LuckyRecord extends Component {

    static navigationOptions = {
        title:'中奖记录',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        this.page = 0;
        this.pages = 1;
        this.total = 0;
        this.items = [];

        this.state = {
            type: 0,
            refreshState: RefreshState.Idle,
        }

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    componentDidMount() {
        this._onHeaderRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {reward} = nextProps;

        if (reward !== this.props.reward) {
            this.page = reward.page;
            this.pages = reward.pages;
            this.total = reward.total;
            this.items = this.items.concat(reward.items);
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    _onHeaderRefresh() {
        const {actions} = this.props;

        this.page = 0;
        this.pages = 1;
        this.total = 0;
        this.items = [];

        actions.activity.reward(0);
        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
        const {actions} = this.props;

        if (this.page < this.pages) {
            this.page = this.page + 1;
            actions.activity.reward(this.page);
            this.setState({refreshState: RefreshState.FooterRefreshing});
        } else {
            this.setState({refreshState: RefreshState.NoMoreData});
        }
    }

    _renderItem(item) {
        const reward = item.item;

        return (
            <View style={[styles.p_15, styles.pl_20, styles.pr_20]}>
                <Text>获得 {reward.itemName}</Text>
                <Text style={[styles.label_gray, styles.label_12, styles.mt_5]}>{reward.pubTimeFt}</Text>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <RefreshListView
                    showsVerticalScrollIndicator={false}
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

export const LayoutComponent = LuckyRecord;

export function mapStateToProps(state) {
    return {
        reward: state.activity.reward,
    };
}