//import liraries
import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Text, FlatList, StyleSheet } from 'react-native';

import asset from '../../config/asset';
import theme from '../../config/theme';
import * as tool from '../../util/tool';

// create a component
class Rank extends Component {

    static navigationOptions = {
        title:'排行榜',
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: '#00A6F6',
            borderBottomWidth: 0,
            elevation:0,
            shadowOpacity: 0,
        },
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        this.items = [];

        this.state = {
            type: 1,
        }

        this.onType = this.onType.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
    }

    componentDidMount() {
        this.onRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {rank} = nextProps;

        if (rank !== this.props.rank) {
            this.items = rank;
        }
    }

    onRefresh() {
        const {actions} = this.props;
        const {type} = this.state;

        actions.user.user();
        actions.user.stat();

        let dayType = 3;
        if (type == 1) {
            dayType = 2;
        } else if (type == 2) {
            dayType = 0;
        }

        actions.study.rank(dayType);
    }

    onType(type) {
        this.setState({
            type: type,
        }, () => {
            this.onRefresh();
        })
    }

    renderItem(item) {
        const user = item.item;
        return (
            <View style={[styles.pt_15, styles.pb_15, styles.bg_white, styles.row, styles.ai_ct, styles.b_line]}>
                <View style={[styles.f2, styles.ai_ct]}>
                    <Text style={[styles.label_dgray]}>{user.index}</Text>
                </View>
                <View style={[styles.f6, styles.row, styles.ai_ct]}>
                    <Image source={{uri: user.avatar}} style={[styles.avatar, styles.bg_l1gray]}/>
                    <Text style={[styles.label_dgray, styles.ml_10]}>{user.nickname}</Text>
                </View>
                <View style={[styles.f3, styles.ai_end]}>
                    <Text style={[styles.label_16]}>{tool.ts2hour(user.duration)}</Text>
                </View>
            </View>
        )
    }

    render() {
        const {type} = this.state;
        const {user, stat} = this.props;

        let rank = {};

        this.items.map((item, index) => {
            if (item.userId == user.userId) {
                rank = item;
            }
        })
        
        let rank_header = this.items.slice(0, 3);
        const rnum = 3 - rank_header.length;
        
        for (var i = 0; i < rnum; i++) {
            rank_header.push({
                nickname: '虚位以待',
                avatar: asset.user.avatar.uri,
                duration: 0,
            })
        }

        let rank_body = this.items.slice(3, 100);

        return (
            <View style={styles.container}>
                <View style={[styles.row, styles.jc_ad, styles.ai_ct, styles.mt_25, styles.ml_20, styles.mr_20]}>
                    <TouchableOpacity style={[styles.ai_ct]} onPress={() => this.onType(0)}>
                        <Text style={[styles.label_white]}>日排行榜</Text>
                        <View style={[styles.dot, styles.mt_5, type == 0 && styles.bg_white]}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.ai_ct]} onPress={() => this.onType(1)}>
                        <Text style={[styles.label_white]}>月排行榜</Text>
                        <View style={[styles.dot, styles.mt_5, type == 1 && styles.bg_white]}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.ai_ct]} onPress={() => this.onType(2)}>
                        <Text style={[styles.label_white]}>总排行榜</Text>
                        <View style={[styles.dot, styles.mt_5, type == 2 && styles.bg_white]}/>
                    </TouchableOpacity>
                </View>
                <View style={[styles.p_20, styles.circle_5, styles.bg_white, styles.mt_10, styles.mr_20, styles.ml_20, styles.shadow]}>
                    <View style={[styles.row, styles.ai_end]}>
                        <View style={[styles.f1, styles.ai_ct, styles.p_10]}>
                            <Image source={{uri: rank_header[1].avatar}} style={[styles.avatar_m]}/>
                            <Image source={asset.study.rank.i2} style={[styles.rank_icon]}/>
                        </View>
                        <View style={[styles.f1, styles.ai_ct, styles.p_10]}>
                            <Image source={{uri: rank_header[0].avatar}}  style={[styles.avatar_l]}/>
                            <Image source={asset.study.rank.i1} style={[styles.rank_icon, styles.rank_icon_l]}/>
                        </View>
                        <View style={[styles.f1, styles.ai_ct, styles.p_10]}>
                            <Image source={{uri: rank_header[2].avatar}}  style={[styles.avatar_m]}/>
                            <Image source={asset.study.rank.i3} style={[styles.rank_icon]}/>
                        </View>
                    </View>
                    <View style={[styles.row, styles.mt_15]}>
                        <View style={[styles.f1, styles.ai_ct]}>
                            <Text style={[styles.label_dgray]}>{rank_header[1].nickname}</Text>
                            <Text style={[styles.label_16, styles.mt_5]}>{tool.ts2hour(rank_header[1].duration)}</Text>
                        </View>
                        <View style={[styles.f1, styles.ai_ct]}>
                            <Text style={[styles.label_dgray]}>{rank_header[0].nickname}</Text>
                            <Text style={[styles.label_16, styles.mt_5]}>{tool.ts2hour(rank_header[0].duration)}</Text>
                        </View>
                        <View style={[styles.f1, styles.ai_ct]}>
                            <Text style={[styles.label_dgray]}>{rank_header[2].nickname}</Text>
                            <Text style={[styles.label_16, styles.mt_5]}>{tool.ts2hour(rank_header[2].duration)}</Text>
                        </View>
                    </View>
                </View>
                <View>

                </View>
               
                <View style={[styles.m_20, styles.bg_white, styles.shadow, styles.f1, styles.circle_5]}>
                    {rank.index ?
                    <View style={[styles.p_15, styles.pr_20, styles.pl_20, styles.bg_lblue, styles.row, styles.ai_ct]}>
                        <View style={[styles.ai_ct, styles.f2]}>
                            <Text style={[styles.label_26, styles.label_blue]}>{rank.index}</Text>
                            <Text style={[styles.label_12, styles.label_blue]}>我的排名</Text>
                        </View>
                        <View style={[styles.f6, styles.row, styles.ai_ct]}>
                            <Image source={{uri: rank.avatar}} style={[styles.avatar, styles.bg_l1gray]}/>
                            <Text style={[styles.label_dgray, styles.ml_10]}>{rank.nickname}</Text>
                        </View>
                        <View style={[styles.f3, styles.ai_end]}>
                            <Text style={[styles.label_16]}>{parseFloat(rank.duration / 3600).toFixed(1)}小时</Text>
                        </View>
                    </View>
                    : null}
                    <FlatList
                        contentContainerStyle={[styles.pl_20, styles.pr_20]}
                        showsVerticalScrollIndicator={false}
                        data={rank_body}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => {return 'item_' + index}}
                        ListEmptyComponent={() => {
                            return (
                                <View style={[styles.ai_ct, styles.jc_ct, styles.mb_15]}>
                                    <Image source={asset.base.empty} style={[styles.empty, styles.mt_25]}/>
                                </View>
                            )
                        }}
                    />
                </View>
                <View style={[styles.header_bg, styles.bg_blue]}/>
                
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA'
    },
    header_bg: {
        width: theme.window.width,
        height: theme.window.width * 0.3,
        position: 'absolute',
        zIndex: -100,
        top: 0,
        left: 0,
        right: 0,
    },
    dot: {
        width: 10,
        height: 4,
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    avatar_m: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: '#00A6F6'
    },
    avatar_l: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#00A6F6'
    },
    rank_icon: {
        position: 'absolute',
        bottom: 0,
        width: 24,
        height: 24,
    },
    rank_icon_l: {
        width: 32,
        height: 32,
    }
});

export const LayoutComponent = Rank;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        stat: state.user.stat,
        rank: state.study.rank,
    };
}