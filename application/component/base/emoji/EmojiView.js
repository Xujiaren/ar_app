//import liraries
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

import theme from '../../../config/theme';
import emojis from './config';

class EmojiView extends Component {

    constructor(props) {
        super(props);

        this.emojiAt = new RegExp('\\[[^\\]]+\\]');
        this.content = props.content || '';

        this.state = {
            views: []
        }

        this._onParseEmoji = this._onParseEmoji.bind(this);
    }

    componentDidMount() {
        this._onParseEmoji(this.content);
    }

    _onParseEmoji(content) {
        const {fontStyle = {}} = this.props;
        const {views} = this.state;
        let matchStr = content.match(this.emojiAt);
        if (!matchStr) {
            views.push(<Text key={content} style={[fontStyle]}>{content}</Text>);
            this.setState({
                views: views,
            })
            return null;
        }

        let emojiLength = matchStr[0].length;
        views.push((<Image key={content} style={{ width: 24, height: 24 }} source={{uri: 'https://arsxy.oss-cn-beijing.aliyuncs.com/app/emo/' + emojis[matchStr[0]] + '.gif'}} />));

        this.setState({
            views: views,
        })
        
        this._onParseEmoji(content.substring(emojiLength));
    }

    render() {
        return (
            <View style={[styles.row, styles.ai_ct,{flexWrap:'wrap'}]}>{this.state.views}</View>
        )
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
});

//make this component available to the app
export default EmojiView;