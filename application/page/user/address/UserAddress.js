//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Swipeout from 'react-native-swipeout';

import iconMap from '../../../config/font';
import asset from '../../../config/asset';
import theme from '../../../config/theme';

// create a component
class UserAddress extends Component {

    static navigationOptions = ({navigation}) => {
		return {
            title: '我的地址',
            headerRight: () => {
                return (
                    <TouchableOpacity style={[styles.mr_15]} onPress={() => navigation.navigate('SaveAddress')}>
                        <Text style={[styles.label_dgray]}>添加</Text>
                    </TouchableOpacity>
                )
            }
		}
	};

    constructor(props) {
        super(props);

        this.items = [];

        this.state = {
            loaded: false,
            index: 0,
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.onFirst = this.onFirst.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    componentDidMount() {
        const {navigation} = this.props;

        this.focuSub = navigation.addListener('didFocus', (route) => {
            this.onRefresh();
        });
    }

    componentWillUnmount(){
        this.focuSub && this.focuSub.remove();
    }

    componentWillReceiveProps(nextProps) {
        const {address} = nextProps;

        if (address !== this.props.address) {
            this.items = address;

            this.setState({
                loaded: true,
            })
        }
    }

    onRefresh() {
        const {actions} = this.props;
        actions.user.address();
    }

    onFirst(address_id) {
        const {actions} = this.props;

        actions.user.firstAddress({
            address_id: address_id,
            resolved: (data) => {
                this.onRefresh();
            },
            rejected: (msg) => {
                
            }
        })
    }

    renderItem(item) {
        const {navigation, actions} = this.props;
        const address = item.item;

        const swipeoutBtns = [
            {
                text: '编辑',
                backgroundColor: '#00A6F6',
                onPress: () => {
					navigation.navigate('SaveAddress', {address: address})
				},
            },
            {
                text: '删除',
                onPress: () => {
					actions.user.removeAddress({
                        address_id: address.addressId,
                        resolved: (data) => {
                            this.onRefresh();
                        },
                        rejected: (msg) => {
                            
                        }
                    })
				},
            }
        ];

        return (
            <Swipeout backgroundColor={'white'} right={swipeoutBtns} autoClose={true}>
            <View style={[styles.bg_white, styles.mt_10, styles.p_15, styles.pl_20, styles.pr_20]}>
                <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
                    <Text style={[styles.label_16]}>{address.realname}</Text>
                    <Text>{address.mobile}</Text>
                </View>
                <Text style={[styles.mt_10]}>{address.province} {address.city} {address.district} {address.address}</Text>
                <TouchableOpacity style={[styles.mt_10]} onPress={() => this.onFirst(address.addressId)}>
                    <Text style={[styles.label_gray, address.isFirst == 1 && styles.label_blue]}><Text style={[styles.icon, styles.label_gray, address.isFirst == 1 && styles.label_blue]}>{iconMap(address.isFirst == 1 && styles.label_blue ? 'selected' : 'unselect')}</Text> 设为默认</Text>
                </TouchableOpacity>
            </View>
            </Swipeout>
        )
    }

    render() {
        const {loaded} = this.state;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#00A6F6"/>
            </View>
        )

        return (
            <View style={styles.container}>
                <FlatList
                    showsVerticalScrollIndicator={false}
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
});

export const LayoutComponent = UserAddress;

export function mapStateToProps(state) {
    return {
        address: state.user.address,
    };
}
