import {  Dimensions } from 'react-native';

const {width, height} = Dimensions.get('window');

export default {
    window: {
		width: width,
        height: height,
    },
    bg_black:{
        backgroundColor: 'black',
    },
    bg_gray: {
        backgroundColor: '#D3D3D3',
    },
    bg_lgray: {
        backgroundColor: '#F5F5F5',
    },
    bg_l1gray: {
        backgroundColor: '#F6F3F1'
    },
    bg_white: {
        backgroundColor: 'white',
    },
    bg_blue: {
        backgroundColor: '#00A6F6',
    },
    bg_lblue: {
        backgroundColor: '#D4F4FF',
    },
    bg_orange: {
        backgroundColor: '#FF9F00'
    },
    bg_red: {
        backgroundColor: 'red'
    },
    bg_lyellow: {
        backgroundColor: '#FFFAC0',
    },

    label_default: {
        color: '#333333'
    },
    label_red: {
        color: 'red',
    },
    label_blue: {
        color: '#00A6F6'
    },
    label_yellow: {
        color: '#F0D97C'
    },
    label_white: {
        color: 'white'
    },
    label_lgray: {
        color: '#CCCCCC'
    },
    label_gray: {
        color: '#999999'
    },
    label_dgray: {
        color: '#666666'
    },
    label_gold: {
        color: '#DBB177'
    },
    label_green: {
        color: '#99D321'
    },
    label_orange: {
        color: '#F4623F'
    },

    label_center: {
        textAlign: 'center'
    },
    label_9: {
        fontSize: 9,
    },
    label_10: {
        fontSize: 10,
    },
    label_12: {
        fontSize: 12,
    },
    label_14: {
        fontSize: 14,
    },
    label_16: {
        fontSize: 16
    },
    label_18: {
        fontSize: 18,
    },
    label_20: {
        fontSize: 20,
    },
    label_26: {
        fontSize: 26
    },
    label_36: {
        fontSize: 36,
    },
    label_46: {
        fontSize: 46
    },
    label_bold: {
        fontWeight: 'bold',
    },

    icon: {
        fontFamily: 'iconfont',
        fontSize: 14,
    },

    circle_5:{
        borderRadius: 5,
    },
    circle_10: {
        borderRadius: 10,
    },
    circle_20: {
        borderRadius: 20,
    },

    row: {
        flexDirection: 'row',
    },
    wrap: {
        flexDirection: 'row',
        flexWrap:'wrap',
    },
    f1: {
        flex: 1
    },
    f2: {
        flex: 2,
    },
    f3: {
        flex: 3,
    },
    f4: {
        flex: 4,
    },
    f6: {
        flex: 6,
    },
    f7: {
        flex: 7,
    },
    f9: {
        flex: 9,
    },
    f10: {
        flex: 10,
    },
    as_ct: {
        alignSelf: 'center',
    },
    ac_sb: {
        alignContent: 'space-between',
    },
    ac_s: {
        alignContent: 'stretch'
    },
    ai_ct: {
        alignItems: 'center',
    },
    ai_fs:{
        alignItems: 'flex-start',
    },
    ai_end: {
        alignItems: 'flex-end',
    },
    jc_ct: {
        justifyContent: 'center',
    },
    jc_fs:{
        justifyContent: 'flex-start',
    },
    jc_fe:{
        justifyContent: 'flex-end',
    },
    jc_sb: {
        justifyContent: 'space-between',
    },
    jc_ad: {
        justifyContent: 'space-around',
    },

    p_5: {
        padding: 5,
    },
    pt_0: {
        paddingTop: 0,
    },
    pt_5: {
        paddingTop: 5,
    },
    p_10: {
        padding: 10,
    },
    pl_10: {
        paddingLeft: 10,
    },
    pr_10: {
        paddingRight: 10,
    },
    pt_10: {
        paddingTop: 10,
    },
    pb_10: {
        paddingBottom: 10,
    },

    p_15: {
        padding: 15,
    },
    pl_15: {
        paddingLeft: 15,
    },
    pr_15: {
        paddingRight: 15,
    },
    pt_15: {
        paddingTop: 15
    },
    pb_15: {
        paddingBottom: 15
    },

    p_20: {
        padding: 20,
    },
    pl_20: {
        paddingLeft: 20,
    },
    pr_20: {
        paddingRight: 20,
    },
    pb_20: {
        paddingBottom: 20,
    },
    p_25: {
        padding: 25,
    },
    
    pl_30: {
        paddingLeft: 30,
    },
    pr_30: {
        paddingRight: 30,
    },

    p_40: {
        padding: 40,
    },

    pt_50: {
        paddingTop: 50,
    },
    pl_50: {
        paddingLeft: 50,
    },
    pr_50: {
        paddingRight: 50,
    },

    m_5: {
        margin: 5,
    },
    ml_5: {
        marginLeft: 5,
    },
    mt_5: {
        marginTop: 5
    },

    m_10: {
        margin: 10,
    },
    mt_10: {
        marginTop: 10,
    },
    ml_10: {
        marginLeft: 10,
    },
    mr_10: {
        marginRight: 10,
    },
    mb_10: {
        marginBottom: 10,
    },

    ml_15: {
        marginLeft: 15,
    },
    mt_15: {
        marginTop: 15,
    },
    mb_15: {
        marginBottom: 15
    },
    mr_15: {
        marginRight: 15,
    },

    m_20: {
        margin: 20,
    },
    ml_20: {
        marginLeft: 20
    },
    mr_20: {
        marginRight: 20,
    },
    mt_20: {
        marginTop: 20,
    },
    mb_20: {
        marginBottom: 20,
    },
    mt_25: {
        marginTop: 25,
    },
    mt_30: {
        marginTop: 30,
    },
    mt_40: {
        marginTop: 40,
    },
    ml_40: {
        marginLeft: 40,
    },

    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    disabledContainer: {
        opacity: 0.5,
    },

    empty: {
    },

    modal: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },

    overflow_h:{
        overflow: 'hidden',
    },

    btn_blue: {
        borderWidth: 1,
        borderColor: '#00A6F6',
        padding: 5,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
    },

    t_line: {
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5'
    },

    b_line: {
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5'
    },

    r_line: {
        borderRightWidth: 1,
        borderRightColor: '#F5F5F5'
    },

    shadow: {
        shadowOffset:{  width: 0,  height:0},
        shadowColor: 'rgba(0,0,0, 1)',
        shadowOpacity: 0.1,
        elevation: 1,
    }
}