//import liraries
import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';

import AskCell from '../../component/user/AskCell';
import RefreshListView, {RefreshState} from '../../component/base/RefreshListView';
import TabView from '../../component/base/TabView';
import asset from '../../config/asset';
import theme from '../../config/theme';

// create a component
class AskChannel extends Component {

    static navigationOptions = ({navigation}) => {
		return {
            title: '问答区',
            headerRight: () => {
                return (
                    <TouchableOpacity style={[styles.mr_15]} onPress={() => navigation.navigate('UserAsk')}>
                        <Text>我的问答</Text>
                    </TouchableOpacity>
                )
            }
		}
    };

    constructor(props) {
        super(props);

        this.total = 0;
        this.page = 0;
        this.pages = 1;

        this.category = [];
        this.items = [];

        this.state = {
            index: 0,
            refreshState: RefreshState.Idle,
        }

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    componentDidMount() {
        const {navigation, actions} = this.props;
        actions.config.categoryAsk();

        this.focuSub = navigation.addListener('didFocus', (route) => {
            this._onHeaderRefresh();
        })
    }

    componentWillUnmount(){
        this.focuSub && this.focuSub.remove();
    }

    componentWillReceiveProps(nextProps) {
        const {category, index} = nextProps;

        if (category !== this.props.category) {
            this.category = category;
        }

        if (index !== this.props.index && index.items) {
            this.items = this.items.concat(index.items);
            this.total = index.total;
            this.pages = index.pages;
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }
    
    _onHeaderRefresh() {
        const {actions} = this.props;
        const {index} = this.state;

        this.total = 0;
        this.page = 0;
        this.pages = 1;

        this.items = [];

        let category_id = 0;

        if (index > 0) {
            category_id = this.category[index - 1].categoryId;
        }

        actions.ask.index(category_id, '', 0, 0);
        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
        const {actions} = this.props;
        const {index} = this.state;

        let category_id = 0;

        if (index > 0) {
            category_id = this.category[index - 1].categoryId;
        }

        if (this.page < this.pages) {
            this.setState({refreshState: RefreshState.FooterRefreshing});
            this.page = this.page + 1;
            actions.ask.index(category_id, '', 0, this.page);
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
        const {navigation} = this.props;
        const {index} = this.state;

        let citems = ['全部'];
        this.category.map((category, index) => {
            citems.push(category.categoryName);
        });

        return (
            <View style={styles.container}>
                <TabView items={citems} current={index} onSelected={(index) => {
                    this.setState({
                        index: index,
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

                <TouchableOpacity style={[styles.bg_blue, styles.circle_5, styles.p_15, styles.m_20, styles.ai_ct]} onPress={() => navigation.navigate('PublishAsk')}>
                    <Text style={[styles.label_white]}>我要提问</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
});

export const LayoutComponent = AskChannel;

export function mapStateToProps(state) {
    return {
        category: state.config.category_ask,
        index: state.ask.index,
    };
}
