//import liraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import iconMap from '../../config/font';
import theme from '../../config/theme';
import * as tool from '../../util/tool';

// create a component
class Chapter extends Component {

    constructor(props) {
        super(props);

        this.state = {
            cindex: props.cindex || 0,
            ccindex: props.ccindex || 0,
        }
    }

    componentWillReceiveProps(nextProps) {
        const {cindex, ccindex} = nextProps;
        if (cindex !== this.props.cindex) {
            this.setState({
                cindex: cindex,
            })
        }

        if (ccindex !== this.props.ccindex) {
            this.setState({
                ccindex: ccindex
            })
        }
    }

    render() {

        const {items = [], onSelected, style = {}} = this.props;

        let total = 0;
        items.map((chapter, index) => {
            total += chapter.child.length;  
        })

        return (
            <View style={[style]}>
                <View style={[styles.title, styles.ml_20]}>
                    <Text style={[styles.label_16]}>详情目录 <Text style={[styles.label_12, styles.label_gray]}>共{total}节</Text></Text>
                </View>
                {items.map((chapter, cindex) => {
                    return (
                        <View key={'chapter_' + cindex} style={[styles.mt_15]}>
                             {total > 1 ?
                            <View style={[styles.bg_l1gray, styles.p_10, styles.pl_20, styles.pr_20]}>
                                <Text><Text style={[styles.label_gray]}>{'第' + (cindex + 1) +'章 '}</Text> {chapter.chapterName}</Text>
                            </View>
                            :null}
                            <View>
                                {chapter.child.map((cchapter, ccindex) => {
                                    const on = cindex == this.state.cindex && ccindex == this.state.ccindex;

                                    return (
                                        <TouchableOpacity key={'chapter_' + cindex + '_' + ccindex} style={[styles.p_10, styles.row, styles.ai_ct]} onPress={() => {
                                            onSelected && onSelected(cindex, ccindex);
                                        }}>
                                            <View style={[styles.item_icon]}>
                                                    
                                            </View>
                                            <Text style={[styles.item, on && styles.label_blue]}>
                                            {(cindex + 1) + '-' + (ccindex + 1) + ' ' +cchapter.chapterName}
                                            </Text>
                                            <Text style={[styles.label_12, styles.label_dgray, styles.item_duration]}>时长：{tool.forTime(cchapter.duration)}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </View>
                    )
                })}
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
    title: {
        paddingLeft: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#00A6F6'
    },
    item_icon: {
        flex: 1,
    },
    item: {
        flex: 12
    },
    item_duration: {
        flex: 5
    }
});

//make this component available to the app
export default Chapter;
