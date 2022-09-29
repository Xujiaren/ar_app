//import liraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

import theme from '../../config/theme';

// create a component
class TabView extends Component {

    constructor(props) {
        super(props);

        const current = props.current || 0;

        this.state = {
            current: current,
        }
    }

    componentWillReceiveProps(nextProps) {
        const {current} = nextProps;

        if (current !== this.props.current) {
            this.setState({
                current: current
            })
        }
        
    }

    render() {
        const {current} = this.state;
        const {style={}, items = [], theme = 'classic', center = false} = this.props;

        const itemStyle = theme == 'classic' ? styles.item : styles.item_quick;
        const itemColor = theme == 'classic' ? styles.label_gray : styles.label_default;
        const itemOnColor = theme == 'classic' ? styles.label_default : styles.label_blue;
        const dotStyle = theme == 'classic' ? styles.tab_dot : styles.tab_dot_quick;
        const dotOnStyle = theme == 'classic' ? styles.bg_blue : styles.tab_dot_quick;

        return (
            <View style={[styles.container, styles.bg_white, style]}>
                <ScrollView horizontal={true} showsVerticalScrollIndicator={false}  showsHorizontalScrollIndicator={false} contentContainerStyle={[center && styles.item_container]}>
                    {items.map((item, index) => {

                        const on = index == current;

                        return (
                            <TouchableOpacity key={'item_' + index} style={[itemStyle, styles.ai_ct]} onPress={() => {
                                this.setState({
                                    current: index,
                                }, () => {
                                    this.props.onSelected && this.props.onSelected(index)
                                })
                            }}>
                                <Text style={[itemColor, on && itemOnColor]}>{item}</Text>
                                <View style={[dotStyle, on && dotOnStyle]}/>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    container: {
        borderBottomColor: '#F6F6F6',
        borderBottomWidth: 1,
    },
    item_container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        padding: 10, 
        paddingLeft: 25,
        paddingRight: 25,
        paddingBottom: 2,
    },
    item_quick: {
        padding: 10, 
        paddingLeft: 15,
        paddingRight: 15,
    },
    tab_dot: {
        width: 10,
        height: 4,
        borderRadius: 2,
        marginTop: 5,
    },
    tab_dot_quick: {
        width: 10,
        height: 4,
        borderRadius: 2,
    }
});

//make this component available to the app
export default TabView;
