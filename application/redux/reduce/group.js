import createReducer from '../../util/reduce';

const {GROUP_INDEX, GROUP_INFO, GROUP_PUBLISH, GROUP_SIGN, GROUP_COMMENT, GROUP_REPLY, GROUP_MEMBER, GROUP_ACTION, GROUP_APPLY, GROUP_EXIT, GROUP_USER} = require('../key').default;

const initialState = {
	index: {},
	info: {},
	comment: {},
	member: {},
	user_group: {},
};

const actionHandler = {
	[GROUP_INDEX]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			index: error ? {} : {
				...payload
			},
		};
	},
	[GROUP_INFO]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			info: error ? {} : {
				...payload
			},
		};
	},
	[GROUP_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[GROUP_SIGN]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[GROUP_COMMENT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			comment: error ? {} : {
				...payload
			},
		};
	},
	[GROUP_REPLY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[GROUP_MEMBER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			member: error ? {} : {
				...payload
			},
		};
	},
	[GROUP_ACTION]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[GROUP_APPLY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[GROUP_EXIT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[GROUP_USER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			user_group: error ? {} : {
				...payload
			},
		};
	},
};

export default createReducer(initialState, actionHandler);