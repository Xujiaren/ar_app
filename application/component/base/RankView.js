//import liraries
import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import iconMap from '../../config/font';
import theme from '../../config/theme';

// create a component
class RankView extends Component {

    constructor(props) {
		super(props);

        let value = props.value || 0;
        let label = props.label || '';
		let canChoose = false;
		if (props.onChoose) {
			canChoose = true;
		}

		this.state = {
            value: value,
            label: label,
			canChoose: canChoose,
		};

		this._onChoose = this._onChoose.bind(this);
    }

    _onChoose(value) {
		this.setState({
			value: value
		}, () => {
			this.props.onChoose && this.props.onChoose(value);
		})
	}
    
    render() {
        return (
            <View style={[styles.container, this.props.style]}>
				{
					[1, 2, 3, 4, 5].map((val, index) => {
						let on = val <= this.state.value;

						if (this.state.canChoose) {
							return (
								<TouchableOpacity key={index} style={styles.choose_rank} onPress={() => this._onChoose(val)}>
									<Text style={[styles.icon, styles.label_lgray, on && styles.label_yellow]}>{iconMap('pingfen')}</Text>
								</TouchableOpacity>
							)
						}

						return (
                            <View key={index} style={styles.rank}>
                                <Text style={[styles.icon, styles.label_lgray, on && styles.label_yellow]}>{iconMap('pingfen')}</Text>
                            </View>
                        )
					})
				}
                {this.state.label.length > 0 ?
                <Text style={[styles.label_dgray, styles.label_12, styles.ml_10]}>{this.state.label}</Text>
                : null}
			</View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme,
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	rank: {
		paddingLeft: 2,
	},
	choose_rank: {
		paddingLeft: 5,
	}
});

//make this component available to the app
export default RankView;
