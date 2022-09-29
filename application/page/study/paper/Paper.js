import React, { Component } from 'react';
import { ActivityIndicator, View, ScrollView, TouchableOpacity, Text, Modal, StyleSheet } from 'react-native';

import _ from 'lodash';

import HudView from '../../../component/base/HudView';
import iconMap from '../../../config/font';
import theme from '../../../config/theme';

const ttypes = {'t0': '单选题', 't1': '判断题', 't3': '多选题'};
const chars = ['A', 'B', 'C' , 'D', 'E', 'F', 'G', 'H'];

class Paper extends Component {

    static navigationOptions = ({navigation}) => {
        const paper = navigation.getParam('paper', {paperName: '考卷'});
		return {
            title: paper.paperName || '考卷',
            headerRight: () => <View/>
		}
    };
    
    constructor(props) {
        super(props);
        
        const {navigation} = props;
        this.paper = navigation.getParam('paper', {});
        this.levelId = navigation.getParam('level_id', 0);

        this.items = [];
        this.ts = 0;
        this.testId = 0;

        this.state = {
            loaded: false,
            done: false,
            topic_index: 0,
            answer: {},
            sheet: false,
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.onOption = this.onOption.bind(this);
        this.onAnswer = this.onAnswer.bind(this);
    }

    componentDidMount() {
        const {navigation} = this.props;
        this.focuSub = navigation.addListener('didFocus', (route) => {
            this.onRefresh();
        });
    }

    componentWillUnmount() {
        this.focuSub && this.focuSub.remove();
	}

    componentWillReceiveProps(nextProps) {
        const {info} = nextProps;
        
        if (info !== this.props.info) {
            this.items = info.topicList;
            this.testId = info.testId;
            this.ts = (new Date().getTime() / 1000);
            this.paper = info;

            this.setState({
                topic_index: 0,
                done: info.status == 1,
                loaded: true,
            })
        }
    }

    onRefresh() {
        const {actions} = this.props;
        actions.exam.info(this.paper.paperId, this.levelId);
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
        const {navigation, actions} = this.props;
        const {answer} = this.state;

        const duration = parseInt((new Date().getTime() / 1000) - this.ts);

        actions.exam.answer({
            levelId: this.levelId,
            test_id: this.testId,
            duration: duration,
            answer: JSON.stringify(answer),
            resolved: (data) => {
                if (this.levelId > 0) {
                    actions.course.levelStatus({
                        level_id: this.levelId,
                        resolved: (data) => {
                            navigation.navigate('PaperDone', {paper: this.paper, level_id: this.levelId})
                        },
                        rejected: (res) => {
                            
                        },
                    })
                } else {
                    navigation.navigate('PaperDone', {paper: this.paper, level_id: this.levelId})
                }
            },
            rejected: (msg) => {
                this.refs.hud.show('交卷失败，请联系工作人员。', 1);
            }
        })
    }

    render() {
        const {loaded, done, topic_index, answer, sheet} = this.state;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#00A6F6"/>
            </View>
        )

        const topic = this.items[topic_index] ? this.items[topic_index] : {};
        if (!topic.topicId) return null;

        let coptionIds = [];
        topic.answer.split(',').map((op, index) => {
            coptionIds.push(parseInt(op));
        })

        let uoptionIds = [];
        topic.userAnswer.answer.split(',').map((op, index) => {
            uoptionIds.push(parseInt(op));
        })

        const optionIds = answer[topic.topicId] || [];

        const pre_enable = topic_index > 0;
        const enable = this.items.length == Object.keys(answer).length;
        const next_enable = topic_index < (this.items.length - 1);

        return (
            <View style={styles.container}>
                {done ? 
                <ScrollView contentContainerStyle={styles.p_20}>
                    <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
                        <Text style={[styles.label_20]}>{ttypes['t' + topic.ttype]}</Text>
                        <Text style={[styles.label_dgray]}>{topic_index + 1}/{this.items.length}</Text>
                    </View>
                    <Text style={[styles.mt_15, styles.label_16]}>{topic.title}</Text>
                    <View style={[styles.mt_15]}>
                        {topic.optionList.map((option, index) => {
                            const on = _.indexOf(uoptionIds, option.optionId) >= 0;
                            const correct = _.indexOf(coptionIds, option.optionId) >= 0;

                            return (
                                <View key={['option_' + topic.topicId + '_' + index]} style={[styles.mt_10, styles.mb_10, styles.row, styles.ai_ct]}>
                                    <View style={[styles.dot, on && styles.dot_user_on, correct && styles.dot_correct_on, styles.ai_ct, styles.jc_ct]}>
                                        <Text style={[styles.label_dgray, on && styles.label_white, correct && styles.label_white]}>{chars[index]}</Text>
                                    </View>
                                    <Text style={[styles.ml_15, styles.title]}>{option.optionLabel}</Text>
                                </View>
                            )
                        })}
                    </View>
                </ScrollView>
                :
                <ScrollView contentContainerStyle={styles.p_20}>
                    <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
                        <Text style={[styles.label_20]}>{ttypes['t' + topic.ttype]}</Text>
                        <Text style={[styles.label_dgray]}>{topic_index + 1}/{this.items.length}</Text>
                    </View>
                    <Text style={[styles.mt_15, styles.label_16]}>{topic.title}</Text>
                    <View style={[styles.mt_15]}>
                        {topic.optionList.map((option, index) => {
                            const on = _.indexOf(optionIds, option.optionId) >= 0;

                            return (
                                <TouchableOpacity key={['option_' + topic.topicId + '_' + index]} style={[styles.mt_10, styles.mb_10, styles.row, styles.ai_ct]} onPress={() => this.onOption(topic.ttype, topic.topicId, option.optionId)}>
                                    <View style={[styles.dot, on && styles.dot_on, styles.ai_ct, styles.jc_ct]}>
                                        <Text style={[styles.label_dgray, on && styles.label_blue]}>{chars[index]}</Text>
                                    </View>
                                    <Text style={[styles.ml_15, styles.title]}>{option.optionLabel}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </ScrollView>}
                <View style={[styles.toolbar, styles.bg_white, styles.row]}>
                    <TouchableOpacity style={[styles.f1, styles.ai_ct, styles.jc_ct]} onPress={() => this.setState({
                        sheet: true,
                    })}>
                        <Text style={[styles.label_16]}><Text style={[styles.icon, styles.label_16]}>{iconMap('sheet')}</Text> 答题卡</Text>
                    </TouchableOpacity>
                    <View style={[styles.f1, styles.row, styles.ai_ct, styles.jc_ct]}>
                        <TouchableOpacity style={[styles.p_10]} disabled={!pre_enable} onPress={() => this.setState({
                            topic_index: topic_index - 1,
                        })}>
                            <Text style={[styles.label_lgray, pre_enable && styles.label_default]}>上一题</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.p_10]} disabled={!next_enable} onPress={() => this.setState({
                            topic_index: topic_index + 1,
                        })}>
                            <Text style={[styles.label_lgray, next_enable && styles.label_default]}>下一题</Text>
                        </TouchableOpacity>
                    </View>
                    {done ?
                    <View style={[styles.f1, styles.ai_ct, styles.jc_ct]}>
                        <Text><Text style={[styles.label_green]}>正确{this.paper.correctNum}</Text> <Text style={[styles.label_orange]}>错误{this.paper.topicNum - this.paper.correctNum}</Text></Text>
                    </View>
                    :
                    <TouchableOpacity style={[styles.f1, styles.ai_ct, styles.jc_ct]} disabled={!enable} onPress={this.onAnswer}>
                        <Text style={[styles.label_16, styles.label_lgray, enable && styles.label_blue]}>交卷</Text>
                    </TouchableOpacity>}
                </View>
                <HudView ref={'hud'} />

                <Modal visible={sheet} transparent={true} onRequestClose={() => {
                    this.setState({sheet:false})
                }}>
                    <TouchableOpacity style={[styles.modal]} onPress={()=>this.setState({sheet:false})}/>
                    <View style={[styles.sheet, styles.bg_white, styles.p_20]}>
                        <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.p_10, styles.b_line]}>
                            {done ?
                            <Text><Text style={[styles.label_green]}>正确{this.paper.correctNum}</Text> <Text style={[styles.label_orange]}>错误{this.paper.topicNum - this.paper.correctNum}</Text></Text>
                            :
                            <Text>已选{Object.keys(answer).length}</Text>}
                            <Text style={[styles.label_dgray]}>{topic_index + 1}/{this.items.length}</Text>
                        </View>
                        <View style={[styles.row, styles.wrap, styles.p_10]}>
                            {this.items.map((topic, index) => {
                                let on = false;
                                if (answer[topic.topicId]) {
                                    on = true;
                                }
                                
                                const correct = topic.userAnswer.isCorrect == 1;

                                if (done) {
                                    return (
                                        <TouchableOpacity key={'item_' + index} style={[styles.sheet_item, styles.p_10, styles.ai_ct, styles.jc_ct]} onPress={() => this.setState({
                                            topic_index: index
                                        })}>
                                            <View style={[styles.dot, styles.dot_user_on, correct && styles.dot_correct_on, styles.ai_ct, styles.jc_ct]}>
                                                <Text style={[styles.label_default, styles.label_white]}>{index + 1}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }

                                return (
                                    <TouchableOpacity key={'item_' + index} style={[styles.sheet_item, styles.p_10, styles.ai_ct, styles.jc_ct]} onPress={() => this.setState({
                                        topic_index: index
                                    })}>
                                        <View style={[styles.dot, on && styles.dot_on, styles.ai_ct, styles.jc_ct]}>
                                            <Text style={[styles.label_default, on && styles.label_blue]}>{index + 1}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>
                </Modal>
            </View>
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
    toolbar: {
        height: 50,
        borderTopWidth: 1,
        borderTopColor: '#FAFAFA'
    },
    dot: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#EBEBEB',
        borderWidth: 1,
        borderColor: '#EBEBEB',
    },
    dot_on: {
        backgroundColor: 'white',
        borderColor: '#00A6F6'
    },
    dot_user_on: {
        backgroundColor: '#F4623F',
        borderColor: '#F4623F'
    },
    dot_correct_on: {
        backgroundColor: '#99D321',
        borderColor: '#99D321'
    },
    title: {
        width: theme.window.width - 85,
    },
    sheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    sheet_item: {
        width: (theme.window.width - 60) / 5,
    }
});

export const LayoutComponent = Paper;

export function mapStateToProps(state) {
    return {
        info: state.exam.info,
    };
}