import React, {PureComponent} from 'react'
import {View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Platform} from 'react-native'

export const RefreshState = {
    Idle: 0,
    HeaderRefreshing: 1,
    FooterRefreshing: 2,
    NoMoreData: 3,
    Failure: 4,
}

const DEBUG = false
const log = (text) => {DEBUG && console.log(text)}

type Props = {
    refreshState: number,
    onHeaderRefresh: (refreshState: number) => void,
    onFooterRefresh?: (refreshState: number) => void,
    data: Array<any>,

    footerContainerStyle?: any,
    footerTextStyle?: any,

    listRef?: any,

    footerRefreshingText?: string,
    footerFailureText?: string,
    footerNoMoreDataText?: string,
}

class RefreshListView extends PureComponent {
    props: Props

    static defaultProps = {
        footerRefreshingText: '加载中…',
        footerFailureText: '点击重新加载',
        footerNoMoreDataText: '已加载',
    }

    constructor(props) {
        super(props);

        this.shouldLoadMore = false;
    }

    componentWillReceiveProps(nextProps: Props) {
        log('[RefreshListView]  RefreshListView componentWillReceiveProps ' + nextProps.refreshState)
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        log('[RefreshListView]  RefreshListView componentDidUpdate ' + prevProps.refreshState)
    }

    onHeaderRefresh = () => {
        log('[RefreshListView]  onHeaderRefresh')

        if (this.shouldStartHeaderRefreshing()) {
            log('[RefreshListView]  onHeaderRefresh')
            this.props.onHeaderRefresh && this.props.onHeaderRefresh(RefreshState.HeaderRefreshing)
        }
    }

    onEndReached = (info: any) => {
        log('[RefreshListView]  onEndReached   ' + info.distanceFromEnd)
        this.shouldLoadMore = true;

        if (this.shouldStartFooterRefreshing() && this.shouldLoadMore) {
            log('[RefreshListView]  onFooterRefresh')
            this.props.onFooterRefresh && this.props.onFooterRefresh(RefreshState.FooterRefreshing)
        }
    }

    onMomentumScrollEnd = () => {
        if(this.shouldLoadMore = true) {
            this.shouldLoadMore = false;
        }
    }

    shouldStartHeaderRefreshing = () => {
        log('[RefreshListView]  shouldStartHeaderRefreshing')

        if (this.props.refreshState == RefreshState.HeaderRefreshing ||
            this.props.refreshState == RefreshState.FooterRefreshing) {
            return false
        }

        return true
    }

    shouldStartFooterRefreshing = () => {
        log('[RefreshListView]  shouldStartFooterRefreshing')

        let {refreshState, data} = this.props
        if (data.length == 0) {
            return false
        }

        return (refreshState == RefreshState.Idle)
    }

    render() {
        log('[RefreshListView]  render')
        const ts = Platform.OS === 'android' ? 0.01 : 0;
        return (
            <FlatList
                ref={this.props.listRef}
                onEndReached={this.onEndReached}
                onMomentumScrollEnd={this.onMomentumScrollEnd}
                onRefresh={this.onHeaderRefresh}
                refreshing={this.props.refreshState == RefreshState.HeaderRefreshing}
                ListFooterComponent={this.renderFooter}
                onEndReachedThreshold={ts}
                numColumns={this.props.count}
                refreshControl={
                    <RefreshControl
                        refreshing={this.props.refreshState == RefreshState.HeaderRefreshing}
                        onRefresh={this.onHeaderRefresh}
                        tintColor="#00A6F6"
                        colors={['#F4FDFF']}
                     />
              }
                {...this.props}
            />
        )
    }

    renderFooter = () => {
        let footer = null

        let footerContainerStyle = [styles.footerContainer, this.props.footerContainerStyle]
        let footerTextStyle = [styles.footerText, this.props.footerTextStyle]
        let {footerRefreshingText, footerFailureText, footerNoMoreDataText} = this.props

        switch (this.props.refreshState) {
            case RefreshState.Idle:
                footer = (<View style={footerContainerStyle} />)
                break
            case RefreshState.Failure: {
                footer = (
                    <TouchableOpacity
                        style={footerContainerStyle}
                        onPress={() => {
                            this.props.onFooterRefresh && this.props.onFooterRefresh(RefreshState.FooterRefreshing)
                        }}
                    >
                        <Text style={footerTextStyle}>{footerFailureText}</Text>
                    </TouchableOpacity>
                )
                break
            }
            case RefreshState.FooterRefreshing: {
                footer = (
                    <View style={footerContainerStyle} >
                        <ActivityIndicator size="small" color="#00A6F6" />
                        <Text style={[footerTextStyle, {marginLeft: 7}]}>{footerRefreshingText}</Text>
                    </View>
                )
                break
            }
            case RefreshState.NoMoreData: {
                footer = (
                    <View style={footerContainerStyle} >
                        <Text style={footerTextStyle}>{footerNoMoreDataText}</Text>
                    </View>
                )
                break
            }
        }
        return footer
    }
}

const styles = StyleSheet.create({
    footerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        height: 44,
    },
    footerText: {
        fontSize: 14,
        color: '#555555'
    }
})

export default RefreshListView;