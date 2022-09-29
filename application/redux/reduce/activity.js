import createReducer from '../../util/reduce';

const {ACTIVITY_INDEX, ACTIVITY_INFO, ACTIVITY_JOIN, ACTIVITY_WORK, ACTIVITY_VOTE, ACTIVITY_USER_VOTE, ACTIVITY_PAPER, ACTIVITY_ANSWER, ACTIVITY_FLOP, ACTIVITY_FLOP_REWARD, ACTIVITY_FLOP_LOTTERY, ACTIVITY_FLOP_LOTTERY_RECEIVE} = require('../key').default;

const initialState = {
	index: {},
	info: {},
	work: {},
	user_vote: 0,
	paper: [],
	flop: {},
	reward: {},
};

const actionHandler = {
	[ACTIVITY_INDEX]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			index: error ? {} : {
				...payload
			},
		};
	},
	[ACTIVITY_INFO]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			info: error ? {} : {
				...payload
			},
		};
	},
	[ACTIVITY_JOIN]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[ACTIVITY_WORK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			work: error ? {} : {
				...payload
			},
		};
	},
	[ACTIVITY_VOTE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[ACTIVITY_USER_VOTE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			user_vote: error ? 0 : payload,
		};
	},
	[ACTIVITY_PAPER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			paper: error ? [] : payload,
		};
	},
	[ACTIVITY_ANSWER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[ACTIVITY_FLOP]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			flop: error ? {} : {
				...payload
			},
		};
	},
	[ACTIVITY_FLOP_REWARD]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			reward: error ? {} : {
				...payload
			},
		};
	},
	[ACTIVITY_FLOP_LOTTERY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[ACTIVITY_FLOP_LOTTERY_RECEIVE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
};

export default createReducer(initialState, actionHandler);