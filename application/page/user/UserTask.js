//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

import theme from '../../config/theme';

// create a component
class UserTask extends Component {

    static navigationOptions = {
        title:'我的任务',
        headerRight: <View/>
    };

    constructor(props) {
        super(props)

        this.items = [];

        this.state = {
            loaded: false,
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.onTask = this.onTask.bind(this);

        this.renderItem = this.renderItem.bind(this);
    }

    componentDidMount() {
        this.onRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {task} = nextProps;

        if (task !== this.props.task) {
            this.items = task;

            this.setState({
                loaded: true,
            })
        }
    }

    onRefresh() {
        const {actions} = this.props;
        actions.user.task();
    }

    onTask(link) {
        const {navigation} = this.props;

        let page = 'Home';
        if (link.indexOf('/user/userInfo') !== -1){
            page = 'Account';
        } else if (link.indexOf('/index/search') !== -1){
            page = 'Search';
        }

        navigation.navigate(page);
    }

    renderItem(item) {
        const task = item.item;
        const done = task.status == 1;

        return (
            <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.p_20]}>
                <View style={[styles.f7]}>
                    <Text>{task.taskName} <Text style={styles.label_blue}>+{task.integral}</Text></Text>
                    <Text style={[styles.label_12, styles.label_gray, styles.mt_5]}>{task.taskSummary}</Text>
                </View>
                <View style={[styles.f2]}>
                    <TouchableOpacity style={[styles.p_5, styles.pl_10, styles.pr_10, styles.circle_20, styles.bg_blue, done && styles.bg_gray, styles.ai_ct]} disabled={done} onPress={() => this.onTask(task.link)}>
                        <Text style={[styles.label_white]}>{done ? '已完成' : '去完成'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
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
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.p_20}
                    data={this.items}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this.renderItem}
                />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
});

export const LayoutComponent = UserTask;

export function mapStateToProps(state) {
    return {
        task: state.user.task,
    };
}