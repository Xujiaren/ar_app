import React, { Component } from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';

class HudView extends Component {

	constructor(props) {
		super(props);

		this.state = {
			show: false,
			msg: '...',
		};
	}

	show(msg, delay = 0, callback) {
		this.setState({
			show: true,
			msg: msg
		}, () => {
			if (delay > 0) {
				setTimeout(() => {
					this.setState({
						show: false,
					}, () => {
						callback && callback();
					});
				}, delay * 1000);
			}
		});
	}

	hide() {
		this.setState({
			show: false
		});
	}

	render() {
		if (!this.state.show) return null;
		return (
			<View style={styles.container}>
				<View style={[styles.hud, this.state.msg === '...' && styles.hud_load]}>
					{this.state.msg === '...' ?
					<ActivityIndicator size={'large'}/>
					: <Text style={styles.hubLabel}>{this.state.msg}</Text>
					}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		zIndex: 99999,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		top:200,
	},
	hud: {
		padding: 10,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		borderRadius: 4,
	},
	hud_load: {
		width: 80,
		height: 80,
	},
	hubLabel: {
		textAlign: 'center',
		fontSize: 12,
		color: 'white',
	},
});

export default HudView;