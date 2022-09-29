//import liraries
import React, { Component } from 'react';
import { View, ScrollView, Image, Text, TextInput, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Keyboard, Modal } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import ImageViewer from 'react-native-image-zoom-viewer';

import HudView from '../../../component/base/HudView';
import asset from '../../../config/asset';
import iconMap from '../../../config/font';
import theme from '../../../config/theme';

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

const voptions = {
    title: '选择视频',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '从相册选择',
    cameraType: 'back', // 'front' or 'back'
    mediaType: 'video', // 'photo' or 'video'
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
class ActivityJoin extends Component {

    static navigationOptions = {
        title:'活动报名',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        const {navigation} = props;
        this.activity = navigation.getParam('activity', {});

        this.state = {
            is_video: this.activity.ctype == 16,
            user_name: '',
            mobile: '',
            work_name: '',
            work_intro: '',
            gallery: [],

            preview: false,
            preview_index: 0,
            preview_imgs: [],
        }

        this.onUpload = this.onUpload.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.onPreview = this.onPreview.bind(this);
        this.onJoin = this.onJoin.bind(this);
    }

    onUpload() {
        const {actions} = this.props;
        const {is_video} = this.state;

        let gallery = this.state.gallery;

        ImagePicker.showImagePicker(is_video ? voptions : options, (response) => {
            
            if (response.uri) {

                this.refs.hud.show('上传中，请稍后');

                actions.config.oss({
                    resolved: (oss) => {
                        const filename = new Date().getTime() + '.' + is_video ? 'mp4' : 'png';
                        const key = oss.dir + filename;
        
                        const uploadMediaData = new FormData();
                        uploadMediaData.append('OSSAccessKeyId', oss.accessid);
                        uploadMediaData.append('policy', oss.policy);
                        uploadMediaData.append('Signature', oss.signature);
                        uploadMediaData.append('key', key);
                        uploadMediaData.append('success_action_status', 201);
                        uploadMediaData.append('file', {
                            uri:  response.uri,
                            type: 'multipart/form-data',
                            name: filename,
                        });
        
                        //console.info(uploadMediaData);
        
                        fetch(oss.host, {
                            method: 'POST',
                            body: uploadMediaData,
                        }).then(res => {
                            this.refs.hud.hide();
                            if (is_video) {
                                gallery = [oss.host + "/" + key];
                            } else {
                                gallery.push(oss.host + "/" + key);
                            }
                            
                            this.setState({
                                gallery: gallery,
                            })
                        }).catch(err => {
                            this.refs.hud.hide();
                            this.refs.hud.show('上传失败');
                        })
                    },
                    rejected: (msg) => {
                        this.refs.hud.hide();
                        this.refs.hud.show('上传失败');
                    }
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

    onJoin() {
        const {navigation, actions} = this.props;
        const {user_name, mobile, work_name, work_intro, gallery} = this.state;

        if (user_name.length == 0) {
            this.refs.hud.show('请填写姓名', 1);
            return;
        }

        if (mobile.length != 11) {
            this.refs.hud.show('请填写11位手机号', 1);
            return;
        }

        if (work_name.length == 0) {
            this.refs.hud.show('请填写作品名称', 1);
            return;
        }

        if (work_intro.length == 0) {
            this.refs.hud.show('请填写作品描述', 1);
            return;
        }

        if (gallery.length == 0) {
            this.refs.hud.show('请上传作品', 1);
            return;
        }

        this.refs.hud.show('...');

        actions.activity.join({
            activity_id: this.activity.activityId,
            user_name: user_name,
            mobile: mobile,
            work_name: work_name,
            work_intro: work_intro,
            work_url: gallery.join(','),
            resolved: (data) => {
                this.refs.hud.show('提交成功!请等待审核！', 1, () => {
                    navigation.goBack();
                });
                
            },
            rejected: (msg) => {
                this.refs.hud.show(msg, 1);
            },
        })
    }

    render() {
        const {is_video, user_name, mobile, work_name, work_intro, gallery, preview, preview_imgs, preview_index} = this.state;
        const enable = true;

        return (
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                <View style={styles.container}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.p_20]}>
                        <View style={[styles.pt_15, styles.pb_15, styles.row, styles.ai_ct, styles.jc_sb, styles.b_line]}>
                            <Text style={[styles.label_16, styles.f1]}>姓名</Text>
                            <TextInput 
                                style={[styles.f3, styles.p_10]}
                                placeholder={'请填写姓名'}
                                textAlign={'right'}
                                value={user_name}
                                onChangeText={(text) => {this.setState({user_name:text});}}
                            />
                        </View>
                        <View style={[styles.pt_15, styles.pb_15, styles.row, styles.ai_ct, styles.jc_sb, styles.b_line]}>
                            <Text style={[styles.label_16, styles.f1]}>联系方式</Text>
                            <TextInput 
                                style={[styles.f3, styles.p_10]}
                                placeholder={'请填写11位手机号'}
                                keyboardType={'phone-pad'}
                                textAlign={'right'}
                                value={mobile}
                                onChangeText={(text) => {this.setState({mobile:text});}}
                            />
                        </View>
                        <View style={[styles.pt_15, styles.pb_15, styles.row, styles.ai_ct, styles.jc_sb, styles.b_line]}>
                            <Text style={[styles.label_16, styles.f1]}>作品名称</Text>
                            <TextInput 
                                style={[styles.f3, styles.p_10]}
                                placeholder={'请填写作品名称'}
                                textAlign={'right'}
                                value={work_name}
                                onChangeText={(text) => {this.setState({work_name:text});}}
                            />
                        </View>
                        <View style={[styles.pt_15, styles.pb_15, styles.row, styles.ai_ct, styles.jc_sb, styles.b_line]}>
                            <Text style={[styles.label_16, styles.f1]}>作品描述</Text>
                            <TextInput 
                                style={[styles.f3, styles.p_10]}
                                placeholder={'请填写作品描述'}
                                textAlign={'right'}
                                value={work_intro}
                                onChangeText={(text) => {this.setState({work_intro:text});}}
                            />
                        </View>
                        <View style={[styles.pt_15, styles.pb_15, styles.row, styles.ai_ct, styles.jc_sb]}>
                            <Text style={[styles.label_16, styles.f1]}>上传作品</Text>
                        </View>
                        <View style={[styles.row, styles.wrap]}>
                            {gallery.map((img, index) => {
                                console.info(img);

                                return (
                                    <TouchableOpacity style={[styles.pt_15, styles.pr_15]} onPress={this.onUpload} key={'img_' + index} onPress={() => this.onPreview(gallery, index)}>
                                        <Image source={{uri: img + (is_video ? "?x-oss-process=video/snapshot,t_10000,m_fast" : "")}} style={[styles.pic]}/>
                                        <TouchableOpacity style={[styles.close]} onPress={()=> this.onRemove(index)}>
                                            <Text style={[styles.icon, styles.label_red]}>{iconMap('guanbi1')}</Text>
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                )
                            })}
                            <TouchableOpacity style={[styles.mt_15, styles.mr_15]} onPress={this.onUpload}>
                                <Image source={is_video ? asset.base.uploadv : asset.base.upload} style={[styles.pic]}/>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={[styles.bg_blue, styles.circle_5, styles.p_15, styles.mt_40, styles.ai_ct, !enable && styles.disabledContainer]} disabled={!enable} onPress={this.onJoin}>
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

                    <HudView ref={'hud'}/>
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

export const LayoutComponent = ActivityJoin;

export function mapStateToProps(state) {
    return {
        
    };
}