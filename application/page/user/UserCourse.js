//import liraries
import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';

import RefreshListView, {RefreshState} from '../../component/base/RefreshListView';
import VodCell from '../../component/course/VodCell';
import asset from '../../config/asset';
import theme from '../../config/theme';

// create a component
class UserCourse extends Component {

    static navigationOptions = {
        title:'已购资源',
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

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    componentDidMount() {
        this._onHeaderRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {course} = nextProps;

        if (course !== this.props.course) {
            this.pages = course.pages;
            this.total = course.total;
            this.items = this.items.concat(course.items);
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    _onHeaderRefresh() {
        const {actions} = this.props;

        this.page = 0;
        this.pages = 1;
        this.total = 0;
        this.items = [];

        actions.user.course(0);
        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
        const {actions} = this.props;

        if (this.page < (this.pages - 1)) {
            this.page++;
			this.setState({refreshState: RefreshState.FooterRefreshing});
			actions.user.course(this.page);
		}
		else
		{
			this.setState({refreshState: RefreshState.NoMoreData});
		}
    }

    _renderItem(item) {
        const {navigation} = this.props;
        const course = item.item;

        let page = 'Vod';
        if (course.ctype == 1) {
            page = 'Audio';
        } else if (course.ctype == 2) {
            page = 'Live';
        } else if (course.ctype == 3) {
            page = 'Article';
        }

        return (
            <VodCell course={course} onPress={()=> navigation.navigate(page, {course: course})}/>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <RefreshListView
                    contentContainerStyle={[styles.p_20]}
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
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
});

export const LayoutComponent = UserCourse;

export function mapStateToProps(state) {
    return {
        course: state.user.course,
    };
}