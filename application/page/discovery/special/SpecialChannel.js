//import liraries
import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';

import RefreshListView, {RefreshState} from '../../../component/base/RefreshListView';
import SpecialCell from '../../../component/discovery/SpecialCell';
import asset from '../../../config/asset';
import theme from '../../../config/theme';

// create a component
class SpecialChannel extends Component {

    constructor(props) {
        super(props);

        this.total = 0;
        this.page = 0;
        this.pages = 1;

        this.specials = [];

        this.state = {
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
        const {special} = nextProps;

        if (special !== this.props.special && special.items) {
            this.specials = this.specials.concat(special.items);
            this.total = special.total;
            this.pages = special.pages;
            this.page = special.page;
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    _onHeaderRefresh() {
        const {actions} = this.props;

        this.total = 0;
        this.page = 0;
        this.pages = 1;
        
        this.specials = [];

        actions.news.special(0);
        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
        const {actions} = this.props;

        if (this.page < this.pages) {
            this.setState({refreshState: RefreshState.FooterRefreshing});
            this.page = this.page + 1;
            actions.news.special(this.page);
        } else {
            this.setState({refreshState: RefreshState.NoMoreData});
        }
    }

    _renderItem(item) {
        const {navigation} = this.props;
        
        const special = item.item;
        return (
            <SpecialCell style={[styles.mb_15]} special={special} onPress={() => navigation.navigate('Special', {special: special})}/>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <RefreshListView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.p_20]}
                    data={this.specials}
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

export const LayoutComponent = SpecialChannel;

export function mapStateToProps(state) {
    return {
        special: state.news.special,
    };
}