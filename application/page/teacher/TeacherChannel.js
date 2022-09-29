//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import RefreshListView, {RefreshState} from '../../component/base/RefreshListView';
import TeacherCell from '../../component/teacher/TeacherCell';
import HudView from '../../component/base/HudView';
import theme from '../../config/theme';

// create a component
class TeacherChannel extends Component {

    static navigationOptions = {
        title:'讲师',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        this.page = 0;
        this.pages = 0;
        this.total = 0;
        this.items = [];

        this.state = {
            index: 0,
            refreshState: RefreshState.Idle,
        }

        this._renderItem = this._renderItem.bind(this);
        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);

        this.onFollow = this.onFollow.bind(this);
    }

    componentDidMount() {
        this._onHeaderRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {index} = nextProps;

        if (index !== this.props.index) {
            this.items = this.items.concat(index.items);
            this.total = index.total;
            this.pages = index.pages;
            this.page = index.page;
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    _onHeaderRefresh() {
        const {actions} = this.props;

        this.page = 0;
        this.pages = 1;
        this.total = 0;
        this.items = [];

        actions.teacher.index(0);
        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
        const {actions} = this.props;
        if (this.page < this.pages) {
            this.setState({refreshState: RefreshState.FooterRefreshing});
            this.page = this.page + 1;
            actions.teacher.index(this.page);

        } else {
            this.setState({refreshState: RefreshState.NoMoreData});
        }
    }

    onFollow(index) {
        const {navigation, actions, user} = this.props;

        if (!user.userId) {
            navigation.navigate('PassPort');
        } else {
            let teacher = this.items[index];

            if (teacher.isFollow) {
                teacher.isFollow = false;
                actions.user.unfollowTeacher({
                    teacher_id: teacher.teacherId,
                    resolved: (data) => {
                        this.refs.hud.show('取消关注', 1);
                    },
                    rejected: (res) => {
                        
                    },
                });

            } else {
                teacher.isFollow = true;
                actions.user.followTeacher({
                    teacher_id: teacher.teacherId,
                    resolved: (data) => {
                        this.refs.hud.show('关注成功', 1);
                    },
                    rejected: (res) => {
                        
                    },
                });
            }

            this.items[index] = teacher;

            this.setState({
                index: index
            })
        }
    }

    _renderItem(item) {
        const {navigation} = this.props;
        const teacher = item.item;
        return (
            <TeacherCell style={[styles.mb_15]} teacher={teacher} onFollow={()=> this.onFollow(item.index)} onPress={() => navigation.navigate('Teacher', {teacher: teacher})}/>
        )
    }

    render() {
        return (
            <View style={styles.container}>
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
                />
                <HudView ref={'hud'} />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
});

export const LayoutComponent = TeacherChannel;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        index: state.teacher.index,
    };
}