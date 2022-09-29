//import liraries
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, DeviceEventEmitter } from 'react-native';
import Picker from 'react-native-picker';

import RefreshListView, {RefreshState} from '../../component/base/RefreshListView';
import TabView from '../../component/base/TabView';
import VodCell from '../../component/course/VodCell';
import ArticleCell from '../../component/course/ArticleCell';

import iconMap from '../../config/font';
import asset from '../../config/asset';
import theme from '../../config/theme';

const ctypes = ['全部','视频', '图文' , '音频'];

// create a component
class CourseCategory extends Component {

    constructor(props) {
        super(props);

        this.total = 0;
        this.page = 0;
        this.pages = 1;

        this.category = [];
        this.items = [];

        this.state = {

            cindex: 0,
            ccindex: 0,
            cccindex: 0,

            ctype: 0,
            sort: 0,
            refreshState: RefreshState.Idle,
        }

        this._renderItem = this._renderItem.bind(this);
        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);

        this._onSort = this._onSort.bind(this);
        this._onCtype = this._onCtype.bind(this);
    }

    componentDidMount() {
        const {navigation, actions} = this.props;
        actions.config.categoryCourse();

        this._onHeaderRefresh();

        this.blurSub = navigation.addListener('willBlur', (route) => {
            Picker.hide();
        })

        this.refreshSub = DeviceEventEmitter.addListener('refresh', (data) => {
            actions.config.categoryCourse();
            this._onHeaderRefresh();
        });

    }

    componentWillUnmount(){
        this.refreshSub && this.refreshSub.remove();
        this.blurSub && this.blurSub.remove();
    }

    componentWillReceiveProps(nextProps) {
        const {category, index} = nextProps;
        
        if (category !== this.props.category) {
            this.category = category;
        }

        if (index !== this.props.index && index.items) {
            this.items = this.items.concat(index.items);
            this.total = index.total;
            this.pages = index.pages;
            this.page = index.page;
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    _onHeaderRefresh() {
        const {actions} = this.props;
        const {cindex, ccindex, cccindex, ctype, sort} = this.state;

        let _ctype = ctype;
        if(ctype==2){
			_ctype = 3;
		}else if(ctype==3){
			_ctype = 1;
		}else if(ctype==1){
			_ctype = 0;
		}else if(ctype==0){
			_ctype = -1;
		}

        this.page = 0;
        this.pages = 1;
        this.items = [];

        let category_id = 0;
        let ccategory_id = 0;
        let internal_category_id = 0;

        if (cindex > 0) {
            category_id = this.category[cindex - 1].categoryId;
            
            if (ccindex > 0) {
                ccategory_id = this.category[cindex - 1].child[ccindex - 1].categoryId;

                if (cccindex > 0) {
                    internal_category_id = this.category[cindex - 1].child[ccindex - 1].child[cccindex - 1].categoryId;
                }
            }
        }

        
        
        actions.course.index(category_id, ccategory_id, internal_category_id, _ctype, sort-1, this.page);
        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
        const {actions} = this.props;
        const {cindex, ccindex, cccindex, ctype, sort} = this.state;

        let _ctype = ctype;
        if(ctype==2){
			_ctype = 3;
		}else if(ctype==3){
			_ctype = 1;
		}else if(ctype==1){
			_ctype = 0;
		}else if(ctype==0){
			_ctype = -1;
		}

        let category_id = 0;
        let ccategory_id = 0;
        let internal_category_id = 0;

        if (cindex > 0) {
            category_id = this.category[cindex - 1].categoryId;
            
            if (ccindex > 0) {
                ccategory_id = this.category[cindex - 1].child[ccindex - 1].categoryId;

                if (cccindex > 0) {
                    internal_category_id = this.category[cindex - 1].child[ccindex - 1].child[cccindex - 1].categoryId;
                }
            }
        }

        if (this.page < (this.pages - 1)) {
            this.setState({refreshState: RefreshState.FooterRefreshing});
            this.page = this.page + 1;
            actions.course.index(category_id, ccategory_id, internal_category_id, _ctype, sort-1, this.page);

        } else {
            this.setState({refreshState: RefreshState.NoMoreData});
        }
    }

    _onSort() {
        const {sort} = this.state;
        const data = ['默认', '最新','最热'];
        
        let init = [];
        if (sort == 0) {
            init.push('默认');
        } else if(sort == 2){
            init.push('最热');
        }else{
            init.push('最新');
        }

        Picker.init({
            pickerData: data,
            selectedValue: init,
            pickerTitleText: '选择',
            pickerCancelBtnText: '取消',
            pickerConfirmBtnText: '确认',
            onPickerConfirm: data => {
                this.setState({
                    sort: data=='默认'?0:data=='最新'?1:2,
                }, () => {
                    this._onHeaderRefresh();
                })
            },
        });

        Picker.show();
    }

    _onCtype() {
        const {ctype} = this.state;
        
        let init = [];
        if (ctype == 0) {
            init.push('全部');
        } else if (ctype == 1) {
            init.push('视频');
        } else if (ctype == 2) {
            init.push('图文');
        }else if(ctype == 3){
            init.push('音频');
        }

        Picker.init({
            pickerData: ctypes,
            selectedValue: init,
            pickerTitleText: '选择',
            pickerCancelBtnText: '取消',
            pickerConfirmBtnText: '确认',
            onPickerConfirm: data => {
                let _ctype = 0;
                if(data == '全部'){
                    _ctype = 0;
                }else if (data == '视频') {
                    _ctype = 1;
                } else if (data == '音频') {
                    _ctype = 3;
                } else if (data == '图文') {
                    _ctype = 2;
                }

                this.setState({
                    ctype: _ctype,
                }, () => {
                    this._onHeaderRefresh();
                })
            },
        });

        Picker.show();
    }

    _renderItem(item) {
        const {navigation} = this.props;
        const {ctype} = this.state;
        const course = item.item;
        if (course.ctype == 3) {
            return (
                <ArticleCell course={course} ttype={course.ttype} onPress={() => {
                    navigation.navigate('Article', {course: course});
                }}/>
            )
        }

        return (
            <VodCell course={course} onPress={() => {
                navigation.navigate(course.ctype == 0 ? 'Vod' : 'Audio', {course: course});
            }}/>
        )
    }

    render() {
        const {navigation} = this.props;
        const {cindex, ccindex, cccindex, sort, ctype} = this.state;

        let citems = ['全部'];
        let ccitems = [];
        let cccitems = [];

        this.category.map((category, index) => {
            citems.push(category.categoryName);
        });

        if (cindex > 0) {
            ccitems = ['全部'];
            const category = this.category[cindex - 1];

            category.child.map((ccategory, index) => {
                ccitems.push(ccategory.categoryName);
            });

            if (ccindex > 0) {
                cccitems = ['全部'];
                const ccategory = category.child[ccindex - 1];

                ccategory.child.map((cccategory, index) => {
                    cccitems.push(cccategory.categoryName);
                });
            }
        }
        
        return (
            <TouchableWithoutFeedback onPress={() => Picker.hide()}>
                <View style={styles.container}>
                    <TabView items={citems} current={cindex} onSelected={(index) => {
                        this.setState({
                            cindex: index,
                            ccindex: 0,
                            cccindex: 0,
                        }, () => {
                            this._onHeaderRefresh();
                        })
                    }}/>
                    <TabView items={ccitems} theme={'quick'} current={ccindex} onSelected={(index) => {
                        this.setState({
                            ccindex: index,
                            cccindex: 0,
                        }, () => {
                            this._onHeaderRefresh();
                        })
                    }}/>

                    {ccindex > 0 ? 
                    <TabView items={cccitems} theme={'quick'} current={cccindex} onSelected={(index) => {
                        this.setState({
                            cccindex: index
                        }, () => {
                            this._onHeaderRefresh();
                        })
                    }}/>
                    : null}
                    <View style={[styles.row, styles.jc_sb, styles.ai_ct, styles.p_15, styles.pl_20, styles.pr_20, styles.filter]}>
                        <TouchableOpacity style={[styles.p_10, styles.circle_10, styles.search]} onPress={() => navigation.navigate('Search')}>
                            <Text style={[styles.label_lgray]}><Text style={[styles.icon]}>{iconMap('search')}</Text> 输入资源关键词等</Text>
                        </TouchableOpacity>
                        <Text style={[styles.label_gray, styles.label_12]}>共 {this.total} 门资源</Text>
                        
                        <View style={[styles.row]}>
                            <TouchableOpacity onPress={() => this._onSort()}>
                                <Text style={styles.label_12}>{sort == 0 ? '默认' :sort == 1?'最新':'最热'}<Text style={[styles.icon]}>{iconMap('xiasanjiao1')}</Text></Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.ml_20} onPress={() => this._onCtype()}>
                                <Text style={styles.label_12}>{ctypes[ctype]}<Text style={[styles.icon]}>{iconMap('xiasanjiao1')}</Text></Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <RefreshListView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={[styles.p_20]}
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
            </TouchableWithoutFeedback>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    filter: {
        borderBottomWidth: 1,
        borderBottomColor: '#F6F6F6',
    }
});

export const LayoutComponent = CourseCategory;

export function mapStateToProps(state) {
    return {
        category: state.config.category_course,
        index: state.course.index,
    };
}