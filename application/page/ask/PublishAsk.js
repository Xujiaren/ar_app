//import liraries
import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Image, Text, TouchableWithoutFeedback, Keyboard, Modal, StyleSheet } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Picker from 'react-native-picker';
import ImageViewer from 'react-native-image-zoom-viewer';

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
class PublicAsk extends Component {

    static navigationOptions = {
        title:'我要提问',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        this.category = [];

        this.state = {
            categoryId: 0,
            categoryName: '选择问题类型',
            title: '',
            content: '',
            gallery: [],

            preview: false,
            preview_index: 0,
            preview_imgs: [],
        }

        this.onCategory = this.onCategory.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.onPreview = this.onPreview.bind(this);
        this.onPublish = this.onPublish.bind(this);
    }

    componentDidMount() {
        const {actions} = this.props;
        actions.config.categoryAsk();
    }

    componentWillReceiveProps(nextProps) {
        const {category} = nextProps;

        if (category !== this.props.category) {
            this.category = category;
        }
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
        const {navigation, actions} = this.props;
        const {categoryId, title, content, gallery} = this.state;

        //categoryId > 0 && title.length >= 5 && content.length >= 5;

        if (categoryId == 0) {
            this.refs.hud.show('请选择问题类型。', 1);
            return;
        }

        if (title.length < 5) {
            this.refs.hud.show('请输入5个字以上的问题标题。', 1);
            return;
        }

        actions.ask.publish({
            category_id: categoryId,
            title: title,
            content: content,
            pics: gallery.join(','),
            videos: '',
            resolved: (data) => {
                this.refs.hud.show('提交成功!将由工作人员筛选审核后公开显示。', 1, () => {
                    this.setState({
                        title: '',
                        content: '',
                        gallery: [],
                    }, () => navigation.goBack());
                });
            },
            rejected: (msg) => {
                this.refs.hud.show('提交失败，请检查您的输入。', 1);
            },
        })
    }

    render() {
        const {categoryId, categoryName, title, content, gallery, preview, preview_imgs, preview_index} = this.state;
        const enable = true;

        return (
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                <View style={styles.container}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <MenuCell label={'问题类型'} style={[styles.mt_10]} onPress={this.onCategory} val={categoryName}/>
                        <View style={[styles.bg_white, styles.mt_10, styles.p_20]}>
                            <Text style={[styles.label_16]}>标题</Text>
                            <TextInput
                                style={[styles.input]}
                                placeholder={'一句话描述您的问题(5个字以上)，将由工作人员筛选审核后公开显示。'}
                                multiline={true}
                                value={title}
                                onChangeText={(text) => {this.setState({title:text});}}
                            />
                        </View>
                        <View style={[styles.bg_white, styles.mt_10, styles.p_20]}>
                            <Text style={[styles.label_16]}>描述</Text>
                            <TextInput
                                style={[styles.input]}
                                placeholder={'描述问题背景，条件等详细信息(5个字以上)'}
                                multiline={true}
                                value={content}
                                onChangeText={(text) => {this.setState({content:text});}}
                            />
                            <View style={[styles.row, styles.wrap]}>
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

                        <TouchableOpacity style={[styles.bg_blue, styles.circle_5, styles.p_15, styles.ml_20, styles.mr_20, styles.mt_40, styles.ai_ct, !enable && styles.disabledContainer]} disabled={!enable} onPress={this.onPublish}>
                            <Text style={[styles.label_white]}>提交</Text>
                        </TouchableOpacity>
                    </ScrollView>
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
    input: {
        height: 90,
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

export const LayoutComponent = PublicAsk;

export function mapStateToProps(state) {
    return {
        category: state.config.category_ask,
    };
}
