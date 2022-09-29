//import liraries
import React, { Component } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';
import Picker from 'react-native-picker';

import HudView from '../../../component/base/HudView';
import region from '../../../config/region';
import iconMap from '../../../config/font';
import theme from '../../../config/theme';

// create a component
class SaveAddress extends Component {

    static navigationOptions = {
        title:'保存地址',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        const {navigation} = props;

        const address = navigation.getParam('address', {addressId: 0, province: '', city: '', district: '', realname: '', mobile: '', address: '', is_first: 1});
        this.citys = [];

        Object.keys(region).map((province, index) => {
			let _area = {};
			const citys = region[province];

			let _citys = [];
			Object.keys(citys).map((city, index) => {
				let _area = {};
				_area[city] = citys[city];
				_citys.push(_area);
			})

			_area[province] = _citys;

			this.citys.push(_area);
        })
        

        this.state = {
            addressId: address.addressId,
            realname: address.realname,
            mobile: address.mobile,
            province: address.province,
            city: address.city,
            district: address.district,
            address: address.address,
            is_first: address.is_first,
        }

        this.onCity = this.onCity.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    componentWillUnmount() {
        Keyboard.dismiss();
        Picker.hide();
    }

    onCity() {
        const {province, city, district} = this.state;
        Picker.init({
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			pickerTitleText: '选择地区',
            pickerData: this.citys,
            selectedValue: [province, city, district],
            onPickerConfirm: pickedValue => {
                this.setState({
                	province: pickedValue[0],
                	city: pickedValue[1],
                	district: pickedValue[2],
                })
            },
        });

        Picker.show();
    }

    onSave() {
        const {actions, navigation} = this.props;
        const {addressId, realname, mobile, province, city, district, address, is_first} = this.state;

        if (realname.length == 0) {
            this.refs.hud.show('请输入收件人', 1);
            return;
        }

        if (mobile.length != 11) {
            this.refs.hud.show('请输入手机号', 1);
            return;
        }

        if (province.length == 0) {
            this.refs.hud.show('请选择区域', 1);
            return;
        }

        if (address.length == 0) {
            this.refs.hud.show('请输入详细地址', 1);
            return;
        }

        this.refs.hud.show('...');

        actions.user.saveAddress({
            address_id: addressId, 
            realname: realname, 
            mobile: mobile, 
            province: province, 
            city: city, 
            district: district, 
            address: address, 
            is_first: is_first,
            resolved: (data) => {
                this.refs.hud.show('提交成功', 1, () => {
                    navigation.goBack();
                });
            },
            rejected: (msg) => {
                this.refs.hud.show('提交失败，请稍后再试', 1);
            }
        })
    }

    render() {
        const {realname, mobile, province, city, district, address} = this.state;

        return (
            <TouchableWithoutFeedback onPress={()=> {
                Keyboard.dismiss();
                Picker.hide();
            }}>
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <View style={[styles.p_15, styles.row, styles.ai_ct, styles.jc_sb, styles.b_line]}>
                        <Text style={[styles.label_16, styles.f1]}>收件人</Text>
                        <TextInput 
                            style={[styles.f3, styles.p_10]}
                            placeholder={'请输入收件人'}
                            textAlign={'right'}
                            value={realname}
                            onChangeText={(text) => {this.setState({realname:text});}}
                        />
                    </View>
                    <View style={[styles.p_15, styles.row, styles.ai_ct, styles.jc_sb, styles.b_line]}>
                        <Text style={[styles.label_16, styles.f1]}>手机号</Text>
                        <TextInput 
                            style={[styles.f3, styles.p_10]}
                            placeholder={'请输入手机号'}
                            keyboardType={'phone-pad'}
                            textAlign={'right'}
                            value={mobile}
                            onChangeText={(text) => {this.setState({mobile:text});}}
                        />
                    </View>
                    <TouchableOpacity style={[styles.p_15, styles.row, styles.ai_ct, styles.jc_sb, styles.b_line]} onPress={this.onCity}>
                        <Text style={[styles.label_16, styles.f1]}>区域</Text>
                        <Text>{province} {city} {district} <Text style={[styles.icon, styles.label_gray]}>{iconMap('right')}</Text></Text>
                    </TouchableOpacity>
                    <View style={[styles.p_15, styles.row, styles.ai_ct, styles.jc_sb, styles.b_line]}>
                        <Text style={[styles.label_16, styles.f1]}>详细地址</Text>
                        <TextInput 
                            style={[styles.f3, styles.p_10]}
                            placeholder={'请输入详细地址'}
                            textAlign={'right'}
                            value={address}
                            onChangeText={(text) => {this.setState({address:text});}}
                        />
                    </View>
                </ScrollView>

                <TouchableOpacity style={[styles.bg_blue, styles.circle_5, styles.p_15, styles.m_20, styles.ai_ct]} onPress={this.onSave}>
                    <Text style={[styles.label_white]}>提交</Text>
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
});


export const LayoutComponent = SaveAddress;

export function mapStateToProps(state) {
    return {
        
    };
}