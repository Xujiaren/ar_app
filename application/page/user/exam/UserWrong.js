//import liraries
import React, { Component } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Modal, StyleSheet } from 'react-native';

import _ from 'lodash';
import RefreshListView, {RefreshState} from '../../../component/base/RefreshListView';
import asset from '../../../config/asset';
import theme from '../../../config/theme';

const chars = ['A', 'B', 'C' , 'D', 'E', 'F', 'G', 'H'];

// create a component
class UserWrong extends Component {
    static navigationOptions = {
        title:'错题集',
        headerRight: () => <View/>
    };

    constructor(props) {
        super(props);

        this.page = 1;
        this.pages = 1;
        this.total = 0;
        this.items = [];

        this.state = {
            topic_preview: false,
            topic_index: 0,
            refreshState: RefreshState.Idle,
        }

        this.onPreview = this.onPreview.bind(this);

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    componentDidMount() {
        this._onHeaderRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {wtest} = nextProps;
        if (wtest !== this.props.wtest) {
            this.pages = wtest.pages;
            this.total = wtest.total;
            this.items = this.items.concat(wtest.items);
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    _onHeaderRefresh() {
        const {actions} = this.props;

        this.page = 1;
        this.pages = 1;
        this.total = 0;
        this.items = [];

        actions.exam.wrongTest(0);
        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
        const {actions} = this.props;

        if (this.page < this.pages) {
            this.setState({refreshState: RefreshState.FooterRefreshing});
            this.page = this.page + 1;
            actions.exam.wrongTest(this.page);
        } else {
            this.setState({refreshState: RefreshState.NoMoreData});
        }
    }

    onPreview(index) {
        this.setState({
            topic_preview: true,
            topic_index: index,
        })
    }

    _renderItem(item) {
        const topic = item.item;
        return (
            <TouchableOpacity style={[styles.p_20, styles.bg_white, styles.b_line]} onPress={() => this.onPreview(item.index)}>
                <Text>[{topic.paperName}]{topic.title}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const {topic_preview, topic_index} = this.state;

        const topic = this.items[topic_index] ? this.items[topic_index] : {};

        let optionList = [];
        let coptionIds = [];
        let uoptionIds = [];
        if (topic.topicId) {

            optionList = topic.optionList;
            topic.answer.split(',').map((op, index) => {
                coptionIds.push(parseInt(op));
            })

            topic.userAnswer.answer.split(',').map((op, index) => {
                uoptionIds.push(parseInt(op));
            })
        }

        return (
            <View style={styles.container}>
                <RefreshListView
                    showsVerticalScrollIndicator={false}
                    data={this.items}
                    extraData={this.state}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this._onHeaderRefresh}
                    onFooterRefresh={this._onFooterRefresh}
                    ListEmptyComponent={() => {
                        if (this.state.refreshState == RefreshState.Idle) {
                            return (
                                <View style={[styles.ai_ct, styles.jc_ct]}>
                                    <Image source={asset.base.empty} style={[styles.empty, styles.mt_25]}/>
                                </View>
                            )
                        }

                        return null;
                    }}
                />
                <Modal visible={topic_preview} transparent={true} onRequestClose={() => {
                    this.setState({topic_preview:false})
                }}>
                    <TouchableOpacity style={[styles.modal]} onPress={()=>this.setState({topic_preview:false})}/>
                    <View style={[styles.preview, styles.bg_white, styles.circle_5]}>
                        <ScrollView contentContainerStyle={[styles.p_20]}>
                            <Text style={[styles.label_16]}>{topic.title}</Text>
                            <View style={[styles.mt_15]}>
                                {optionList.map((option, index) => {
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
                            <Text style={[styles.label_16, styles.mt_15]}>解析</Text>
                            <Text style={[styles.label_dgray, styles.mt_5]}>{topic.analysis}</Text>
                            <Text style={[styles.label_dgray, styles.mt_15]}>题目来源：{topic.paperName}</Text>
                        </ScrollView>
                        <TouchableOpacity style={[styles.p_15, styles.ai_ct]} onPress={()=>this.setState({topic_preview:false})}>
                            <Text>关闭</Text>
                        </TouchableOpacity>
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
    preview: {
        position:'absolute',
        top: 100,
        left: 20,
        right: 20,
        bottom: 100,
    },
    dot: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#EBEBEB',
        borderWidth: 1,
        borderColor: '#EBEBEB',
    },
    dot_user_on: {
        backgroundColor: '#F4623F',
        borderColor: '#F4623F'
    },
    dot_correct_on: {
        backgroundColor: '#99D321',
        borderColor: '#99D321'
    },
});

export const LayoutComponent = UserWrong;

export function mapStateToProps(state) {
    return {
        wtest: state.exam.wtest,
    };
}