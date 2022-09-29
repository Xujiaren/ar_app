import createReducer from '../../util/reduce';

const {CONFIG, CONFIG_OSS, CONFIG_AD, CONFIG_POP_AD, CONFIG_GROUP_AD, CONFIG_CATEGORY_ASK, CONFIG_CATEGORY_COURSE, CONFIG_CATEGORY_FEEDBACK, CONFIG_GIFT, CONFIG_RECHARGE, CONFIG_TIP} = require('../key').default;

const initialState = {
	config: {},
	ad: [],
	pop_ad: [],
	group_ad: [],
	category_ask: [],
	category_course: [],
	category_feedback: [],
	gift: [],
	recharge: [],
};

const actionHandler = {
	[CONFIG]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			config: error ? {} : {
				...payload
			},
		};
	},
	[CONFIG_OSS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
    [CONFIG_AD]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			ad: error ? [] : payload
		};
	},
	[CONFIG_POP_AD]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			pop_ad: error ? [] : payload
		};
	},
	[CONFIG_GROUP_AD]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			group_ad: error ? [] : payload
		};
	},
	[CONFIG_CATEGORY_ASK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			category_ask: error ? [] : payload
		};
	},
	[CONFIG_CATEGORY_COURSE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			category_course: error ? [] : payload
		};
	},
	[CONFIG_CATEGORY_FEEDBACK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			category_feedback: error ? [] : payload
		};
	},
	[CONFIG_GIFT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			gift: error ? [] : payload
		};
	},
	[CONFIG_RECHARGE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			recharge: error ? [] : payload
		};
	},
	[CONFIG_TIP]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
};

export default createReducer(initialState, actionHandler);