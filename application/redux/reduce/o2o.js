import createReducer from '../../util/reduce';

const {O2O_INDEX, O2O_PAY, O2O_INFO, O2O_APPLY, O2O_SIGN} = require('../key').default;

const initialState = {
	index: {},
	info: {},
};

const actionHandler = {
	[O2O_INDEX]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			index: error ? {} : {
				...payload
			},
		};
	},
	[O2O_PAY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
    [O2O_INFO]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			info: error ? {} : {
				...payload
			},
		};
	},
	[O2O_APPLY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[O2O_SIGN]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
};

export default createReducer(initialState, actionHandler);