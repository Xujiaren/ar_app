import createReducer from '../../util/reduce';

const {COURSE_INDEX, COURSE_RECOMM, COURSE_LIVE, COURSE_LIVE_STAT, COURSE_PLAYBACK, COURSE_INFO, COURSE_COMMENT, COURSE_VERIFY, COURSE_SCORE, COURSE_GOODS, COURSE_GOODS_SHARE, COURSE_MAP,  COURSE_MAP_INFO, COURSE_LEVEL_STATUS,RELATED_GET} = require('../key').default;

const initialState = {
	index: {},
	recomm: [],
	live: {},
	playback: {},
	course: {},
	comment: {},
	goods: [],
	map: {},
	map_info: [],
	related:[],
};

const actionHandler = {
    [COURSE_INDEX]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			index: error ? {} : {
				...payload
			},
		};
	},
	[COURSE_RECOMM]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			recomm: error ? [] : payload,
		};
	},
	[COURSE_LIVE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			live: error ? {} : {
				...payload
			},
		};
	},
	[COURSE_LIVE_STAT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[COURSE_PLAYBACK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			playback: error ? {} : {
				...payload
			},
		};
	},
	[COURSE_INFO]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			course: error ? {} : {
				...payload
			},
		};
	},
	[COURSE_COMMENT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			comment: error ? {} : {
				...payload
			},
		};
	},
	[COURSE_VERIFY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[COURSE_SCORE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[COURSE_GOODS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			goods: error ? [] : payload,
		};
	},
	[COURSE_GOODS_SHARE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[COURSE_MAP]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			map: error ? {} : {
				...payload
			},
		};
	},
	[COURSE_MAP_INFO]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			map_info: error ? {} : payload,
		};
	},
	[COURSE_LEVEL_STATUS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[RELATED_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			related: error ? [] : payload,
		};
	},
};

export default createReducer(initialState, actionHandler);