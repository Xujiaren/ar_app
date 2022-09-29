//import liraries
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, TextInput, Modal, StyleSheet } from 'react-native';
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
class PublishComment extends Component {

    static navigationOptions = {
        title:'写评论',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        const {navigation} = props;

        this.ctype = navigation.getParam('ctype', 3);
        this.content_id = navigation.getParam('content_id', 0);

        this.state = {
            rule: global.tip == 1,

            content: '',
            gallery: [],

            preview: false,
            preview_index: 0,
            preview_imgs: [],
        }

        this.onTip = this.onTip.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.onPreview = this.onPreview.bind(this);
        this.onPublish = this.onPublish.bind(this);
    }

    onTip() {
        const {actions} = this.props; 
        this.setState({
            rule: false,
        })

        actions.config.tip({
            resolved: (data) => {
            },
            rejected: (msg) => {
                
            }
        })
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
        const {actions, navigation} = this.props;
        const {content, gallery} = this.state;

        //content.length > 0;

        if (content.length == 0) {
            this.refs.hud.show('提交失败，请输入评论。', 1);
            return;
        }

        actions.user.comment({
            ctype: this.ctype,
            content_id: this.content_id,
            score: 5,
            teacher_score: 5,
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
                let error = '系统错误，请稍后再试!';
                if (msg == 'WORD_ERROR') {
                    error = '请注意您的言论！';
                } else if (msg == 'ACCOUNT_DENY') {
                    error = '账户已禁用，请联系客服！';
                }
                
                this.refs.hud.show(error, 1);
            },
        })
    }

    render() {
        const {rule, content, gallery, preview, preview_imgs, preview_index} = this.state;

        const enable = true;

        return (
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                <View style={styles.container}>
                    <View style={[styles.p_15, styles.pl_20, styles.pr_20, styles.bg_white]}>
                        <TextInput
                            style={[styles.input, styles.bg_lgray, styles.circle_5, styles.p_15]}
                            placeholder={'欢迎参与评论，将由工作人员筛选审核后公开显示。'}
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

                    <Modal visible={rule} transparent={true} onRequestClose={() => {
                        this.setState({rule:false})
                    }}>
                        <TouchableOpacity style={[styles.modal]} onPress={()=>this.setState({rule:false})}/>
                        <View style={[styles.rule, styles.bg_white, styles.circle_5]}>
                            <View style={[styles.p_15, styles.b_line]}>
                                <Text style={[styles.label_16, styles.label_center]}>留言规则</Text>
                                <Text style={[styles.mt_20]}>
                                    用户留言不得发布以下内容：{'\n'}
                                    1、捏造、散播和宣传危害国家统一、公共安全、社会秩序等言论； {'\n'}
                                    2、恶意辱骂、中伤、诽谤他人及企业； {'\n'}
                                    3、涉及色情、污秽、低俗的的信息及言论；{'\n'} 
                                    4、广告信息； {'\n'}
                                    5、《直销管理条例》、《禁止传销条例》、《反不正当竞争法》等法律法规禁止的内容； {'\n'}
                                    6、政治性话题及言论； {'\n'}
                                    7、对任何企业、组织现行规章制度的评论和讨论，及传播任何未经官方核实的信息； 如违反以上规定，平台有权实施账户冻结、注销等处理，情节严重的，将保留进一步法律追责的权利。
                                </Text>
                            </View>
                            <View style={[styles.row]}>
                                <TouchableOpacity style={[styles.f1, styles.p_15, styles.ai_ct, styles.r_line]} onPress={this.onTip}>
                                    <Text style={[styles.label_gray]}>不再提示</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.f1, styles.p_15, styles.ai_ct]} onPress={() => this.setState({
                                    rule: false
                                })}>
                                    <Text>关闭</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

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
        height: 200,
    },
    pic: {
        width: 54,
        height: 54,
    },
    rule: {
        position:'absolute',
        top: 100,
        left: 50,
        right: 50,
    },
    close: {
        position: 'absolute',
        top: 10,
        right: 10,
    }
});

export const LayoutComponent = PublishComment;

export function mapStateToProps(state) {
    return {
        
    };
}