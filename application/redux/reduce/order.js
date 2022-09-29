import createReducer from '../../util/reduce';

const {ORDER_BUY, ORDER_RECHARGE} = require('../key').default;

const initialState = {

};

const actionHandler = {
	[ORDER_BUY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[ORDER_RECHARGE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
};

export default createReducer(initialState, actionHandler);