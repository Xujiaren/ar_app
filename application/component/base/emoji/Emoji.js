import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import theme from '../../../config/theme';
import emojis from './config';

class Emoji extends Component {

    constructor(props) {
        super(props);

        this.state = {
            show: false,
            width: 20,
        }
    }

    show() {
        this.setState({
            show: true
        })
    }

    hide() {
        this.setState({
            show: false
        }) 
    }

    render() {
        const {col = 6, style={}, onSelect} = this.props;
        const {width, show} = this.state;

        if (!show) return null;

        return (
            <View style={[style, styles.bg_white, styles.row, styles.wrap]} onLayout={(evt) => {
                this.setState({
                    width: evt.nativeEvent.layout.width / col
                })
            }}>
                {
                    Object.keys(emojis).map((key, index) => {
                        return (
                            <TouchableOpacity style={[{width: width, height: width * 0.8}, styles.jc_ct, styles.ai_ct]} key={'emoji_' + index} onPress={() => {
                                onSelect && onSelect(key);
                            }}>
                                <Image source={{uri: 'https://arsxy.oss-cn-beijing.aliyuncs.com/app/emo/' + emojis[key] + ".gif"}} style={styles.eicon}/>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ...theme,
    eicon: {
        width: 24,
        height: 24,
    }
});

//make this component available to the app
export default Emoji;