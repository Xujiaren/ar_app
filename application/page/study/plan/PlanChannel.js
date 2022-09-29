//import liraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, Alert, StyleSheet } from 'react-native';

import RefreshListView, {RefreshState} from '../../../component/base/RefreshListView';
import asset from '../../../config/asset';
import theme from '../../../config/theme';

const status = ['进行中', '未开始', '已结束'];
// create a component
class PlanChannel extends Component {

    static navigationOptions = {
        title:'学习计划',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        this.page = 0;
        this.pages = 1;
        this.total = 0;
        this.plans = [];

        this.state = {
            refreshState: RefreshState.Idle,
        }

        this.onPlan = this.onPlan.bind(this);
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
        const {plan} = nextProps;

        if (plan !== this.props.plan) {
            this.plans = this.plans.concat(plan.items);
            this.total = plan.total;
            this.pages = plan.pages;
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    _onHeaderRefresh() {
        const {actions} = this.props;

        this.page = 0;
        this.pages = 1;
        this.total = 0;
        this.plans = [];

        actions.study.plan(0);
        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
        const {actions} = this.props;

        if (this.page < this.pages) {
            this.setState({refreshState: RefreshState.FooterRefreshing});
            this.page = this.page + 1;
            actions.study.plan(this.page);
        } else {
            this.setState({refreshState: RefreshState.NoMoreData});
        }
    }

    onPlan(plan) {
        const {navigation, actions} = this.props;
        
        if (plan.receive) {
            navigation.navigate('Plan', {plan: plan});
        } else {
            Alert.alert('学习计划', '是否同意参与该学习计划', [
                {text: '确认', onPress: () => {
                    actions.study.accept({
                        plan_id: plan.planId,
                        resolved: (data) => {
                            navigation.navigate('Plan', {plan: plan});
                        },
                        rejected: (msg) => {
                            
                        }
                    })
                }},
                {text: '取消', onPress: () => {
                    
                }, style: 'cancel'}
            ]);
        }
    }

    _renderItem(item) {
        const {navigation} = this.props;
        const plan = item.item;

        return (
            <TouchableOpacity style={[styles.pb_15, styles.b_line, styles.mb_15]} disabled={plan.astatus > 0} onPress={() => this.onPlan(plan)}>
                <ImageBackground source={{uri: plan.planImg}} style={[styles.thumb, styles.bg_l1gray, styles.circle_5]}>
                    <View style={[styles.status]}>
                        <Text style={[styles.label_white]}>{plan.finish ? '已完成' : '待完成'}</Text>
                    </View>
                </ImageBackground>
                <View style={[styles.pt_15]}>
                    <Text>[{status[plan.astatus]}] {plan.planName}</Text>
                    <Text style={[styles.label_gray]}>计划时间：{plan.startTimeFt}-{plan.endTimeFt}</Text>
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
                    data={this.plans}
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
    },
    status: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderWidth: 1,
        borderColor: 'white',
        padding: 3,
        paddingLeft: 5,
        paddingRight: 5,
    },
});

export const LayoutComponent = PlanChannel;

export function mapStateToProps(state) {
    return {
        plan: state.study.plan,  
    };
}