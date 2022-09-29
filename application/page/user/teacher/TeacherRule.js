//import liraries
import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';

import theme from '../../../config/theme';

// create a component
class TeacherRule extends Component {

    static navigationOptions = {
        title:'申请条例',
        headerRight: <View/>
    };

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={[styles.p_20]} showsVerticalScrollIndicator={false}>
                    <Text>甲方是安然，按照中华人民共和国法律组成并有效存续的法人。</Text>
                    <Text style={[styles.mt_5]}>乙方希望成为甲方代理经销商经销甲方产品认证讲师的经销商；</Text>
                    <Text style={[styles.mt_5]}>       为了规范培训秩序，提高培训质量，提升认证讲师队伍综合素质，明确认证讲师的责任和义务，提升认证讲师的自我约束力，就乙方讲师资格事宜，经双方协商一致，在平等、自愿的原则及严格遵守甲方公司《经销商行为规范守则》前提下订立以下协议，以资遵守：</Text>
                    <Text style={[styles.mt_10, styles.label_16]}>甲方的权利义务：</Text>
                    <Text style={[styles.mt_5]}>       1、乙方通过甲方认证讲师考评，甲方须授予认证讲师资格。</Text>
                    <Text>       2、甲方有权取消乙方的认证讲师资格。</Text>
                    <Text style={[styles.mt_10, styles.label_16]}>乙方的权利义务：</Text>
                    <Text style={[styles.mt_5]}>       1、乙方讲师须服从甲方管理及工作安排，遵守甲方的相关规章管理制度。</Text>
                    <Text>       2、乙方讲师须遵守“讲师十不准”：</Text>
                    <Text>       3、形象规范、言行规范要符合讲师标准；</Text>
                    <Text style={[styles.mt_10, styles.label_16]}>保密约定</Text>
                    <Text style={[styles.mt_5]}>       鉴于甲方拥有的商业秘密和技术秘密在竞争中有重要价值，乙方负有保密义务。因此，乙方同意：上述保密义务长期有效。 </Text>
                    <Text style={[styles.mt_10, styles.label_16]}>违约责任 </Text>
                    <Text style={[styles.mt_5]}>       1、如乙方违反本协议项下的规定： </Text>
                    <Text>       1.1甲方有权取消乙方的认证讲师资格，并责令乙方停止违约或侵权行为； </Text>
                    <Text>       1.2乙方须承担2万元违约金；</Text>
                    <Text>       1.3甲方有权要求乙方赔偿其违约或侵权行为导致的一切经济损失及其可能的寻求法律救济过程中发生的一切费用,其中包括律师费用、诉讼费用; </Text>
                    <Text>       1.4触犯法律的，提请有关部门追究其法律责任。 </Text>
                    <Text>       2、甲方有权直接从甲乙双方的经济往来中扣除乙方的违约金和赔偿金。 </Text>
                    <Text style={[styles.mt_10, styles.label_16]}>争议的解决办法</Text>
                    <Text style={[styles.mt_5]}>       因执行本协议而发生纠纷，可以由双方协商解决。协商、调解不成或者一方不愿意协商、调解的，双方均可向甲方住所地有管辖权的人民法院提起诉讼。 </Text>
                    <Text style={[styles.mt_10, styles.label_16]}>其他约定</Text>
                    <Text style={[styles.mt_5]}>       讲师资格为荣誉证明，甲、乙双方不存在劳动关系，乙方也非甲方雇佣的人员。 </Text>
                    <View style={[styles.mt_40]}/>
                </ScrollView>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
});

//make this component available to the app
export default TeacherRule;
