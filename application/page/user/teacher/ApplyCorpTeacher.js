//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, View, ScrollView, Image, TouchableOpacity, Text, TextInput, Modal, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import ImagePicker from 'react-native-image-picker';
import Picker from 'react-native-picker';
import DatePicker from 'react-native-datepicker';

import HudView from '../../../component/base/HudView';
import asset from '../../../config/asset';
import iconMap from '../../../config/font';
import theme from '../../../config/theme';

const sitems = ['保密', '男', '女'];
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

class ApplyCorpTeacher extends Component {

    static navigationOptions = {
        title:'申请讲师',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            applyed: false,
            status: 0,

            sex: '男',
            company_name: '', 
            system_name: '', 
            job: '', 
            name: '', 
            birthday: '1980-01-01', 
            school: '', 
            edu: '', 
            specialty: '', 
            work_years: '', 
            this_work_years: '',  
            show_value: '',
            train_exp: '', 
            strong: '',

            gallery: [],

            preview: false,
            preview_index: 0,
            preview_imgs: [],
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.onSex = this.onSex.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.onPreview = this.onPreview.bind(this);
        this.onApply = this.onApply.bind(this);
    }

    componentDidMount() {
        this.onRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {apply_info} = nextProps;

        if (apply_info !== this.props.apply_info) {
            let applyed = false;
            let status = 0;
            let gallery = [];

            if (apply_info.applyId) {
                applyed = true;
                status = apply_info.status;

                apply_info.galleryList.map((pic, index) => {
                    gallery.push(pic.fpath);
                });
            }

            this.setState({
                loaded: true,
                applyed: applyed,
                gallery: gallery,
                status: status,
            })
        }
    }

    onRefresh() {
        const {actions} = this.props;
        actions.teacher.applyInfo();
    }

