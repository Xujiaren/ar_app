import createReducer from '../../util/reduce';

const {SITE_INDEX, SITE_CHANNEL, SITE_COMMENT, SITE_UPLOAD, SITE_SEARCH, SITE_SEARCH_HISTORY, SITE_SEARCH_CLEAR, SITE_SEARCH_CLEARALL} = require('../key').default;

const initialState = {
	index: [],
	channel: [],
	comment: {},
	search: {},
	history: [],
};

const actionHandler = {
    [SITE_INDEX]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			index: error ? [] : payload
		};
	},
	[SITE_CHANNEL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			channel: error ? [] : payload
		};
	},
	[SITE_COMMENT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			comment: error ? {} : {
				...payload
			},
		};
	},
	[SITE_UPLOAD]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[SITE_SEARCH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			search: error ? {} : {
				...payload
			},
		};
	},
	[SITE_SEARCH_CLEAR]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[SITE_SEARCH_CLEARALL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[SITE_SEARCH_HISTORY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			history: error ? []: payload,
		};
	},
};

export default createReducer(initialState, actionHandler);