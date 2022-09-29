//import liraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import iconMap from '../../config/font';
import theme from '../../config/theme';

// create a component
class NavCell extends Component {
    render() {
        const {label, style, theme = 'stand'} = this.props;
        return (
            <View style={[styles.container, styles.row, styles.jc_sb, styles.ai_ct, style]}>
                <Text style={[styles.label_16, styles.label_bold]}>{label}</Text>
                <TouchableOpacity onPress={() => {
                    this.props.onPress && this.props.onPress();
                }}>
                    <Text style={[styles.label_gray]}>{theme == 'stand' ? '查看全部' : ''}<Text style={[styles.icon, styles.label_gray]}>{iconMap('right')}</Text></Text>
                </TouchableOpacity>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    container: {
        paddingBottom: 15,
        paddingTop: 15,
    }
});

//make this component available to the app
export default NavCell;
