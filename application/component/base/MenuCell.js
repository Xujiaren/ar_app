//import liraries
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import iconMap from '../../config/font';
import theme from '../../config/theme';

// create a component
class MenuCell extends Component {
    render() {
        const {label, val = '', img = '', tip = false, style} = this.props;
        return (
            <TouchableOpacity style={[styles.row, styles.jc_sb, styles.ai_ct, styles.bg_white, styles.menu, style]} onPress={() => {
                this.props.onPress && this.props.onPress();
            }}>
                <Text>{label}</Text>
                <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
                    {img != '' ?
                    <Image source={{uri: img}} style={[styles.thumb, styles.bg_l1gray]}/>
                    :null }
                    <Text style={[styles.label_gray, tip && styles.label_red]}>{val}</Text>
                    <Text style={[styles.icon, styles.label_gray]}>{iconMap('right')}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    menu: {
        padding: 15,
        paddingLeft: 30,
        borderBottomColor:'#fafafa',
        borderStyle:'solid',
        borderBottomWidth:1
    },
    thumb: {
        width: 40,
        height: 40,
        borderRadius: 20,
    }
});

//make this component available to the app
export default MenuCell;
