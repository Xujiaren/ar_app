//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, View, Image, FlatList, StyleSheet } from 'react-native';

import VodCell from '../../../component/course/VodCell';
import asset from '../../../config/asset';
import theme from '../../../config/theme';

// create a component
class Plan extends Component {

    static navigationOptions = ({navigation}) => {
        const plan = navigation.getParam('plan', {planName: '计划详情'});
		return {
            title: plan.planName || '计划详情',
            headerRight: () => <View/>
		}
    };

    constructor(props) {
        super(props);

        const {navigation} = this.props;
        this.plan = navigation.getParam('plan', {});

        this.items = [];

        this.state = {
            loaded: false,
        }

        this.onRefresh = this.onRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    componentDidMount() {
        const {navigation} = this.props;

        this.focuSub = navigation.addListener('didFocus', (route) => {
            this.onRefresh();
        })
    }

    componentWillReceiveProps(nextProps) {
        const {plan_info} = nextProps;

        if (plan_info !== this.props.plan_info) {
            this.items = plan_info;

            this.setState({
                loaded: true,
            })
        }
    }

    onRefresh() {
        const {actions} = this.props;
        actions.user.user();
        actions.study.planInfo(this.plan.planId);
    }

    _renderItem(item) {
        const {navigation} = this.props;
        const course = item.item;

        let page = 'Vod';

        if (course.ctype == 1) {
            page = 'Audio';
        }

        return (
            <VodCell course={course} onPress={()=> navigation.navigate(page, {course: course, planId: this.plan.planId})}/>
        );
    }

    render() {
        const {loaded} = this.state;
        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#00A6F6"/>
            </View>
        )

        return (
            <View style={styles.container}>
                <FlatList
                    contentContainerStyle={styles.p_20}
                    showsVerticalScrollIndicator={false}
                    data={this.items}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this._renderItem}
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

const styles = StyleSheet.create({
    ...theme,
});

export const LayoutComponent = Plan;

export function mapStateToProps(state) {
    return {
        plan_info: state.study.plan_info,
    };
}