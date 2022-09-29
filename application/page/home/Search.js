//import liraries
import React, { Component } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, TextInput, Platform, StyleSheet } from 'react-native';

import HudView from '../../component/base/HudView';
import NavCell from '../../component/base/NavCell';
import TeacherCell from '../../component/teacher/TeacherCell';
import VodCell from '../../component/course/VodCell';
import NewsCell from '../../component/news/NewsCell';
import ArticleCell from '../../component/course/ArticleCell';
import asset from '../../config/asset';
import iconMap from '../../config/font';
import theme from '../../config/theme';

// create a component
class Search extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);

        this.local = [];
        this.hot = [];

        this.teachers = [];
        this.vods = [];
        this.aods = [];
        this.cods = [];
        this.articles = [];
        this.recomms = [];

        this.state = {
            search: false,
            keyword: '',
            placeholder: '',
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onClear = this.onClear.bind(this);
        this.onClearAll = this.onClearAll.bind(this);

        this._renderResult = this._renderResult.bind(this);
        this._renderEmpty = this._renderEmpty.bind(this);
    }

    componentDidMount() {
        this.onRefresh();
    }

    onRefresh() {
        const { actions } = this.props;
        actions.config.config();
        actions.site.history();
        actions.course.recomm();
    }

    onSearch() {
        const { actions } = this.props;
        const { placeholder } = this.state;

        let keyword = this.state.keyword;

        if (keyword == '') {
            keyword = placeholder;
        }

        this.teachers = [];
        this.vods = [];
        this.articles = [];

        this.setState({
            keyword: keyword,
            search: true,
        })

        actions.site.search(keyword);
    }

    onClear(index) {
        const { actions } = this.props;

        actions.site.clearHistory({
            index: index,
            resolved: (data) => {
                setTimeout(() => actions.site.history(), 300);
            },
            rejected: (msg) => {

            }
        })
    }

    onClearAll() {
        const { actions } = this.props;

        actions.site.clearAllHistory({
            resolved: (data) => {
                actions.site.history();
            },
            rejected: (msg) => {

            }
        })
    }

    componentWillReceiveProps(nextProps) {
        const { config, history, search, recomm } = nextProps;

        if (config !== this.props.config && config.search_hot) {
            this.hot = config.search_hot.split('|');
            this.setState({
                placeholder: config.search_def,
            })
        }

        if (history !== this.props.history) {
            this.local = history;
        }

        if (search !== this.props.search) {
            this.teachers = search.teacher.items;
            this.vods = search.vcourse.items;
            this.aods = search.acourse.items;
            this.cods = search.audiocourse.items;
            this.articles = search.article.items;
        }

        if (recomm !== this.props.recomm) {
            this.recomms = recomm;
        }
    }

    _renderResult() {
        const { navigation } = this.props;
        return (
            <ScrollView contentContainerStyle={[styles.bg_white, styles.p_20]}>
                {this.teachers.length > 0 ?
                    <View style={[styles.b_line, styles.pb_20]}>
                        <View style={[styles.row, styles.ai_ct, styles.ai_ct, styles.jc_sb, styles.pb_15]}>
                            <Text style={[styles.label_16]}>讲师</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('TeacherChannel')}>
                                <Text>全部讲师<Text style={[styles.icon, styles.label_gray]}>{iconMap('right')}</Text></Text>
                            </TouchableOpacity>
                        </View>
                        {this.teachers.map((teacher, index) => {
                            return (
                                <TeacherCell key={'teacher_' + index} style={[styles.mt_15]} teacher={teacher} onPress={() => navigation.navigate('Teacher', { teacher: teacher })} />
                            )
                        })}
                    </View>
                    : null}
                {this.vods.length > 0 ?
                    <View style={[styles.b_line, styles.pb_20]}>
                        <View style={[styles.row, styles.ai_ct, styles.ai_ct, styles.jc_sb, styles.pb_15]}>
                            <Text style={[styles.label_16]}>资源</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('CourseCategory')}>
                                <Text>全部资源<Text style={[styles.icon, styles.label_gray]}>{iconMap('right')}</Text></Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.mb_20]}>
                            {this.vods.map((course, index) => {
                                return (
                                    <VodCell key={'vod_' + index} style={[styles.mt_15]} course={course} onPress={() => navigation.navigate('Vod', { course: course })} />
                                )
                            })}
                        </View>
                        <View style={[styles.mb_20]}>
                            {this.aods.map((course, index) => {
                                return (
                                    <ArticleCell ttype={course.ttype} key={'vod_' + index} style={[styles.mt_15]} course={course} onPress={() => navigation.navigate('Article', { course: course })} />
                                )
                            })}
                        </View>
                        <View>
                            {this.cods.map((course, index) => {
                                return (
                                    <VodCell key={'vod_' + index} style={[styles.mt_15]} course={course} onPress={() => navigation.navigate('Audio', { course: course })} />
                                )
                            })}
                        </View>
                    </View>
                    : null}
                {this.articles.length > 0 ?
                    <View style={[styles.mt_20]}>
                        <View style={[styles.row, styles.ai_ct, styles.ai_ct, styles.jc_sb, styles.pb_15]}>
                            <Text style={[styles.label_16]}>资讯</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('NewsChannel')}>
                                <Text>全部资讯<Text style={[styles.icon, styles.label_gray]}>{iconMap('right')}</Text></Text>
                            </TouchableOpacity>
                        </View>
                        {this.articles.map((news, index) => {
                            return (
                                <NewsCell key={'news_' + index} ttype={news.ttype} style={[styles.mt_15]} news={news} onPress={() => navigation.navigate('News', { news: news })} />
                            )
                        })}
                    </View>
                    : null}
            </ScrollView>
        )
    }

    _renderEmpty() {
        const { navigation } = this.props;

        return (
            <View>
                <View style={[styles.bg_white, styles.p_20, styles.ai_ct, styles.jc_ct]}>
                    <Image source={asset.base.empty} />
                    <Text style={[styles.mt_10, styles.label_gray]}>搜索记录为空</Text>
                </View>

                <View style={[styles.p_20]}>
                    <NavCell label={'猜你喜欢'} theme={'refresh'} />
                    {this.recomms.map((course, index) => {
                        return (
                            <VodCell key={"audio_" + index} course={course} onPress={() => navigation.navigate('Vod', { course: course })} />
                        )
                    })}
                </View>

            </View>
        )
    }
    render() {
        const { navigation } = this.props;
        const { placeholder, keyword, search } = this.state;

        return (
            <View style={styles.container}>
                <View style={[styles.search_container, styles.row, styles.jc_sb, styles.ai_ct, styles.p_20, styles.pb_10, styles.bg_white]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} >
                        <Text style={[styles.icon]}>{iconMap('left')}</Text>
                    </TouchableOpacity>
                    <View style={[styles.row, styles.pl_10, styles.ml_10, styles.circle_10, styles.search, styles.ai_ct]}>
                        <Text style={[styles.icon]}>{iconMap('search')}</Text>
                        <TextInput
                            style={[styles.input, styles.p_10]}
                            placeholder={placeholder}
                            placeholderTextColor={'#c0c0c0'}
                            value={keyword}
                            onChangeText={(text) => { this.setState({ keyword: text, search: false }); }}
                        />
                    </View>
                    <TouchableOpacity onPress={() => this.onSearch()} style={[styles.ml_10]}>
                        <Text>搜索</Text>
                    </TouchableOpacity>
                </View>

                {search ?
                    (this.teachers.length > 0 || this.vods.length > 0 || this.articles.length > 0 ? this._renderResult() : this._renderEmpty())
                    :
                    <ScrollView>
                        <View style={[styles.bg_white]}>
                            <View style={[styles.p_15, styles.ai_end]}>
                                <TouchableOpacity onPress={this.onClearAll}>
                                    <Text style={[styles.label_gray]}>清除历史</Text>
                                </TouchableOpacity>
                            </View>
                            {this.local && this.local.map((keyword, index) => {
                                return (
                                    <TouchableOpacity key={'local_' + index} style={[styles.row, styles.p_15, styles.b_line, styles.ai_ct, styles.jc_sb]} onPress={() => {
                                        this.setState({
                                            keyword: keyword
                                        }, () => {
                                            this.onSearch();
                                        })
                                    }}>
                                        <Text>{keyword}</Text>
                                        <TouchableOpacity onPress={() => this.onClear(index)}>
                                            <Text style={[styles.icon, styles.label_gray]}>{iconMap('guanbi')}</Text>
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>

                        <View style={[styles.bg_white, styles.mt_10, styles.p_20]}>
                            <Text style={[styles.label_16]}>热门搜索</Text>
                            <View style={[styles.row, styles.wrap]}>
                                {this.hot.map((keyword, index) => {
                                    return (
                                        <TouchableOpacity key={'hot_' + index} style={[styles.bg_lgray, styles.p_5, styles.pl_15, styles.pr_15, styles.circle_20, styles.mt_10, styles.mr_15]} onPress={() => {
                                            this.setState({
                                                keyword: keyword
                                            }, () => {
                                                this.onSearch();
                                            })
                                        }}>
                                            <Text>{keyword}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </View>
                    </ScrollView>}
                <HudView ref={'hud'} />
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
    search_container: {
        height: Platform.OS === 'android' ? 60 : 85,
        paddingTop: Platform.OS === 'android' ? 10 : 40,
    },
    search: {
        width: (theme.window.width - 40) * 0.85,
        backgroundColor: '#F7F7F8',
        height: 40,
    },
    input: {
        width: (theme.window.width - 40) * 0.85 - 30,
    }
});

export const LayoutComponent = Search;

export function mapStateToProps(state) {
    return {
        config: state.config.config,
        history: state.site.history,
        search: state.site.search,
        recomm: state.course.recomm,
    };
}