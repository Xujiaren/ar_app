//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, TouchableOpacity, View, Text, Image, ImageBackground, FlatList, StyleSheet } from 'react-native';

import asset from '../../../config/asset';
import theme from '../../../config/theme';

// create a component
class Map extends Component {

    static navigationOptions = {
        title:'地图关卡',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);
        const {navigation} = props;
        this.map = navigation.getParam('map', {});
        this.maps = [];

        this.state = {
            loaded: false,
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.onJump = this.onJump.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    componentDidMount() {
        const {navigation} = this.props;

        this.focuSub = navigation.addListener('didFocus', (route) => {
            this.onRefresh();
        })
    }

    componentWillUnmount(){
        this.focuSub && this.focuSub.remove();
    }

    componentWillReceiveProps(nextProps) {
        const {map_info} = nextProps;

        if (map_info !== this.props.map_info) {
            this.maps = map_info;

            this.setState({
                loaded: true,
            })
        }
    }

    onRefresh() {
        const {actions} = this.props;
        actions.course.mapInfo(this.map.mapId);
    }

    onJump(card) {
        const {navigation, actions} = this.props;

        const pass = card.finishStatus == 1 || card.lockStatus == 1;
        
        let page = 'Paper';
        let args = {paper: card.paperDTO, level_id: card.levelId};
        if (card.contentSort == 1) {
            page = 'Vod';

            if (pass) {
                args = {course: card.courseDTO, level_id: card.levelId};
            } else {
                args = {course: card.courseDTO, level_id: card.levelId};
            }
        }

        actions.course.levelStatus({
            level_id: card.levelId,
            resolved: (data) => {
                if (data.finishStatus == 1) {
                    navigation.navigate(page, args);
                } else {
                    navigation.navigate(page, args);
                }
            },
            rejected: (res) => {
                
            },
        })
        
    }


    renderItem(item) {
        const card = item.item;
        const lock = card.lockStatus == 1;
        const pass = card.finishStatus == 1 || card.lockStatus == 0;
        
        return (
            <TouchableOpacity style={[styles.item, styles.ai_ct, styles.jc_ct, styles.p_15]} onPress={() => this.onJump(card)} disabled={lock}>
                <ImageBackground source={pass ? asset.course.map.pass : asset.course.map.lock} style={[styles.level_icon, styles.ai_ct, styles.jc_ct]}>
                    {pass ? 
                    <Text style={[styles.label_white, styles.label_36]}>{item.index + 1}</Text>
                    :null}
                </ImageBackground>
            </TouchableOpacity>
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
                    contentContainerStyle={styles.p_20}
                    numColumns={4}
                    data={this.maps}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this.renderItem}
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
    item: {
        width: (theme.window.width - 40) / 4,
    },
    level_icon: {
        width: 58,
        height: 58,
    }
});

export const LayoutComponent = Map;

export function mapStateToProps(state) {
    return {
        map_info: state.course.map_info,
    };
}