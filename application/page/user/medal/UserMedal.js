//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, View, TouchableOpacity, Text, Image, FlatList, StyleSheet } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';

import asset from '../../../config/asset';
import theme from '../../../config/theme';

// create a component
class UserMedal extends Component {

    static navigationOptions = {
        title:'我的勋章',
        headerRight: <View/>
    };

    constructor(props) {
        super(props)

        this.items = [];

        this.state = {
            loaded: null,

            preview: false,
            preview_index: 0,
        }

        this._onRefresh = this._onRefresh.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    componentDidMount() {
        this._onRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {medal} = nextProps;

        if (medal !== this.props.medal) {
            this.items = medal;

            this.setState({
                loaded: true,
            })
        }
    }

    _onRefresh() {
        const {actions} = this.props;
        actions.user.medal();
    }

    renderItem(item) {
        const {navigation} = this.props;

        const medal = item.item;
        let cemdal = {
            lv: 1,
            img: medal.img,
        };

        let condition = medal.allNum;
        let current = 0;

        if (medal.allNum > 0) {
            medal.child.map((cmedal, index) => {
                if (cmedal.have) {
                    current++;
                }
            })
        }

        let progress = 0;

        if (current >= condition || condition == 0) {
            progress = 1;
        } else {
            progress = parseFloat(current/ condition);
        }

        return (
            <TouchableOpacity style={[styles.item, styles.p_20, styles.ai_ct, styles.mt_20]} onPress={() => navigation.navigate('MedalInfo', {medal: medal, index: current})}>
                <Image source={{uri: medal.img}} style={[styles.micon, medal.have && styles.micon_hav]}/>
                <Text style={[styles.mt_10]}>{medal.title}Lv.{medal.lv}</Text>
                <ProgressBar
                    style={styles.mt_10}
                    progress={progress}
                    borderWidth={0}
                    width={(theme.window.width - 40) / 3 - 40}
                    color={'#00A6F6'}
                    unfilledColor={'#E9E9E9'}
                />
            </TouchableOpacity>
        )
    }

    render() {
        const {loaded, preview, preview_index} = this.state;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#00A6F6"/>
            </View>
        )

        const medal = this.items.length > 0 ? this.items[preview_index] : {};

        return (
            <View style={styles.container}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.p_20}
                    numColumns={3}
                    data={this.items}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this.renderItem}
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
    item: {
        width: (theme.window.width - 40) / 3,
    },
    micon: {
        width: 64,
        height: 64,
        opacity: 0.3,
    },
    progress: {
        width: '100%',
    },
    micon_preview: {
        width: 128,
        height: 128,
    },
    micon_hav: {
        opacity: 1,
    }
});

export const LayoutComponent = UserMedal;

export function mapStateToProps(state) {
    return {
        medal: state.user.medal,
        user: state.user.user,
    };
}