//import liraries
import React, { Component } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import LinearGradient from 'react-native-linear-gradient';

import theme from '../../../config/theme';

// create a component
class UserRight extends Component {

    static navigationOptions = {
        title:'权益详情',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        const {navigation} = props;

        this.items = navigation.getParam('equity', []);
    }
    
    _renderItem(item, index) {
        const eitem = item.item;

        return (
            <View style={[styles.f1]}>
                <LinearGradient style={[styles.header]} colors={["#FFD100", "#FFF199"]} start={{x: 0, y: 0}}/>
                <View style={[styles.ai_ct, styles.title]}>
                    <View style={[styles.icon, styles.bg_lgray, styles.ai_ct, styles.jc_ct]}>
                        <Image source={{uri: eitem.equityImg}} style={[styles.eicon]}/>
                    </View>
                    <Text style={[styles.label_16, styles.mt_5]}>{eitem.equityName}</Text>
                </View>
                <View style={[styles.p_15]}>
                    <View style={[styles.row, styles.ai_ct]}>
                        <View style={[styles.vdot]}/>
                        <Text style={[styles.ml_10, styles.label_16]}>服务用户</Text>
                    </View>
                    <View style={[styles.p_15]}>
                        <Text style={[styles.label_dgray]}>{eitem.leveStr == '' ? '全部用户' : eitem.leveStr}</Text>
                    </View>
                    <View style={[styles.row, styles.ai_ct]}>
                        <View style={[styles.vdot]}/>
                        <Text style={[styles.ml_10, styles.label_16]}>权益说明</Text>
                    </View>
                    <View style={[styles.p_15]}>
                        <Text style={[styles.label_dgray]}>{eitem.content}</Text>
                    </View>
                </View>
                <View style={[styles.bottom, styles.ai_ct]}>
                    <Image source={{uri: eitem.bottomImg}} style={[styles.thumb]}/>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <Carousel
                    ref={(c) => { this._carousel = c; }}
                    data={this.items}
                    renderItem={this._renderItem}
                    sliderWidth={theme.window.width}
                    itemWidth={theme.window.width * 0.8}
                    slideStyle={[styles.bg_white, styles.shadow, styles.circle_5]}
                />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        paddingTop: 70,
        paddingBottom: 100,
    },
    header: {
        height: 64,
    },
    title: {
        marginTop: -25,
    },
    icon: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    eicon: {
        width: 28,
        height: 28,
    },
    vdot: {
        width: 4,
        height: 16,
        backgroundColor: '#FACC54'
    },
    bottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    thumb: {
        width: 214,
        height: 190,
    }
});

export const LayoutComponent = UserRight;

export function mapStateToProps(state) {
    return {
        
    };
}