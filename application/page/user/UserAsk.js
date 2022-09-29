//import liraries
import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';

import RefreshListView, {RefreshState} from '../../component/base/RefreshListView';
import TabView from '../../component/base/TabView';
import AskCell from '../../component/user/AskCell';
import asset from '../../config/asset';
import theme from '../../config/theme';

// create a component
class UserAsk extends Component {

    static navigationOptions = {
        title:'我的问答',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        this.page = 0;
        this.pages = 0;
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
        const {user_answer, user_ask} = nextProps;
        
        if (user_ask !== this.props.user_ask) {
            this.items = this.items.concat(user_ask.items);
            this.total = user_ask.total;
            this.pages = user_ask.pages;
        }

        if (user_answer !== this.props.user_answer) {
            this.items = this.items.concat(user_answer.items);
            this.total = user_answer.total;
            this.pages = user_answer.pages;
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    _onHeaderRefresh() {
        const {actions} = this.props;
        const {type} = this.state;

        this.page = 0;
        this.pages = 0;
        this.total = 0;
        this.items = [];

        if (type == 0) {
            actions.ask.userAsk(0);
        } else {
            actions.ask.userAnswer(0);
        }

        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
        const {actions} = this.props;
        const {type} = this.state;

        if (this.page < this.pages) {
            this.setState({refreshState: RefreshState.FooterRefreshing});
            this.page = this.page + 1;
            
            if (type == 0) {
                actions.ask.userAsk(this.page);
            } else {
                actions.ask.userAnswer(this.page);
            }
        } else {
            this.setState({refreshState: RefreshState.NoMoreData});
        }

    }

    _renderItem(item) {
        const {navigation} = this.props;
        const ask = item.item;

        return (
            <AskCell ask={ask} onPress={() => navigation.navigate('Ask', {ask: ask})}/>
        )
    }

    render() {
        const {type} = this.state;

        return (
            <View style={styles.container}>
                <TabView items={['提问', '回答']} current={type} center={true} onSelected={(index) => {
                    this.setState({
                        type: index
                    }, () => this._onHeaderRefresh());
                }}/>
                <RefreshListView
                    contentContainerStyle={[styles.p_20]}
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

export const LayoutComponent = UserAsk;

export function mapStateToProps(state) {
    return {
        user_ask: state.ask.user_ask,
        user_answer: state.ask.user_answer,
    };
}