//import liraries
import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

import theme from '../../config/theme';

// create a component
class SpecialCell extends Component {
    render() {
        const {special={}, style = {}} = this.props;

        return (
            <TouchableOpacity style={[style]} onPress={() => this.props.onPress && this.props.onPress()}>
                <Image source={{uri: special.articleImg}} style={[styles.thumb, styles.circle_5]}/>
                <View style={[styles.pt_10, styles.pb_10, styles.b_line]}>
                    <Text style={[styles.label_16]} numberOfLines={1}>{special.title}</Text>
                    <Text style={[styles.label_12, styles.label_gray, styles.mt_5]} numberOfLines={1}>{special.summary}</Text>
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
export default SpecialCell;
