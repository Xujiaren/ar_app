//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, Image, FlatList, Modal, StyleSheet } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

import asset from '../../../config/asset';
import theme from '../../../config/theme';

// create a component
class TeacherMedal extends Component {

    static navigationOptions = {
        title:'讲师勋章',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);
        const{navigation}=this.props;
        this.items = [];
        this.type = navigation.getParam('type', 0);
        this.state = {
            loaded: null,
            preview: false,
            preview_index: 0,
            preview_imgs: [],
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.onPreview = this.onPreview.bind(this);
    }

    componentDidMount() {
        this.onRefresh();
    }
    componentWillReceiveProps(nextProps) {
        const {cert,user} = nextProps;

        if (cert !== this.props.cert) {
            this.items = cert;

            this.setState({
                loaded: true,
            })
        }
        if(user!==this.props.user){
			this.items=user.teacherDTO.certDTOS;
            this.setState({
                loaded: true,
            })
		}
    }

    onRefresh() {
        const {actions} = this.props;
        if(this.type==0){
			actions.teacher.cert();
		}else{
			actions.user.user();
		}
    }

    onPreview(item,index) {
        let images = [];
        this.items.map((gallery, i) => {
            images.push({
				url: gallery.certImg,
			});
        });

        this.setState({
            preview: true,
            preview_index: index,
            preview_imgs: images,
        });
    }

    renderItem(item) {
        let cert = item.item;
        return (
            <TouchableOpacity style={[styles.item, styles.p_10, styles.ai_ct, styles.mt_20]} onPress={() => this.onPreview(item.index)}>
                <Image source={{uri: cert.certImg}} style={[styles.icon, styles.bg_blue]}/>
                <Text style={[styles.mt_10]}>{cert.certName}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const {loaded, preview, preview_imgs, preview_index} = this.state;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#00A6F6"/>
            </View>
        )

        return (
            <View style={styles.container}>
                <FlatList
                    contentContainerStyle={styles.p_20}
                    numColumns={3}
                    data={this.items}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this.renderItem}
                    ListEmptyComponent={() => {
                        return (
                            <View style={[styles.ai_ct, styles.jc_ct]}>
                                <Image source={asset.base.empty} style={[styles.empty, styles.mt_25]}/>
                            </View>
                        )
                    }}
                />
                <Modal visible={preview} transparent={true} onRequestClose={() => {
                    this.setState({preview:false})
                }}>
                    <ImageViewer imageUrls={preview_imgs} index={preview_index} onClick={() => {
						this.setState({
							preview: false,
						});
					}}/>
                </Modal>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    item: {
        width: (theme.window.width - 40) / 3,
    },
    icon: {
        width: 64,
        height: 64,
    }
});

export const LayoutComponent = TeacherMedal;

export function mapStateToProps(state) {
    return {
        cert: state.teacher.cert,
        user: state.user.user,
    };
}