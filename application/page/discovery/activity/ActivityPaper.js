//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, View, Text, Image, TextInput, SectionList, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import _ from 'lodash';

import HudView from '../../../component/base/HudView';
import iconMap from '../../../config/font';
import asset from '../../../config/asset';
import theme from '../../../config/theme';

// create a component
class ActivityPaper extends Component {

    static navigationOptions = {
        title:'问卷答题',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        const {navigation} = props;
        this.activity = navigation.getParam('activity', {});

        this.items = [];
        
        this.state = {
            loaded: false,
            answer: {},

            tip: false,
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.onOption = this.onOption.bind(this);
        this.onAnswer = this.onAnswer.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    componentDidMount() {
        this.onRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {paper} = nextProps;

        if (paper !== this.props.paper) {

            this.items = paper;
            this.setState({
                loaded: true,
            })
        }
    }

    onRefresh() {
        const {actions} = this.props;
        actions.activity.paper(this.activity.activityId);
    }

    onOption(ttype, topicId, optionId) {

        let answer = this.state.answer;
        
        if (answer[topicId] && ttype == 3) {
            let optionIds = answer[topicId];

            if (_.indexOf(optionIds, optionId) >= 0) {
                _.pull(optionIds, optionId);
            } else {
                optionIds.push(optionId);
            }
            
            if (optionIds.length > 0) {
                answer[topicId] = optionIds;
            } else {
                delete answer[topicId];
            }
        } else {
            answer[topicId] = [optionId];
        }

        this.setState({
            answer: answer,
        })
    }

    onAnswer() {
        const {actions} = this.props;
        const {answer} = this.state;

        actions.activity.answer({
            activity_id: this.activity.activityId,
            answer: JSON.stringify(answer),
            resolved: (data) => {
                this.setState({
                    tip: true,
                });
            },
            rejected: (msg) => {
                this.refs.hud.show('提交失败', 1);
            }
        })
    }

    renderSectionHeader(section) {
        const topic = section.section.title;
        return (
            <View style={[styles.p_20, styles.bg_lgray, styles.b_line, styles.t_line]}>
                <Text>{topic.title} {topic.ttype == 3 ? <Text style={[styles.label_gray]}>(多选题)</Text> : null}</Text>
            </View>
        )
    }

    renderItem(item) {
        const {answer} = this.state;
        const option = item.item;
        const topic = item.section.title;

        const optionIds = answer[topic.topicId] || [];
        const on = _.indexOf(optionIds, option.optionId) >= 0;

        if (topic.ttype == 4) {
            let val = '';
            if (optionIds.length > 0) {
                val = optionIds[0];
            }

            return (
                <View style={[styles.p_20]}>
                    <TextInput
                        style={[styles.input, styles.circle_5, styles.p_10, styles.bg_lgray]}
                        placeholder={option.optionLabel}
                        multiline={true}
                        value={val}
                        onChangeText={(text) => {this.onOption(topic.ttype, topic.topicId, text)}}
                    />
                </View>
            )
        }

        if (topic.ttype == 3) {
            return (
                <TouchableOpacity style={[styles.p_20, styles.pt_15, styles.pb_15]} onPress={() => this.onOption(topic.ttype, topic.topicId, option.optionId)}>
                    <Text><Text style={[styles.icon, styles.label_gray, on && styles.label_blue]}>{iconMap(on ? 'checked' : 'uncheck')}</Text> {option.optionLabel}</Text>
                </TouchableOpacity>
            )
        }

        return (
            <TouchableOpacity style={[styles.p_20, styles.pt_15, styles.pb_15]} onPress={() => this.onOption(topic.ttype, topic.topicId, option.optionId)}>
                <Text><Text style={[styles.icon, styles.label_16, styles.label_gray, on && styles.label_blue]}>{iconMap(on ? 'selected' : 'unselect')}</Text> {option.optionLabel}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const {navigation} = this.props;
        const {loaded, answer, tip} = this.state;
        const enable = this.items.length == Object.keys(answer).length;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#00A6F6"/>
            </View>
        )

        let datas = [];
        this.items.map((item, index) => {
            datas.push({
                title: item,
                data: item.optionList,
            })
        })

        return (
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                <View style={styles.container}>
                    <SectionList
                        showsVerticalScrollIndicator={false}
                        stickySectionHeadersEnabled={false}
                        sections={datas}
                        extraData={this.state}
                        keyExtractor={(item, index) => item + index}
                        renderItem={this.renderItem}
                        renderSectionHeader={this.renderSectionHeader}
                    />
                    <TouchableOpacity style={[styles.bg_blue, styles.circle_5, styles.p_15, styles.m_20, styles.ai_ct, !enable && styles.disabledContainer]} disabled={!enable} onPress={this.onAnswer}>
                        <Text style={[styles.label_white]}>提交</Text>
                    </TouchableOpacity>

                    <Modal visible={tip} transparent={true} onRequestClose={() => {
                        this.setState({
                            tip:false
                        }, () => navigation.goBack())
                    }}>
                        <TouchableOpacity style={[styles.modal]} onPress={() => this.setState({
                            tip:false
                        }, () => navigation.goBack())}/>

                        <View style={[styles.tip, styles.bg_white, styles.circle_5]}>
                            <View style={[styles.p_20, styles.b_line, styles.ai_ct]}>
                                <Image source={asset.discovery.activity.answer} style={[styles.tip_icon]}/>
                                <Text style={[styles.label_16, styles.mt_20]}>答题结束</Text>
                                <Text style={[styles.label_gray, styles.mt_10]}>问卷调查结束，感谢您!</Text>
                            </View>
                            <TouchableOpacity style={[styles.f1, styles.p_15, styles.ai_ct, styles.jc_ct]} onPress={() => this.setState({
                                    tip:false
                                }, () => navigation.goBack())}>
                                <Text>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <HudView ref={'hud'} />
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    input: {
        height: 100,
    },
    tip: {
        position: 'absolute',
        top: theme.window.width * 0.5,
        left: 50,
        right: 50,
    },
    tip_icon: {
        width: 120,
        height: 120,
    }
});

export const LayoutComponent = ActivityPaper;

export function mapStateToProps(state) {
    return {
        paper: state.activity.paper,
    };
}
