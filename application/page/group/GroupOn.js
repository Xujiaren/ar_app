//import liraries
import React, { Component } from 'react';
import { View, ScrollView,  TouchableOpacity, Image, Text, TextInput, TouchableWithoutFeedback, Keyboard, Modal, StyleSheet } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import ImageViewer from 'react-native-image-zoom-viewer';

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
class GroupOn extends Component {

    static navigationOptions = {
        title:'打卡',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        const {navigation} = props;
        this.group = navigation.getParam('group', {});

        this.state = {
            content: '',
            gallery: [],

            isMust: this.group.isMust == 1,

            preview: false,
            preview_index: 0,
            preview_imgs: [],
        }

        this.onSign = this.onSign.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.onPreview = this.onPreview.bind(this);
    }

    componentDidMount() {
        const {actions} = this.props;
        actions.config.config();
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

    onSign() {
        const {actions, navigation, config} = this.props;
        const {isMust, content, gallery} = this.state;

        if (isMust && content.length == 0) {
            this.refs.hud && this.refs.hud.show('请填写打卡内容。', 1);
            return;
        }

        let canPub = true;
        if (config.ban_words.length > 0) {
            const words = config.ban_words.split(',');

            for (let i = 0; i < words.length; i++) {
                if (content.indexOf(words[i]) >= 0) {
                    canPub = false;
                    break;
                }
            }
        }

        if (canPub) {
            actions.group.sign({
                activity_id: this.group.activityId,
                content: content,
                gallery: gallery.join(","),
                resolved: (data) => {
                    this.refs.hud.show('提交成功!', 1, () => {
                        this.setState({
                            content: '',
                            gallery: [],
                        }, () => navigation.goBack());
                    });
                    
                },
                rejected: (msg) => {
                    this.refs.hud.show(msg, 1);
                },
            })
        } else {
            this.refs.hud && this.refs.hud.show('请注意您的言论！', 1);
        }
    }

    render() {
        const {content, gallery, preview, preview_imgs, preview_index} = this.state;

        return (
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                <View style={styles.container}>
                    <ScrollView
                        contentContainerStyle={[styles.p_20]}
                        showsVerticalScrollIndicator={false}
                    >
                        <TextInput
                            style={[styles.input, styles.bg_lgray, styles.circle_5, styles.p_15]}
                            placeholder={'说点啥吧。'}
                            multiline={true}
                            value={content}
                            onChangeText={(text) => {this.setState({content:text});}}
                        />
                        <Text style={[styles.mt_15]}>活动图片</Text>
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
                    </ScrollView>
                    <TouchableOpacity style={[styles.bg_blue, styles.circle_5, styles.p_15, styles.m_20, styles.ai_ct]} onPress={this.onSign}>
                        <Text style={[styles.label_white]}>打卡</Text>
                    </TouchableOpacity>

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
    input: {
        height: 200,
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

export const LayoutComponent = GroupOn;

export function mapStateToProps(state) {
    return {
        config: state.config.config,
    };
}