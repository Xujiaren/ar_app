//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, View, ScrollView, Image, TouchableOpacity, Text, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';
import ImagePicker from 'react-native-image-picker';

import HudView from '../../../component/base/HudView';
import asset from '../../../config/asset';
import iconMap from '../../../config/font';
import theme from '../../../config/theme';

const mstatus = ['等待审核', '拒绝申请', '申请通过'];
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
class ApplyTeacher extends Component {

    static navigationOptions = {
        title:'申请讲师',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            applyed: false,
            
            pic_0: '',
            pic_1: '',

            isAgree: true,
            status: 0,
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.onApply = this.onApply.bind(this);
    }

    componentDidMount() {
        this.onRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {apply_info} = nextProps;

        if (apply_info !== this.props.apply_info) {
            let applyed = false;
            let pic_0 = '';
            let pic_1 = '';
            let status = 0;

            if (apply_info.applyId) {
                applyed = true;
                pic_0 = apply_info.galleryList[0].fpath;
                pic_1 = apply_info.galleryList[1].fpath;
                status = apply_info.status;
            }
            this.setState({
                loaded: true,
                applyed: applyed,
                pic_0: pic_0,
                pic_1: pic_1,
                status: status,
            })
        }
    }

    onRefresh() {
        const {actions} = this.props;
        actions.teacher.applyInfo();
    }

    onUpload(index) {
        const {actions} = this.props;

        ImagePicker.showImagePicker(options, (response) => {
            if (response.uri) {
                actions.site.upload({
                    field:'avatar',
                    file:'data:image/jpeg;base64,' + response.data,
                    resolved: (data) => {

                        if (index == 0) {
                            this.setState({
                                pic_0: data,
                            })
                        } else {
                            this.setState({
                                pic_1: data,
                            })
                        }

                    },
                    rejected: (msg) => {

                    },
                });
            }
        });
    }

    onApply() {
        const {actions} = this.props;
        const {pic_0, pic_1, isAgree} = this.state;

        if (!isAgree) {
            this.refs.hud.show('请先阅读并同意条款。', 1);
            return;
        }

        if (pic_0.length == 0 || pic_1 == 0) {
            this.refs.hud.show('请先上传认证图片。', 1);
            return;
        }

        actions.teacher.apply({
            gallerys: pic_0 + ',' + pic_1,
            resolved: (data) => {
                this.setState({
                    applyed: true,
                })

                this.refs.hud.show('申请成功', 1);
            },
            rejected: (msg) => {

            }
        })

    }

    render() {
        const {navigation} = this.props;
        const {loaded, applyed, status, pic_0, pic_1, isAgree, rule} = this.state;
        
        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#00A6F6"/>
            </View>
        )

        const enable = !applyed;

        return (
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={[styles.p_20]}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={[styles.label_16]}>认证图片上传</Text>
                    <View style={[styles.row, styles.mt_15]}>
                        <TouchableOpacity onPress={() => this.onUpload(0)} disabled={applyed}>
                            <Image source={pic_0 != '' ? {uri: pic_0} : asset.base.upload} style={[styles.thumb]}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.ml_20]} onPress={() => this.onUpload(1)}  disabled={applyed}>
                            <Image source={pic_1 != '' ? {uri: pic_1} : asset.base.upload} style={[styles.thumb]}/>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={[styles.mt_40, styles.row, styles.ai_ct]} onPress={() => this.setState({
                        isAgree: !isAgree,
                    })}>
                        <Text style={[styles.label_gray]}><Text style={[styles.icon, styles.label_gray, isAgree && styles.label_blue]}>{iconMap('gouxuan')}</Text> 阅读并同意</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('TeacherRule')}><Text>《经销商认证讲师责任认定协议》</Text></TouchableOpacity>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.bg_blue, styles.circle_5, styles.p_15, styles.mt_40, styles.ai_ct, !enable && styles.disabledContainer]} disabled={!enable} onPress={this.onApply}>
                        <Text style={[styles.label_white]}>{applyed ? mstatus[status] : '提交'}</Text>
                    </TouchableOpacity>
                </ScrollView>

                <HudView ref={'hud'} />
            </View>
            </TouchableWithoutFeedback>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    thumb: {
        width: 120,
        height: 120,
    }
});

export const LayoutComponent = ApplyTeacher;

export function mapStateToProps(state) {
    return {
        apply_info: state.teacher.apply_info,
    };
}