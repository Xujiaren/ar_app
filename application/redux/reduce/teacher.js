import createReducer from '../../util/reduce';

const {TEACHER_INDEX, TEACHER_RECOMM, TEACHER_INFO, TEACHER_APPLY, TEACHER_APPLY_CORP, TEACHER_APPLY_INFO, TEACHER_CERT} = require('../key').default;

const initialState = {
	index: {},
	recomm: [],
	info: {},
	apply_info: {},
	cert: [],
};

const actionHandler = {
	[TEACHER_INDEX]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			index: error ? {} : {
				...payload
			},
		};
	},
	[TEACHER_RECOMM]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			recomm: error ? [] : payload,
		};
	},
	[TEACHER_INFO]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			info: error ? {} : {
				...payload
			},
		};
	},
	[TEACHER_APPLY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[TEACHER_APPLY_CORP]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[TEACHER_APPLY_INFO]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			apply_info: error ? {} : (payload ? {
				...payload
			} : {}),
		};
	},
	[TEACHER_CERT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			cert: error ? [] : payload,
		};
	},
};

export default createReducer(initialState, actionHandler);