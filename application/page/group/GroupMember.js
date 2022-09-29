//import liraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

import RefreshListView, {RefreshState} from '../../component/base/RefreshListView';
import HudView from '../../component/base/HudView';
import TabView from '../../component/base/TabView';
import theme from '../../config/theme';

// create a component
class GroupMember extends Component {

    static navigationOptions = {
        title:'参与用户',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        const {navigation} = props;
        this.group = navigation.getParam('group', {});

        this.page = 0;
        this.pages = 1;
        this.total = 0;
        this.items = [];

        this.state = {
            type: 0,
            index: 0,
            refreshState: RefreshState.Idle,
        }

        this.onAction = this.onAction.bind(this);

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    componentDidMount() {
        this._onHeaderRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {member} = nextProps;

        if (member !== this.props.member) {
            this.items = this.items.concat(member.items);
            this.total = member.total;
            this.pages = member.pages;
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    _onHeaderRefresh() {
        const {actions} = this.props;
        const {type} = this.state;

        this.page = 0;
        this.pages = 1;
        this.total = 0;
        this.items = [];

        actions.group.member(this.group.activityId, type == 0 ? 'member' : 'apply', 0);
        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
        const {actions} = this.props;
        const {type} = this.state;

        if (this.page < this.pages) {
            this.setState({refreshState: RefreshState.FooterRefreshing});
            this.page = this.page + 1;
            actions.group.member(this.group.activityId, type == 0 ? 'member' : 'apply', this.page);
        } else {
            this.setState({refreshState: RefreshState.NoMoreData});
        }
    }

    onAction(index, joinId, action) {
        const {actions} = this.props;

        actions.group.action({
            activity_id: this.group.activityId,
            joinId: joinId,
            action: action,
            resolved: (data) => {
                this.refs.hud.show('操作成功', 1, () => {

                    if (action == 'delete') {
                        this._onHeaderRefresh();
                    } else {
                        let member = this.items[index];
                        member.isPass = 1;
                        this.items[index] = member;

                        this.setState({
                            index: index,
                        })
                    }
                    
                });
            },
            rejected: (msg) => {
                this.refs.hud.show('操作失败', 1);
            },
        })
    }

    _renderItem(item) {
        const {user} = this.props;
        const {type} = this.state;
        const member = item.item;
        const owner = member.userId == user.userId;

        return (
            <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.pb_15, styles.pt_15, styles.b_line]}>
                <View style={[styles.row, styles.ai_ct]}>
                    <Image source={{uri: member.avatar}} style={[styles.avatar, styles.bg_l1gray]}/>
                    <Text style={[styles.ml_10]}>{member.username}</Text>
                    {type == 1 ?
                    <Text style={[styles.ml_10, styles.label_dgray]}>{member.workIntro}</Text>
                    : null}
                </View>
                 {type == 0 ? (owner ? null :
                <TouchableOpacity style={[styles.p_5, styles.pl_15, styles.pr_15, styles.bg_lyellow, styles.circle_5]} onPress={() => this.onAction(item.index, member.joinId, 'delete')}>
                    <Text style={[styles.label_yellow]}>踢出</Text>
                </TouchableOpacity>)
                : 
                <TouchableOpacity style={[styles.p_5, styles.pl_15, styles.pr_15, styles.bg_lblue, member.isPass == 1 && styles.bg_l1gray, styles.circle_5]} onPress={() => this.onAction(item.index, member.joinId, 'pass')}>
                    <Text style={[styles.label_blue, member.isPass == 1 && styles.label_dgray]}>{member.isPass == 1 ? '已同意' : '同意'}</Text>
                </TouchableOpacity>}
            </View>
        )
    }

    render() {
        const {user} = this.props;
        const {type} = this.state;

        let tabs = ['参与用户'];

        if (user.userId == this.group.userId) {
            tabs = ['参与用户', '申请用户'];
        }

        return (
            <View style={styles.container}>
                <TabView items={tabs} center={true} current={type} onSelected={(index) => {
                    this.setState({
                        type: index
                    }, () => {
                        this._onHeaderRefresh();
                    })
                }}/>
                <RefreshListView
                    contentContainerStyle={styles.p_20}
                    showsVerticalScrollIndicator={false}
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
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
});

export const LayoutComponent = GroupMember;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        member: state.group.member,
    };
}