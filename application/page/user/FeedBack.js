//import liraries
import React, { Component } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, TextInput, Modal, StyleSheet } from 'react-native';
import Picker from 'react-native-picker';
import ImagePicker from 'react-native-image-picker';
import ImageViewer from 'react-native-image-zoom-viewer';

import RefreshListView, {RefreshState} from '../../component/base/RefreshListView';
import TabView from '../../component/base/TabView';
import MenuCell from '../../component/base/MenuCell';
import HudView from '../../component/base/HudView';

import asset from '../../config/asset';
import iconMap from '../../config/font';
import theme from '../../config/theme';

const options = {
    title: '选择照片',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '从相册选择',
    cameraType: 'back', // 'front' or 'back'
    mediaType: 'photo', // 'photo' or 'video'
    // maxWidth: 1280, // photos only
    // maxHeight: 1280, // photos only
    aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
    aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
    quality: 0.1, // 0 to 1, photos only
    angle: 0, // android only, photos only
    allowsEditing: false, // Built in functionality to resize/reposition the image after selection  原图 不裁剪
    noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
};

// create a component
class FeedBack extends Component {

    static navigationOptions = {
        title:'帮助反馈',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        this.page = 0;
        this.pages = 1;
        this.total = 0;
        this.items = [];

        this.cmap = {};
        this.category = [];

        this.state = {
            type: 0,
            refreshState: RefreshState.Idle,

            categoryId: 0,
            categoryName: '选择问题类型',
            content: '',
            mobile: '',

            enable: true,
            
            gallery: [],
            video: [],

            preview: false,
            preview_index: 0,
            preview_imgs: [],
        }

        this.onCategory = this.onCategory.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.onPreview = this.onPreview.bind(this);
        this.onPublish = this.onPublish.bind(this);

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    componentDidMount() {
        const {actions} = this.props;
        actions.config.categoryFeedback();
        actions.user.user();
    }

    componentWillReceiveProps(nextProps) {
        const {user, category_feedback, feedback} = nextProps;

        if (user !== this.props.user) {
            this.setState({
                mobile: user.mobile,
            })
        }

        if (category_feedback !== this.props.category_feedback) {
            this.category = category_feedback;
            this.category.map((category, index) => {
                this.cmap[category.categoryId] = category.categoryName;
            })
        }

        if (feedback !== this.props.feedback) {
            this.pages = feedback.pages;
            this.total = feedback.total;
            this.items = this.items.concat(feedback.items);
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    onCategory() {
        const {categoryName} = this.state;
        
        let items = ['选择问题类型'];

        this.category.map((category, index) => {
            items.push(category.categoryName);
        })
        
        Picker.init({
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			pickerTitleText: '选择问题类型',
            pickerData: items,
            selectedValue: [categoryName],
            onPickerConfirm: pickedValue => {
                let categoryId = 0;
                this.category.map((item, index) => {
                    if (item.categoryName == pickedValue) {
                        categoryId = item.categoryId;
                    }
                })
                this.setState({
                    categoryId: categoryId,
                    categoryName: pickedValue,
                })
            },
        });

        Picker.show();
    }

    onUpload() {
        const {actions} = this.props;
        const {gallery} = this.state;

        ImagePicker.showImagePicker(options, (response) => {
            if (response.uri) {
                actions.site.upload({
                    file:'data:image/jpeg;base64,' + response.data,
                    resolved: (data) => {

                        gallery.unshift(data);

                        this.setState({
                            gallery: gallery,
                        })

                    },
                    rejected: (msg) => {

                    },
                });
            }
        });

    }

    onRemove(index) {
        const {gallery} = this.state;
        gallery.splice(index, 1);

        this.setState({
            gallery: gallery,
        })
    }

    onPreview(galleryList, index) {
        let images = [];
        galleryList.map((gallery, i) => {
            images.push({
				url: gallery,
			});
        });

        this.setState({
            preview: true,
            preview_index: index,
            preview_imgs: images,
        });
    }

    onPublish() {
        const {actions} = this.props;
        const {categoryId, content, mobile, gallery, video} = this.state;

        this.refs.hud.show('...');

        if (categoryId == 0) {
            this.refs.hud.show('提交失败，请选择问题类型。', 1);
            return;
        }

        if (content.length == 0) {
            this.refs.hud.show('提交失败，请输入问题描述。', 1);
            return;
        }

        if (mobile.length != 11) {
            this.refs.hud.show('提交失败，请输入联系方式。', 1);
            return;
        }

        this.setState({
            enable: false,
        }, () => {
            actions.user.publishFeedback({
                category_id: categoryId,
                mobile: mobile,
                content: content,
                gallery: gallery.join(","),
                video: video.join(","),
                resolved: (data) => {
                    this.refs.hud.show('提交成功!', 1, () => {
                        this.setState({
                            enable: true,
                            type: 1,
                            content: '',
                            gallery: [],
                            video: [],
                        }, () => this._onHeaderRefresh())
                    });
                    
                },
                rejected: (msg) => {
                    this.refs.hud.show(msg, 1, () => {
                        this.setState({
                            enable: true,
                        })
                    });
                },
            })
        })

        
    }

    _onHeaderRefresh() {
        const {actions} = this.props;
        this.page = 0;
        this.pages = 1;
        this.total = 0;
        this.items = [];

        actions.user.feedback(0);

        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
        const {actions} = this.props;

        if (this.page < (this.pages - 1)) {
            this.page++;
			this.setState({refreshState: RefreshState.FooterRefreshing});
			actions.user.feedback(this.page);
		}
		else
		{
			this.setState({refreshState: RefreshState.NoMoreData});
		}
    }

    _renderItem(item) {
        const feedback = item.item;
        let gallery = [];

        feedback.galleryList.map((img, index) => {
            gallery.push(img.fpath);
        })

        return (
            <View style={[styles.mt_10, styles.bg_white, styles.p_20]}>
                <Text style={[styles.label_gray]}>问题类型：<Text style={[styles.label_default]}>{this.cmap[feedback.categoryId]}</Text></Text>
                <Text style={[styles.label_gray, styles.mt_5]}>问题描述：<Text style={[styles.label_default]}>{feedback.content}</Text></Text>
                {gallery.length > 0?
                <View style={[styles.mt_20, styles.row, styles.wrap]}>
                    {gallery.map((img, index) => {
                        return (
                            <TouchableOpacity style={[styles.mr_10]} key={'img_' + feedback.feedbackId + '_' + index} onPress={() => this.onPreview(gallery, index)}>
                                <Image source={{uri: img}} style={[styles.thumb, styles.bg_l1gray]}/>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                : null}
                <Text style={[styles.label_gray, styles.mt_15]}>{feedback.pubTimeFt}</Text>

                {feedback.replyTime > 0 ?
                <Text style={[styles.label_gray, styles.mt_10]}>管理员回复：<Text style={[styles.label_default]}>{feedback.reply} <Text style={[styles.label_gray]}>({feedback.replyTimeFt})</Text></Text></Text>
                :null}
            </View>
        )
    }

    render() {
        const {type, categoryId, categoryName, content, mobile, gallery, preview, preview_imgs, preview_index, enable} = this.state;

        return (
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                <View style={styles.container}>
                    <TabView items={['填写问题', '我的反馈']} center={true} current={type} onSelected={(index) => {
                        this.setState({
                            type: index
                        }, () => {
                            if (index == 1) {
                                this._onHeaderRefresh();
                            }
                        })
                    }}/>

                    {type == 0?
                    <ScrollView>
                        <MenuCell label={'问题类型'} style={[styles.mt_10]} onPress={this.onCategory} tip={categoryId == 0} val={categoryName}/>
                        <View style={[styles.p_20, styles.pl_30, styles.bg_white, styles.mt_10]}>
                            <Text>描述</Text>
                            <TextInput
                                style={[styles.input, styles.p_15, styles.mt_5]}
                                placeholder={'补充问题背景，条件等详细信息。'}
                                multiline={true}
                                value={content}
                                onChangeText={(text) => {this.setState({content:text});}}
                            />
                            <View style={[styles.row, styles.wrap, styles.mt_10]}>
                                {gallery.map((img, index) => {
                                    return (
                                        <TouchableOpacity style={[styles.pt_15, styles.pr_15]} onPress={this.onUpload} key={'img_' + index} onPress={() => this.onPreview(gallery, index)}>
                                            <Image source={{uri: img}} style={[styles.pic]}/>
                                            <TouchableOpacity style={[styles.close]} onPress={()=> this.onRemove(index)}>
                                                <Text style={[styles.icon, styles.label_red]}>{iconMap('guanbi1')}</Text>
                                            </TouchableOpacity>
                                        </TouchableOpacity>
                                    )
                                })}
                                <TouchableOpacity style={[styles.mt_15, styles.mr_15]} onPress={this.onUpload}>
                                    <Image source={asset.base.upload} style={[styles.pic]}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.p_20, styles.pl_30, styles.bg_white, styles.mt_10, styles.row, styles.ai_ct, styles.jc_sb]}>
                            <Text>联系方式</Text>
                            <TextInput
                                style={[styles.minput]}
                                keyboardType={'phone-pad'}
                                placeholder={'请输入手机号'}
                                value={mobile}
                                maxLength={11}
                                textAlign={'right'}
                                onChangeText={(text) => {this.setState({mobile:text});}}
                            />
                        </View>

                        <TouchableOpacity style={[styles.bg_blue, styles.circle_5, styles.p_15, styles.ml_20, styles.mr_20, styles.mt_40, styles.ai_ct, !enable && styles.disabledContainer]} disabled={!enable} onPress={this.onPublish}>
                            <Text style={[styles.label_white]}>提交</Text>
                        </TouchableOpacity>
                    </ScrollView>
                    : <RefreshListView
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
                    />}

                    <Modal visible={preview} transparent={true} onRequestClose={() => {
                        this.setState({
                            preview: false,
                        });
                    }}>
                        <ImageViewer imageUrls={preview_imgs} index={preview_index} onClick={() => {
                            this.setState({
                                preview: false,
                            });
                        }}/>
                    </Modal>

                    <HudView ref={'hud'} />
                </View>
            </TouchableWithoutFeedback>
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
    thumb: {
        width: 90,
        height: 90,
    },
    input: {
        height: 150,
    },
    minput: {
        width: theme.window.width * 0.4,
    },
    pic: {
        width: 54,
        height: 54,
    },
    close: {
        position: 'absolute',
        top: 10,
        right: 10,
    }
});

export const LayoutComponent = FeedBack;

export function mapStateToProps(state) {
    return {
        category_feedback: state.config.category_feedback,
        user: state.user.user,
        feedback: state.user.feedback,
    };
}