import createReducer from '../../util/reduce';

const {LOGIN, TOKEN, VCODE, LOGOUT, CLOSE, ISCORP, SWITCH_CARD, WECHAT_LOGIN, APPLE_LOGIN, BIND_MOBILE,LOGIN_LOG} = require('../key').default;

const initialState = {

};

const actionHandler = {
	[LOGIN]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[TOKEN]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[VCODE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [LOGOUT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[CLOSE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[ISCORP]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[SWITCH_CARD]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[WECHAT_LOGIN]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[APPLE_LOGIN]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[BIND_MOBILE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[LOGIN_LOG]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
};

export default createReducer(initialState, actionHandler);