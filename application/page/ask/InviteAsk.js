//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, View, Image, TouchableOpacity, Text, FlatList, StyleSheet } from 'react-native';

import asset from '../../config/asset';
import theme from '../../config/theme';

// create a component
class InviteAsk extends Component {

    static navigationOptions = {
        title:'邀请回答',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        const {navigation} = props;
        this.ask = navigation.getParam('ask', {});

        this.users = [];

        this.state = {
            loaded: false,
            index: 0,
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    componentDidMount() {
        this.onRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {recomm} = nextProps;
        if (recomm !== this.props.recomm) {
            this.users = recomm;

            this.setState({
                loaded: true,
            })
        }
    }

    onRefresh() {
        const {actions} = this.props;
        actions.ask.recomm(this.ask.askId);
    }

    onInvite(index) {
        const {actions} = this.props;

        let user = this.users[index];

        actions.ask.invite({
            target_uid: user.userId,
            ask_id: this.ask.askId,
            resolved: (data) => {
                
            },
            rejected: (msg) => {
                
            },
        });

        user.isInvite = true;
        this.users[index] = user;

        this.setState({
            index: index,
        });
    }

    renderItem(item) {
        const user = item.item;

        return (
            <View style={[styles.pb_15, styles.pt_15, styles.b_line, styles.row, styles.ai_ct, styles.jc_sb]}>
                <View style={[styles.row, styles.ai_ct]}>
                    <Image source={{uri: user.avatar}} style={[styles.avatar, styles.bg_l1gray]}/>
                    <Text style={[styles.ml_5]}>{user.nickname}</Text>
                </View>

                <TouchableOpacity style={[styles.p_5, styles.pl_15, styles.pr_15, styles.circle_5, styles.bg_lblue]} disabled={user.isInvite} onPress={()=> this.onInvite(item.index)}>
                    <Text style={[styles.label_blue]}>邀请</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderHeader() {
        return (
            <View style={[styles.mb_15, styles.ai_ct]}>
                <Text style={[styles.label_gray]}>你可以邀请下面用户快速获得回答</Text>
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
                    contentContainerStyle={styles.p_20}
                    showsVerticalScrollIndicator={false}
                    data={this.users}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this.renderItem}
                    ListHeaderComponent={this.renderHeader}
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
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
});

export const LayoutComponent = InviteAsk;

export function mapStateToProps(state) {
    return {
        recomm: state.ask.recomm,
    };
}

