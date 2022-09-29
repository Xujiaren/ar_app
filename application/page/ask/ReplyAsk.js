//import liraries
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';

import HudView from '../../component/base/HudView';
import theme from '../../config/theme';

// create a component
class ReplyAsk extends Component {

    static navigationOptions = {
        title:'写回答',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        const {navigation} = props;
        this.ask = navigation.getParam('ask', {});

        this.state = {
            content: '',
        }

        this.onAnswer = this.onAnswer.bind(this);
    }

    onAnswer() {
        const {navigation, actions} = this.props;
        const {content} = this.state;

        //content.length >= 5

        if (content.length < 1) {
            this.refs.hud.show('提交失败，请写下您的回答。', 1);
            return;
        }

        actions.ask.answer({
            ask_id: this.ask.askId,
            fuser_id: 0,
            content: content,
            pics: '',
            resolved: (data) => {
                this.refs.hud.show('提交成功!将由工作人员筛选审核后公开显示。', 1, () => {
                    this.setState({
                        content: '',
                    }, () => navigation.goBack());
                });
            },
            rejected: (msg) => {
                this.refs.hud.show('提交失败，请检查您的输入。', 1);
            },
        })
    }

    render() {
        const {content} = this.state;
        const enable = true;

        return (
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                <View style={styles.container}>
                    <View style={[styles.bg_white, styles.mt_10, styles.p_20]}>
                        <Text style={[styles.label_16]}>{this.ask.title}</Text>
                        <TextInput
                            style={[styles.input]}
                            placeholder={'写下您的回答(5个字以上)'}
                            multiline={true}
                            value={content}
                            onChangeText={(text) => {this.setState({content:text});}}
                        />
                    </View>

                    <TouchableOpacity style={[styles.bg_blue, styles.circle_5, styles.p_15, styles.ml_20, styles.mr_20, styles.mt_40, styles.ai_ct, !enable && styles.disabledContainer]} disabled={!enable} onPress={this.onAnswer}>
                        <Text style={[styles.label_white]}>提交</Text>
                    </TouchableOpacity>

                    <HudView ref={'hud'} />
                </View>
            </TouchableWithoutFeedback>
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
    input: {
        height: 180,
    }
});

export const LayoutComponent = ReplyAsk;

export function mapStateToProps(state) {
    return {
        
    };
}
