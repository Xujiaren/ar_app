//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, View, Image, FlatList, StyleSheet } from 'react-native';

import ArticleCell from '../../component/course/ArticleCell';
import asset from '../../config/asset';
import theme from '../../config/theme';

// create a component
class ArticleChannel extends Component {

    static navigationOptions = {
        title:'图文资源',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        const {navigation} = props;
        this.channel = navigation.getParam('channel', {});

        this.items = [];

        this.state = {
            loaded: false,
        }

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    componentDidMount() {
        this._onHeaderRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {channel} = nextProps;
        if (channel !== this.props.channel) {
            this.items = channel;

            this.setState({
                loaded: true,
            })
        }
    }

    _onHeaderRefresh() {
        const {actions} = this.props;

        this.items = [];
        this.page = 1;
        this.pages = 1;
        
        actions.site.channel(this.channel.channelId, 0);
    }

    _renderItem(item) {
        const {navigation} = this.props;
        const course = item.item;
        return (
            <ArticleCell course={course} ttype={course.ttype} onPress={()=> navigation.navigate('Article', {course: course})}/>
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
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.p_20]}
                    data={this.items}
                    extraData={this.state}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this._renderItem}
                    ListEmptyComponent={() => {
                        return (
                            <View style={[styles.ai_ct, styles.jc_ct]}>
                                <Image source={asset.base.empty} style={[styles.empty, styles.mt_25]}/>
                            </View>
                        )
                    }}
                />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
});

export const LayoutComponent = ArticleChannel;

export function mapStateToProps(state) {
    return {
        channel: state.site.channel,
    };
}