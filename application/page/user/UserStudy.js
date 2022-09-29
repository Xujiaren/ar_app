//import liraries
import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';

import RefreshListView, {RefreshState} from '../../component/base/RefreshListView';
import TabView from '../../component/base/TabView';
import StudyCell from '../../component/user/StudyCell';
import asset from '../../config/asset';
import theme from '../../config/theme';

// create a component
class UserStudy extends Component {

    static navigationOptions = {
        title:'学习记录',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        this.page = 0;
        this.pages = 1;
        this.total = 0;
        this.items = [];

        this.state = {
            type: 0,
            refreshState: RefreshState.Idle,
        }

        this.renderItem = this.renderItem.bind(this);
        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
    }

    componentDidMount() {
        this._onHeaderRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {study} = nextProps;

        if (study !== this.props.study) {
            this.pages = study.pages;
            this.total = study.total;
            this.items = this.items.concat(study.items);
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    _onHeaderRefresh() {
        const {actions} = this.props;
        const {type} = this.state;

        this.page = 0;
        this.pages = 1;
        this.total = 0;
        this.items = [];

        actions.user.study(type, 0);
        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
        const {actions} = this.props;
        const {type} = this.state;

        if (this.page < this.pages) {
            this.setState({refreshState: RefreshState.FooterRefreshing});
            this.page = this.page + 1;
            actions.user.study(type, this.page);

        } else {
            this.setState({refreshState: RefreshState.NoMoreData});
        }
    }

    renderItem(item) {
        const {navigation} = this.props;
        const {type} = this.state;
        const course = item.item;
    
        let page = 'Vod';

        if (course.ctype == 1) {
            page = 'Audio';
        } else if (course.ctype == 3) {
            page = 'Article';
        }

        return (
            <StudyCell course={course} onPress={() => navigation.navigate(page, {course: course})} progress={type == 0 ? 0 : 100}/>
        )
    }

    render() {
        const {type} = this.state;

        return (
            <View style={styles.container}>
                <TabView items={['在学资源', '已学资源']} center={true} current={type} onSelected={(index) => {
                    this.setState({
                        type: index
                    }, () => {
                        this._onHeaderRefresh();
                    })
                }}/>
                <RefreshListView
                    contentContainerStyle={[styles.pt_15]}
                    showsVerticalScrollIndicator={false}
                    data={this.items}
                    extraData={this.state}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this.renderItem}
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
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
});

export const LayoutComponent = UserStudy;

export function mapStateToProps(state) {
    return {
        study: state.user.study,
    };
}