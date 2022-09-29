//import liraries
import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';

import RefreshListView, {RefreshState} from '../../component/base/RefreshListView';
import TabView from '../../component/base/TabView';
import TeacherCell from '../../component/teacher/TeacherCell';
import ActivityCell from '../../component/discovery/ActivityCell';
import asset from '../../config/asset';
import theme from '../../config/theme';

// create a component
class UserFollow extends Component {

    static navigationOptions = {
        title:'我的关注',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        this.page = 1;
        this.pages = 1;
        this.total = 0;
        this.items = [];

        this.state = {
            type: 0,
            refreshState: RefreshState.Idle,
        }

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this.onUnFollow = this.onUnFollow.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    componentDidMount() {
        this._onHeaderRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {follow} = nextProps;

        if (follow !== this.props.follow) {
            this.pages = follow.pages;
            this.total = follow.total;
            this.items = this.items.concat(follow.items);
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    _onHeaderRefresh() {
        const {actions} = this.props;
        const {type} = this.state;

        this.page = 1;
        this.pages = 1;
        this.total = 0;
        this.items = [];

        actions.user.follow(type + 1, this.page);

        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
        const {actions} = this.props;
        const {type} = this.state;

        if (this.page < this.pages) {
            this.setState({refreshState: RefreshState.FooterRefreshing});
            this.page = this.page + 1;
            actions.user.follow(type + 1, this.page);

        } else {
            this.setState({refreshState: RefreshState.NoMoreData});
        }
    }

    onUnFollow(teacherId) {
        const {actions} = this.props;

        actions.user.unfollowTeacher({
            teacher_id: teacherId,
            resolved: (data) => {
                this._onHeaderRefresh();
            },
            rejected: (res) => {
                
            },
        });
    }

    _renderItem(item) {
        const {navigation} = this.props;
        const {type} = this.state;
        const data = item.item;

        if (type == 0) {
            return (
                <TeacherCell follow={true} style={[styles.mb_15]} teacher={data} onFollow={() => this.onUnFollow(data.teacherId)} onPress={() => navigation.navigate('Teacher', {teacher: data})}/>
            )
        }
        
        return (
            <ActivityCell style={[styles.mb_15]} activity={data} onPress={()=> navigation.navigate('Activity', {activity: data})}/>
        )
    }

    render() {
        const {type} = this.state;

        return (
            <View style={styles.container}>
                <TabView items={['讲师', '活动']} center={true} current={type} onSelected={(index) => {
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

export const LayoutComponent = UserFollow;

export function mapStateToProps(state) {
    return {
        follow: state.user.follow,
    };
}