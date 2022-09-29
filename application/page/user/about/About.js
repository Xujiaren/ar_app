//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import MenuCell from '../../../component/base/MenuCell';
import theme from '../../../config/theme';

// create a component
class About extends Component {

    static navigationOptions = {
        title:'帮助',
        headerRight: <View/>
    };
    
    render() {
        const {navigation} = this.props;
        
        return (
            <View style={styles.container}>
                <MenuCell label={'关于我们'} onPress={()=> navigation.navigate('AboutContent', {type: 0})}/>
                <MenuCell label={'隐私条款'} onPress={()=> navigation.navigate('AboutContent', {type: 1})}/>
                <MenuCell label={'版权声明'} onPress={()=> navigation.navigate('AboutContent', {type: 2})}/>
                <MenuCell label={'联系我们'} onPress={()=> navigation.navigate('AboutContent', {type: 3})}/>
                <MenuCell label={'商业使用'} onPress={()=> navigation.navigate('AboutContent', {type: 4})}/>
                <MenuCell label={'证照信息'} onPress={()=> navigation.navigate('AboutContent', {type: 5})}/>
                <MenuCell label={'用户服务使用协议'} onPress={()=> navigation.navigate('AboutContent', {type: 6})}/>
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

//make this component available to the app
export default About;
