import createReducer from '../../util/reduce';

const {NEWS_INDEX, NEWS_SPECIAL, NEWS_INFO, NEWS_RELATION, NEWS_COMMENT, NEWS_ABOUT} = require('../key').default;

const initialState = {
	index: {},
	special: {},
    news: {},
    relation: [],
	comment: {},
};

const actionHandler = {
	[NEWS_INDEX]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			index: error ? {} : {
				...payload
			},
		};
	},
	[NEWS_SPECIAL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			special: error ? {} : {
				...payload
			},
		};
    },
    [NEWS_INFO]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			news: error ? {} : {
				...payload
			},
		};
    },
    [NEWS_RELATION]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			relation: error ? [] : payload,
		};
	},
	[NEWS_COMMENT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			comment: error ? {} : {
				...payload
			},
		};
	},
	[NEWS_ABOUT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
};

export default createReducer(initialState, actionHandler);