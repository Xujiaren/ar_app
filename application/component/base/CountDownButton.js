import React, { Component } from 'react';

import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
} from 'react-native';

import BackgroundTimer from 'react-native-background-timer';

import theme from '../../config/theme';

class CountDownButton extends Component {
	constructor(props) {
		super(props);

		const {time = 60} = props;
		this.time = time;

		this.timer = null;
		this.state = {
			time: time,
			sended: false,
			count: false,
			canSend: props.canSend,
		};

		this._onPress = this._onPress.bind(this);
		this._countdown = this._countdown.bind(this);
		this.start = this.start.bind(this);
	}

	componentWillUnmount() {
		if (this.timer) {
			BackgroundTimer.clearTimeout(this.timer);
		}
	}

	componentWillReceiveProps(nextProps) {
		const {canSend} = nextProps;
		if (canSend !== this.props.canSend) {
			this.setState({
				canSend: canSend,
			});
		}
	}

	start() {
		this.timer = BackgroundTimer.setTimeout(() => this._countdown(this.time), 1000);
	}

	reset() {
		this.setState({
			canSend: true,
		})
	}

	_onPress() {
		if (this.state.canSend) {

			this.setState({
				canSend: false,
			}, () => {
				this.props.onPress && this.props.onPress();
			})
			
		}
	}

	_countdown(time) {

		if (time > 1) {
			time--;
			this.setState({
				count: true,
				time: time,
			}, () => {
	    		this.timer = BackgroundTimer.setTimeout(() => this._countdown(this.state.time), 1000);
	    		this.setState({
					sended: true,
				});
	    	});

		} else {
			this.setState({
				count: false,
				canSend: true,
			});
			BackgroundTimer.clearTimeout(this.timer);
		}
	}

	render() {
		const {count, canSend} = this.state;

		console.info(count + '---' + canSend);

		let enable = true;

		if (!canSend) {
			enable = false;
		}

		if (count) {
			enable = false;
		}

		return (
			<TouchableOpacity onPress={this._onPress} disabled={!enable}>
				<View style={[styles.container,  styles.p_5, styles.pl_10, styles.pr_10, styles.circle_20, this.props.style, !enable && styles.onContainer]}>
					<Text style={[styles.label_blue, this.state.count && styles.onCountLabel]}>{this.state.count ? this.state.time : this.state.sended ? '重新发送' : '获取验证码'}</Text>
				</View>
			</TouchableOpacity>
		);
	}
}


const styles = StyleSheet.create({
	...theme,
	container: {
		width: 120,
		justifyContent: 'center',
		alignItems: 'center',
		opacity: 1,
		borderColor:'#00A6F6',
		borderWidth: 1,
		borderStyle:'solid',
	},
	onContainer: {
		borderColor: '#00A6F6',
	},
	countLabel: {
		color:'#FFFFFF',
	},
	onCountLabel: {
		
	},
});


export default CountDownButton;