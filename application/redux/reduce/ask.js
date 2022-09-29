import createReducer from '../../util/reduce';

const {ASK_INDEX, ASK_INFO, ASK_REPLY, ASK_PUBLISH, ASK_ANSWER, ASK_RECOMM_USER, ASK_INVITE, ASK_USER_ASK, ASK_USER_ANSWER} = require('../key').default;

const initialState = {
	index: {},
	ask: {},
	reply: {},
    recomm: [],
	user_ask: {},
	user_answer: {},
};

const actionHandler = {
	[ASK_INDEX]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			index: error ? {} : {
				...payload
			},
		};
	},
    [ASK_INFO]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			ask: error ? {} : {
				...payload
			},
		};
	},
	[ASK_REPLY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			reply: error ? {} : {
				...payload
			},
		};
    },
    [ASK_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [ASK_ANSWER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [ASK_RECOMM_USER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			recomm: error ? [] : payload,
		};
    },
    [ASK_INVITE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [ASK_USER_ASK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			user_ask: error ? {} : {
				...payload
			},
		};
	},
	[ASK_USER_ANSWER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			user_answer: error ? {} : {
				...payload
			},
		};
	},
};

export default createReducer(initialState, actionHandler);