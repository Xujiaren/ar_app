//import liraries
import React, { Component } from 'react';
import { View, ScrollView,  TouchableOpacity, Image, Text, TextInput, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';
import ImagePicker from 'react-native-image-picker';

import Picker from 'react-native-picker';
import DatePicker from 'react-native-datepicker';

import HudView from '../../component/base/HudView';
import asset from '../../config/asset';
import iconMap from '../../config/font';
import theme from '../../config/theme';

const members = ['邀请用户', '全部用户'];

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
class PublishGroup extends Component {

    static navigationOptions = {
        title:'发布打卡',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        const date = new Date();

        this.state = {
            title: '',
            content: '',
            endTime: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
            isPublic: 1,
            activityImg: '',
            isMust: 2,
        }

        this.onMember = this.onMember.bind(this);
        this.onMust = this.onMust.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.onPublish = this.onPublish.bind(this);
    }

    onMember() {
        const {isPublic} = this.state;

        Picker.init({
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			pickerTitleText: '选择对象',
            pickerData: members,
            selectedValue: [members[isPublic]],
            onPickerConfirm: pickedValue => {

                this.setState({
                    isPublic: pickedValue[0] == '全部用户' ? 1 : 0,
                })
            },
        });

        Picker.show();
    }

    onMust() {
        const {isMust} = this.state;

        Picker.init({
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			pickerTitleText: '选择对象',
            pickerData: ['是', '否'],
            selectedValue: [isMust == 1 ? '是' : '否'],
            onPickerConfirm: pickedValue => {

                this.setState({
                    isMust: pickedValue[0] == '是' ? 1 : 2,
                })
            },
        });

        Picker.show();
    }

    onUpload() {
        const {actions} = this.props;

        ImagePicker.showImagePicker(options, (response) => {
            if (response.uri) {
                actions.site.upload({
                    file:'data:image/jpeg;base64,' + response.data,
                    resolved: (data) => {

                        this.setState({
                            activityImg: data,
                        })

                    },
                    rejected: (msg) => {

                    },
                });
            }
        });
    }

    onPublish() {
        const {navigation, actions} = this.props;
        const {title, content, endTime, isPublic, activityImg, isMust} = this.state;

        if (title.length == 0) {
            this.refs.hud.show('请输入活动主题。', 1);
            return;
        }

        if (content.length == 0) {
            this.refs.hud.show('请输入活动描述。', 1);
            return;
        }

        if (activityImg.length == 0) {
            this.refs.hud.show('请上传活动封面。', 1);
            return;
        }

        if (endTime.length == 0) {
            this.refs.hud.show('请设置活动截止视觉。', 1);
            return;
        }

        actions.group.publish({
            title: title,
            content: content,
            endTime: endTime,
            isPublic: isPublic,
            activityImg: activityImg,
            isMust: isMust,
            resolved: (data) => {
                this.refs.hud.show('活动发布成功', 1, () => {
                    navigation.goBack();
                });
            },
            rejected: (msg) => {
                this.refs.hud.show('活动发布失败', 1);
            },
        })
    }

    render() {
        const {title, content, endTime, isPublic, isMust, activityImg} = this.state;
        const thumb = activityImg.length > 0 ? {uri: activityImg} : asset.base.upload;
        const enable = true;

        return (
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                <View style={styles.container}>
                    <ScrollView
                        contentContainerStyle={[styles.p_20]}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={[styles.p_15, styles.row, styles.ai_ct, styles.jc_sb, styles.b_line]}>
                            <Text style={[styles.label_16, styles.f1]}>活动主题</Text>
                            <TextInput 
                                style={[styles.f3, styles.p_10]}
                                placeholder={'请输入主题'}
                                textAlign={'right'}
                                value={title}
                                onChangeText={(text) => {this.setState({title:text});}}
                            />
                        </View>
                        <View style={[styles.p_15, styles.row, styles.jc_sb, styles.ai_ct, styles.b_line]}>
                            <Text style={[styles.label_16, styles.f1]}>活动截止</Text>
                            <View style={[styles.f3, styles.row, styles.ai_ct, styles.jc_fe]}>
                                    <DatePicker
                                    style={{width: 120,borderWidth:0,height:20,color:'#999999'}}
                                    mode="date"
                                    date={endTime}
                                    format="YYYY-MM-DD"
                                    confirmBtnText="确定"
                                    cancelBtnText="取消"
                                    showIcon={false}
                                    locale="zh"
                                    customStyles={{
                                        dateInput: {
                                            position:'absolute',
                                            top:0,
                                            right:0,
                                            borderWidth: 0,
                                            borderStyle: 'solid',
                                            width:120,
                                            height:20,
                                            flexDirection:'row',
                                            justifyContent:'flex-end',
                                            color:'#999999',
                                            opacity:0.6
                                        },
                                    }}
                                    onDateChange={(dt) => {
                                        this.setState({
                                            endTime: dt,
                                        })
                                    }}
                                />
                                <Text style={[styles.icon, styles.label_gray]}>{iconMap('right')}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={[styles.p_15, styles.row, styles.jc_sb, styles.ai_ct, styles.b_line]} onPress={this.onMember}>
                            <Text style={[styles.label_16, styles.f1]}>活动对象</Text>
                            <View style={[styles.row, styles.ai_ct, styles.jc_fe]}>
                                <Text>{members[isPublic]}</Text>
                                <Text style={[styles.icon, styles.label_gray]}>{iconMap('right')}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.p_15, styles.row, styles.jc_sb, styles.ai_ct, styles.b_line]} onPress={this.onMust}>
                            <Text style={[styles.label_16, styles.f1]}>活动数据</Text>
                            <View style={[styles.row, styles.ai_ct, styles.jc_fe]}>
                                <Text>{isMust == 1 ? '是' : '否'}</Text>
                                <Text style={[styles.icon, styles.label_gray]}>{iconMap('right')}</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={[styles.p_15, styles.b_line]}>
                            <Text>描述</Text>
                            <TextInput
                            style={[styles.input, styles.p_15, styles.mt_15]}
                            placeholder={'补充问题背景，条件等详细信息。'}
                            multiline={true}
                            value={content}
                            onChangeText={(text) => {this.setState({content:text});}}
                        />
                        </View>
                        
                        <View style={[styles.p_15]}>
                            <Text style={[styles.label_16]}>活动封面</Text>
                        </View>
                        <View style={[styles.pl_15, styles.pr_15, styles.row, styles.wrap]}>
                            <TouchableOpacity style={[styles.mt_15, styles.mr_15]} onPress={this.onUpload}>
                                <Image source={thumb} style={[styles.pic]}/>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    <TouchableOpacity style={[styles.bg_blue, styles.circle_5, styles.p_15, styles.m_20, styles.ai_ct, !enable && styles.disabledContainer]} disabled={!enable} onPress={this.onPublish}>
                        <Text style={[styles.label_white]}>发布</Text>
                    </TouchableOpacity>
                    <HudView ref={'hud'} />
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    pic: {
        width: 54,
        height: 54,
    },
    input: {
        height: 150,
    },
});

export const LayoutComponent = PublishGroup;

export function mapStateToProps(state) {
    return {
        
    };
}