    onSex() {
        const {sex} = this.state;

        Picker.init({
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			pickerTitleText: '选择性别',
            pickerData: sitems,
            selectedValue: [sex],
            onPickerConfirm: pickedValue => {
                this.setState({
                    sex: pickedValue[0],
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

    onApply() {
        const {actions} = this.props;
        const {company_name, system_name, job, name, sex, birthday, school, edu, specialty, work_years, this_work_years, gallery, show_value, train_exp, strong} = this.state;

        if (company_name.length == 0) {
            this.refs.hud.show('请先填写所在公司。', 1);
            return;
        }

        if (system_name.length == 0) {
            this.refs.hud.show('请先填写所在部门。', 1);
            return;
        }

        if (name.length == 0) {
            this.refs.hud.show('请先填写姓名。', 1);
            return;
        }

        this.refs.hud.show('...');
        actions.teacher.corpApply({
            company_name: company_name,
            system_name: system_name,
            job: job,
            name: name,
            sex: sitems.indexOf(sex),
            birthday: birthday,
            school: school,
            edu: edu,
            specialty: specialty,
            work_years: work_years,
            this_work_years: this_work_years,
            train_cert: gallery.join(','),
            show_value: show_value,
            train_exp: train_exp,
            strong: strong,

            resolved: (data) => {
                this.setState({
                    applyed: true,
                })

                this.refs.hud.show('申请成功', 1);
            },
            rejected: (msg) => {
                this.refs.hud.show('申请失败', 1);
            }
        })
    }

    render() {
        const {loaded, applyed, status, company_name, system_name, job, name, birthday, school, edu, specialty, work_years, this_work_years, show_value, train_exp, strong, sex, gallery, preview, preview_imgs, preview_index} = this.state;

        const enable = !applyed;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#00A6F6"/>
            </View>
        )


        return (
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={[styles.p_20]}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={[styles.p_15, styles.row, styles.ai_ct, styles.jc_sb, styles.b_line]}>
                        <Text style={[styles.label_16, styles.f1]}>所在公司</Text>
                        <TextInput 
                            editable={!applyed}
                            style={[styles.f3, styles.p_10]}
                            placeholder={'请输入所在公司'}
                            textAlign={'right'}
                            value={company_name}
                            onChangeText={(text) => {this.setState({company_name:text});}}
                        />
                    </View>
                    <View style={[styles.p_15, styles.row, styles.ai_ct, styles.jc_sb, styles.b_line]}>
                        <Text style={[styles.label_16, styles.f1]}>所在部门</Text>
                        <TextInput 
                            editable={!applyed}
                            style={[styles.f3, styles.p_10]}
                            placeholder={'请输入所在部门'}
                            textAlign={'right'}
                            value={system_name}
                            onChangeText={(text) => {this.setState({system_name:text});}}
                        />
                    </View>
                    <View style={[styles.p_15, styles.row, styles.ai_ct, styles.jc_sb, styles.b_line]}>
                        <Text style={[styles.label_16, styles.f1]}>岗位</Text>
                        <TextInput 
                            style={[styles.f3, styles.p_10]}
                            placeholder={'请输入岗位'}
                            textAlign={'right'}
                            editable={!applyed}
                            value={job}
                            onChangeText={(text) => {this.setState({job:text});}}
                        />
                    </View>
                    <View style={[styles.p_15, styles.row, styles.ai_ct, styles.jc_sb, styles.b_line]}>
                        <Text style={[styles.label_16, styles.f1]}>姓名</Text>
                        <TextInput 
                            style={[styles.f3, styles.p_10]}
                            placeholder={'请输入姓名'}
                            textAlign={'right'}
                            editable={!applyed}
                            value={name}
                            onChangeText={(text) => {this.setState({name:text});}}
                        />
                    </View>
                    <TouchableOpacity style={[styles.p_15, styles.row, styles.ai_ct, styles.jc_sb, styles.b_line]} onPress={this.onSex}>
                        <Text style={[styles.label_16, styles.f1]}>性别</Text>
                        <View style={[styles.f3, styles.row, styles.ai_ct, styles.jc_fe]}>
                            <Text>{sex}</Text>
                            <Text style={[styles.icon, styles.label_gray]}>{iconMap('right')}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.p_15, styles.row, styles.jc_sb, styles.ai_ct, styles.b_line]}>
                        <Text style={[styles.label_16, styles.f1]}>出生日期</Text>
                        <View style={[styles.f3, styles.row, styles.ai_ct, styles.jc_fe]}>
                            <DatePicker
                                style={{width: 120,borderWidth:0,height:20,color:'#999999'}}
                                mode="date"
                                date={birthday}
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
                                        birthday: dt
                                    })
                                }}
                            />
                            <Text style={[styles.icon, styles.label_gray]}>{iconMap('right')}</Text>
                        </View>
                    </View>
                    <View style={[styles.p_15, styles.row, styles.ai_ct, styles.jc_sb, styles.b_line]}>
                        <Text style={[styles.label_16, styles.f1]}>毕业院校</Text>
                        <TextInput 
                            style={[styles.f3, styles.p_10]}
                            placeholder={'请输入毕业院校'}
                            textAlign={'right'}
                            editable={!applyed}
                            value={school}
                            onChangeText={(text) => {this.setState({school:text});}}
                        />
                    </View>
                    <View style={[styles.p_15, styles.row, styles.ai_ct, styles.jc_sb, styles.b_line]}>
                        <Text style={[styles.label_16, styles.f1]}>学历</Text>
                        <TextInput 
                            style={[styles.f3, styles.p_10]}
                            placeholder={'请输入学历'}
                            textAlign={'right'}
                            value={edu}
                            onChangeText={(text) => {this.setState({edu:text});}}
                        />
                    </View>
                    <View style={[styles.p_15, styles.row, styles.ai_ct, styles.jc_sb, styles.b_line]}>
                        <Text style={[styles.label_16, styles.f1]}>专业</Text>
                        <TextInput 
                            style={[styles.f3, styles.p_10]}
                            placeholder={'请输入专业'}
                            textAlign={'right'}
                            value={specialty}
                            editable={!applyed}
                            onChangeText={(text) => {this.setState({specialty:text});}}
                        />
                    </View>
                    <View style={[styles.p_15, styles.row, styles.ai_ct, styles.jc_sb, styles.b_line]}>
                        <Text style={[styles.label_16, styles.f1]}>工作年限</Text>
                        <TextInput 
                            style={[styles.f3, styles.p_10]}
                            placeholder={'请输入工作年限'}
                            textAlign={'right'}
                            value={work_years}
                            onChangeText={(text) => {this.setState({work_years:text});}}
                        />
                    </View>
                    <View style={[styles.p_15, styles.row, styles.ai_ct, styles.jc_sb, styles.b_line]}>
                        <Text style={[styles.label_16, styles.f2]}>本公司工作年限</Text>
                        <TextInput 
                            style={[styles.f3, styles.p_10]}
                            placeholder={'请输入本公司工作年限'}
                            textAlign={'right'}
                            value={this_work_years}
                            editable={!applyed}
                            onChangeText={(text) => {this.setState({this_work_years:text});}}
                        />
                    </View>
                    <View style={[styles.p_15]}>
                        <Text style={[styles.label_16]}>资源主题</Text>
                        <TextInput
                            style={[styles.input, styles.bg_lgray, styles.circle_5, styles.p_15, styles.mt_15]}
                            placeholder={'50字以内'}
                            multiline={true}
                            value={show_value}
                            editable={!applyed}
                            onChangeText={(text) => {this.setState({show_value:text});}}
                        />
                    </View>
                    <View style={[styles.p_15]}>
                        <Text style={[styles.label_16]}>工作经历</Text>
                        <TextInput
                            style={[styles.input, styles.bg_lgray, styles.circle_5, styles.p_15, styles.mt_15]}
                            placeholder={'第一份工作'}
                            multiline={true}
                            value={train_exp}
                            editable={!applyed}
                            onChangeText={(text) => {this.setState({train_exp:text});}}
                        />
                    </View>
                    <View style={[styles.p_15]}>
                        <Text style={[styles.label_16]}>自我评价</Text>
                        <TextInput
                            style={[styles.input, styles.bg_lgray, styles.circle_5, styles.p_15, styles.mt_15]}
                            placeholder={'50字以内'}
                            multiline={true}
                            value={strong}
                            editable={!applyed}
                            onChangeText={(text) => {this.setState({strong:text});}}
                        />
                    </View>
                    <View style={[styles.p_15]}>
                        <Text style={[styles.label_16]}>职业资格证书</Text>
                        <View style={[styles.row, styles.wrap, styles.mt_15]}>
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

                </ScrollView>
                <TouchableOpacity style={[styles.bg_blue, styles.circle_5, styles.p_15, styles.m_20, styles.ai_ct, !enable && styles.disabledContainer]} disabled={!enable} onPress={this.onApply}>
                    <Text style={[styles.label_white]}>{applyed ? mstatus[status] : '提交'}</Text>
                </TouchableOpacity>

                <Modal visible={preview} transparent={true} onRequestClose={() => {
                    this.setState({preview:false})
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
        height: 100,
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

export const LayoutComponent = ApplyCorpTeacher;

export function mapStateToProps(state) {
    return {
        apply_info: state.teacher.apply_info,
    };
}