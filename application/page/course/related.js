//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, View, StyleSheet, Text, Image, TouchableOpacity, FlatList,ScrollView } from 'react-native';

import VodCell from '../../component/course/VodCell';
import VVodCell from '../../component/course/VVodCell';
import ArticleCell from '../../component/course/ArticleCell';
import TabView from '../../component/base/TabView';
import iconMap from '../../config/font';
import asset from '../../config/asset';
import theme from '../../config/theme';

// create a component
class Related extends Component {

    static navigationOptions = {
        title: '全部',
        headerRight: <View />
    };

    constructor(props) {
        super(props);
        const { navigation } = props;
        this.course = navigation.getParam('course', {});
        this.related = [];
        this.state = {
        }
    }

    componentDidMount() {
        this._onHeaderRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const { related } = nextProps;
        if (related !== this.props.related) {
            this.related = related
        }
    }

    _onHeaderRefresh() {
        const { actions } = this.props;
        actions.course.getRelated(10, this.course.courseId);
    }


    render() {
        const { navigation } = this.props;
        return (
            <ScrollView>
                <View style={styles.p_20}>
                    {this.related.map((course, index) => {
                        if (course.ctype == 3) {
                            return (
                                <ArticleCell ttype={course.ttype} key={'vod_' + index} style={[styles.mt_15]} course={course} onPress={() => navigation.navigate('Article', { course: course })} />
                            )
                        }
                        return (
                            <VodCell key={"audio_" + index} course={course} onPress={() => course.ctype == 0 ? navigation.push('Vod', { course: course }) : navigation.push('Audio', { course: course })} />
                        )
                    })}
                </View>
            </ScrollView>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    vod: {
        width: (theme.window.width - 60) / 2,
    },
});

export const LayoutComponent = Related;

export function mapStateToProps(state) {
    return {
        related: state.course.related
    };
}