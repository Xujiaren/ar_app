import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../redux/action';

const options = {
	
};

export default function connectComponent({ mapStateToProps, mapDispatchToProps, mergeProps, LayoutComponent }) {
	return connect(
		mapStateToProps || function (state) {
			return {};
		},
		mapDispatchToProps || function (dispatch) {

			let _actions = {};
			Object.keys(actions).map((key, i) => {
				_actions[key] = bindActionCreators(actions[key], dispatch);
			})

			return {
				actions: _actions,
			};
		},
		mergeProps,
		options
	)(LayoutComponent);
}