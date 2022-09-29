//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, View, ScrollView, Text, StyleSheet } from 'react-native';
import HtmlView from '../../../component/base/HtmlView';
import theme from '../../../config/theme';

const title = ['关于我们', '隐私条款', '版权声明', '联系我们', '商业使用', '证照信息', '用户服务使用协议'];
const types = ['aboutus', 'privacy', 'copyright', 'contact', 'business', 'pinfo', 'policy'];

// create a component
class AboutContent extends Component {

    static navigationOptions = ({navigation}) => {
        const type = navigation.getParam('type', 1);
		return {
            title: title[type],
            headerRight: <View/>
		}
    };

    constructor(props) {
        super(props);

        const {navigation} = props;
        this.type = navigation.getParam('type', 1);

        this.state = {
            html: '',
            loaded: false,
        }
    }
    
    componentDidMount() {
        const {actions} = this.props;
        actions.news.about({
            type: types[this.type],
            resolved: (data) => {
                this.setState({
                    loaded: true,
                    html: data,
                })
            },
            rejected: (msg) => {
                
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        const {about} = nextProps;
        
        this.setState({
            loaded: true,
        })
    }

    render() {
        const {loaded, html} = this.state;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#00A6F6"/>
            </View>
        )

        let _html = html;
        _html = _html.replace(/<p([^<>]*)>([\s]*)<\/p>/g, '');

        return (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.p_20}>
                    <HtmlView source={{html: _html}} />
                </ScrollView>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
});

export const LayoutComponent = AboutContent;

export function mapStateToProps(state) {
    return {
        about: state.news.about,
    };
}