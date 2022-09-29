//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Picker from 'react-native-picker';
import DatePicker from 'react-native-datepicker';
import Prompt from 'react-native-prompt-crossplatform';

import MenuCell from '../../component/base/MenuCell';
import HudView from '../../component/base/HudView';

import iconMap from '../../config/font';
import theme from '../../config/theme';
import * as tool from '../../util/tool';

const sitems = ['保密', '男', '女'];

const options = {
    title: '选择头像',
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
class Account extends Component {

    static navigationOptions = {
        title:'个人信息',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        this.state = {
            nickname: '',
            nnShow: false,
        }

        this.onRefresh = this.onRefresh.bind(this);

        this.onAvatar = this.onAvatar.bind(this);
        this.onNickName = this.onNickName.bind(this);
        this.onSex = this.onSex.bind(this);
        this.onBirthday = this.onBirthday.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    componentDidMount() {
        this.onRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {user} = nextProps;

        if (user !== this.props.user) {
            this.setState({
                nickname: user.nickname,
            })
        }
    }

    onRefresh() {
        const {actions} = this.props;
        actions.user.user();
    }

    onNickName() {
        const {actions} = this.props;
        const {nickname} = this.state;

        if (nickname.length > 0) {
            this.setState({
                nnShow: false,
            }, () => {
                actions.user.account({
                    field:'nickname',
                    val:nickname,
                    resolved: (data) => {
                        this.onRefresh();
                        this.refs.hud.show('昵称修改成功', 1);
                    },
                    rejected: (msg) => {
                        this.onRefresh();
                        this.refs.hud.show('昵称修改失败', 1);
                    },
                });
            })
        } else {
            this.refs.hud.show('昵称不能为空', 1);
        }
        
    }

    onAvatar() {
        const {actions} = this.props;

        ImagePicker.showImagePicker(options, (response) => {
            if (response.uri) {
                actions.site.upload({
                    file:'data:image/jpeg;base64,' + response.data,
                    resolved: (data) => {

                        actions.user.account({
                            field:'avatar',
                            val:data,
                            resolved: (data) => {
                                this.onRefresh();
                                this.refs.hud.show('头像修改成功', 1);
                            },
                            rejected: (msg) => {
                                this.onRefresh();
                                this.refs.hud.show('头像修改失败', 1);
                            },
                        });

                    },
                    rejected: (msg) => {

                    },
                });
            }
        });

    }

    onSex() {
        const {actions} = this.props;
        const {user} = this.props;

        Picker.init({
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			pickerTitleText: '选择性别',
            pickerData: sitems,
            selectedValue: [sitems[user.sex]],
            onPickerConfirm: pickedValue => {
                for (let i = 0; i < sitems.length; i++){
                    if (pickedValue[0] === sitems[i]){
                        actions.user.account({
                            field:'sex',
                            val: i,
                            resolved: (data) => {
                                this.onRefresh();
                                this.refs.hud.show('性别修改成功', 1);
                            },
                            rejected: (msg) => {
                                this.refs.hud.show('性别修改失败', 1);
                            },
                        });
                    }
                }
            },
        });

        Picker.show();
    }

    onBirthday(dt) {
        const {actions} = this.props;
        actions.user.account({
            field:'birthday',
            val: dt,
            resolved: (data) => {
                this.onRefresh();
                this.refs.hud.show('生日修改成功', 1);
            },
            rejected: (msg) => {
                this.refs.hud.show('生日修改失败', 1);
            },
        });
    }

    onClose() {
        const {actions, navigation} = this.props;

        Alert.alert('警告', '操作后账号信息无法恢复及登录，请谨慎操作?', [
            {
                text: '取消',
                onPress: () => {
                    return true;
                },
                style: 'cancel',
            },
            {
                text: '确认',
                onPress: () =>  {
                    actions.passport.close({
                        resolved: (data) => {
                            actions.passport.logout({
                                resolved: (data) => {
                                    navigation.goBack();
                                },
                                rejected: (msg) => {
                    
                                }
                            });
                        },
                        rejected: (msg) => {
            
                        }
                    });
                },
            }
        ])
    }

    render() {
        const {user} = this.props;
        const {nnShow, nickname} = this.state;

        return (
            <View style={styles.container}>
                <MenuCell label={'头像'} img={user.avatar} style={[styles.mt_10, styles.mb_10]} onPress={this.onAvatar}/>
                <MenuCell label={'昵称'} val={user.nickname} onPress={()=> this.setState({nnShow: true})}/>
                <View style={[styles.row, styles.jc_sb, styles.ai_ct, styles.bg_white, styles.menu]}>
                    <Text>{'生日'}</Text>
                    <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
                            <DatePicker
                            style={{width: 120,borderWidth:0,height:20,color:'#999999'}}
                            date={user.birthday}
                            mode="date"
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
                            onDateChange={(dt) => { this.onBirthday(dt);}}
                        />
                        <Text style={[styles.icon, styles.label_gray]}>{iconMap('right')}</Text>
                    </View>
                </View>
                <MenuCell label={'性别'} val={sitems[user.sex]} onPress={this.onSex}/>
                <MenuCell label={'联系方式'} val={user.mobile}/>

                <TouchableOpacity style={[styles.bg_white, styles.p_15, styles.mt_10, styles.ai_ct]} onPress={this.onClose}>
                    <Text style={[styles.label_blue]}>永久注销账户</Text>
                </TouchableOpacity> 

                <Prompt
                    title="修改昵称"
                    placeholder="请输入昵称"
                    isVisible={nnShow}
                    defaultValue={nickname}
                    cancelButtonText="取消"
                    submitButtonText="修改"
                    primaryColor="#00A6F6"
                    promptBoxStyle={styles.promptBox}
                    btnTextStyle={{fontSize: 14}}
                    btnStyle={{minHeight: 30}}
                    onChangeText={(text) => {
                        this.setState({ nickname: text });
                    }}
                    onCancel={() => {
                        this.setState({
                            nickname: '',
                            nnShow: false,
                        });
                    }}
                    onSubmit={() => {this.onNickName()}}
                />
                
                <HudView ref={'hud'} />
            </View>
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
    menu: {
        padding: 15,
        paddingLeft: 30,
        borderBottomColor:'#fafafa',
        borderStyle:'solid',
        borderBottomWidth:1
    },
    promptBox: {
        borderRadius: 10,
        elevation: 0,
        shadowOpacity: 0,
    }
});

export const LayoutComponent = Account;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
    };
}