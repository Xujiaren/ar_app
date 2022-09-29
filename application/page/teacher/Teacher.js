//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Carousel from 'react-native-looped-carousel';

import RankView from '../../component/base/RankView';
import VodCell from '../../component/course/VodCell';
import NewsCell from '../../component/news/NewsCell';
import HudView from '../../component/base/HudView';
import theme from '../../config/theme';

// create a component
class Teacher extends Component {

    static navigationOptions = {
        title:'讲师主页',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        const {navigation} = this.props;
        this.teacher = navigation.getParam('teacher', {});
        this.gallery = [];
        this.items = [];
        this.news = [];

        this.state = {
            loaded: false,
            isFollow: false,
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.onFollow = this.onFollow.bind(this);

        this.renderHeader = this.renderHeader.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    componentDidMount() {
        this.onRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {info} = nextProps;

        if (info !== this.props.info) {
            this.teacher = info.teacher;
            this.items = info.course;
            this.gallery = this.teacher.galleryList;
            this.news = info.article ? info.article.items : [];

            this.setState({
                loaded: true,
                isFollow: this.teacher.isFollow,
            })
        }
    }

    onRefresh() {
        const {actions} = this.props;
        actions.teacher.info(this.teacher.teacherId);
    }

    onFollow(){
        const {navigation, actions, user} = this.props;
        const {isFollow} = this.state;


        if (!user.userId) {
            navigation.navigate('PassPort');
        } else {
            if (isFollow) {
                actions.user.unfollowTeacher({
                    teacher_id: this.teacher.teacherId,
                    resolved: (data) => {
                        this.refs.hud.show('取消关注', 1);
    
                        this.setState({
                            isFollow: false,
                        });
        
                    },
                    rejected: (res) => {
                        
                    },
                });
    
            } else {

                actions.user.followTeacher({
                    teacher_id: this.teacher.teacherId,
                    resolved: (data) => {
                        this.refs.hud.show('关注成功', 1);
    
                        this.setState({
                            isFollow: true,
                        });
        
                    },
                    rejected: (res) => {
                        
                    },
                });
            }
        }
    }

    renderItem(item) {
        const {navigation} = this.props;
        const course = item.item;

        return (
            <VodCell style={[styles.pl_20, styles.pr_20]} course={course} onPress={() => navigation.navigate('Vod', {course: course})}/>
        )
    }

    renderHeader() {
        const {navigation} = this.props;
        const {isFollow} = this.state;

        return (
            <View style={[styles.mb_15]}>
                <View style={[styles.thumb, styles.bg_lgray]}>
                    {this.gallery.length > 0 ?
                    <Carousel
                        delay={5000}
                        style={styles.thumb}
                        autoplay
                        swiper
                        bullets={true}
                        pageInfo={false}
                        bulletStyle={{//未选中的圆点样式
                            backgroundColor: '#ffffff',
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            borderColor: '#ffffff',
                            margin:6,
                            opacity:0.49,
                        }} 
                        chosenBulletStyle={{    //选中的圆点样式
                            backgroundColor: '#ffffff',
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            margin:6,
                        }}
                    >
                        {
                            this.gallery.map((img,index)=>{
                                return (
                                    <View key={index}>
                                        <Image key={index} style={styles.thumb} source={{uri:img.fpath}}/>
                                    </View>
                                );
                            })
                        }
                    </Carousel>
                    : null}
                </View>
                <View style={[styles.p_20]}>
                    <View style={[styles.row, styles.ai_fs, styles.jc_sb]}>
                        <View>
                            <Text style={[styles.label_18]}>{this.teacher.teacherName}</Text>
                            <RankView style={[styles.mt_10]} value={parseInt(this.teacher.score)}/>
                        </View>
                        <TouchableOpacity style={[styles.p_5, styles.pl_15, styles.pr_15, styles.circle_20, styles.bg_lgray, isFollow && styles.bg_blue]} onPress={this.onFollow}>
                            <Text style={[styles.label_blue, isFollow && styles.label_white]}>{isFollow ? '取消关注' : '+ 关注'}</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.mt_10]}>{this.teacher.content}</Text>
                </View>
                <View style={[styles.p_20]}>
                    {this.news.map((news, index) => {
                        return (
                            <NewsCell  key={'news_' + index}  ttype={news.ttype} style={[styles.mb_15]} news={news} onPress={() => navigation.navigate('News', {news: news})}/>
                        )
                    })}
                </View>
            </View>
        )
    }

    render() {
        const {loaded} = this.state;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#00A6F6"/>
            </View>
        )

        return (
            <View style={styles.container}>
                <FlatList
                    data={this.items}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this.renderItem}
                    ListHeaderComponent={this.renderHeader}
                />
                <HudView ref={'hud'} />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    thumb: {
        width: theme.window.width,
        height: theme.window.width * 0.56,
    }
});

export const LayoutComponent = Teacher;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        info: state.teacher.info,
    };
}