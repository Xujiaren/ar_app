//import liraries
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import theme from '../../config/theme';
import * as tool from '../../util/tool';

// create a component
class SquadCell extends Component {

    render() {
        const {squad = {}, style = {}} = this.props;

        return (
            <TouchableOpacity style={[style]} onPress={() => this.props.onPress && this.props.onPress()}>
                <Image source={{uri: squad.squadImg}} style={[styles.thumb, styles.bg_l1gray, styles.circle_5]}/>
                <View style={[styles.pt_10, styles.pb_10, styles.b_line]}>
                    <Text style={[styles.label_16]}>{squad.squadName}</Text>
                    <Text style={[styles.label_12, styles.label_gray, styles.mt_5]}>活动时间：{tool.ts2dt(squad.beginTime)}-{tool.ts2dt(squad.endTime)}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    thumb: {
        height: 130
    },
});

//make this component available to the app
export default SquadCell;
