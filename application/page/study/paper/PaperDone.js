//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';

import asset from '../../../config/asset';
import theme from '../../../config/theme';

// create a component
class PaperDone extends Component {

    static navigationOptions = {
        title:'考试结果',
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: '#292C3F',
            borderBottomWidth: 0,
            elevation:0,
            shadowOpacity: 0,
        },
        headerRight: <View/>
    };

    constructor(props) {
        super(props);
        
        const {navigation} = props;
        this.paper = navigation.getParam('paper', {});
        this.levelId = navigation.getParam('level_id', 0);

        this.state = {
            loaded: false,
        }

        this.onRefresh = this.onRefresh.bind(this);
    }

    componentDidMount() {
        this.onRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {info} = nextProps;

        if (info !== this.props.info) {
            this.paper = info;
            this.setState({
                loaded: true,
            })
        }
    }

    onRefresh() {
        const {actions} = this.props;
        actions.exam.info(this.paper.paperId, this.levelId);
    }

    render() {
        const {navigation} = this.props;
        const {loaded} = this.state;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#00A6F6"/>
            </View>
        )

        return (
            <View style={styles.container}>
                <Image source={asset.study.paper.light} style={[styles.light, styles.as_ct]}/>
                <View style={[styles.bg_white, styles.circle_20, styles.p_40, styles.ml_20, styles.mr_20]}>
                    <View style={[styles.ai_ct]}>
                        {this.paper.isPass == 1 ?
                        <View>
                            <Text style={[styles.label_36]}>恭喜您</Text>
                            <Text style={[styles.label_20, styles.mt_20]}>顺利完成考试</Text>
                        </View>
                        :
                        <View>
                            <Text style={[styles.label_36]}>很遗憾</Text>
                            <Text style={[styles.label_20, styles.mt_20]}>没能通过考试</Text>
                        </View>
                        }

                        <View style={[styles.row, styles.mt_40]}>
                            <View style={[styles.ai_ct, styles.p_20]}>
                                <Text style={[styles.label_20]}>{this.paper.score}分</Text>
                                <Text style={[styles.label_gray]}>本次成绩</Text>
                            </View>
                            <View style={[styles.ai_ct, styles.p_20]}>
                                <Text style={[styles.label_20]}>{this.paper.correctNum}题</Text>
                                <Text style={[styles.label_gray]}>正确题目</Text>
                            </View>
                            <View style={[styles.ai_ct, styles.p_20]}>
                                <Text style={[styles.label_20]}>{this.paper.topicNum - this.paper.correctNum}题</Text>
                                <Text style={[styles.label_gray]}>错误题目</Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={[styles.bg_blue, styles.circle_20, styles.p_15, styles.ml_20, styles.mr_20, styles.mt_40, styles.ai_ct]} onPress={() => navigation.goBack()}>
                        <Text style={[styles.label_white]}>{this.paper.isPass == 1 ? '考试回顾' : '重新考试'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    container: {
        flex: 1,
        backgroundColor: '#292C3F',
    },
    light: {
        width: theme.window.width * 0.8,
        height: 90
    }
});

export const LayoutComponent = PaperDone;

export function mapStateToProps(state) {
    return {
        info: state.exam.info,
    };
}
