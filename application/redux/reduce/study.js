import createReducer from '../../util/reduce';

const {STUDY_RANK, STUDY_PLAN, STUDY_PLAN_INFO, STUDY_PLAN_ACCEPT, STUDY_PLAN_STATUS} = require('../key').default;

const initialState = {
	rank: [],
	plan: {},
	plan_info: [],
};

const actionHandler = {
	[STUDY_RANK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			rank: error ? [] : payload,
		};
	},
	[STUDY_PLAN]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			plan: error ? {} : {
				...payload
			},
		};
	},
	[STUDY_PLAN_INFO]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			plan_info: error ? [] : payload,
		};
	},
	[STUDY_PLAN_ACCEPT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[STUDY_PLAN_STATUS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
};

export default createReducer(initialState, actionHandler);