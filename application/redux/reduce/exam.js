import createReducer from '../../util/reduce';

const {EXAM_REVIEW, EXAM_TEST, EXAM_MUST, EXAM_USER, EXAM_USER_WRONG, EXAM_INFO, EXAM_ANSWER} = require('../key').default;

const initialState = {
    review: {},
    test: {},
	must: [],
    paper: {},
    wtest: {},
    info: {},
};

const actionHandler = {
	[EXAM_REVIEW]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			review: error ? {} : {
				...payload
			},
		};
	},
	[EXAM_TEST]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			test: error ? {} : {
				...payload
			},
		};
	},
	[EXAM_MUST]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			must: error ? [] : payload,
		};
	},
	[EXAM_USER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            paper: error ? {} : {
                ...payload,
            }
		};
    },
    [EXAM_USER_WRONG]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            wtest: error ? {} : {
                ...payload,
            }
		};
    },
    [EXAM_INFO]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            info: error ? {} : {
                ...payload,
            }
		};
	},
	[EXAM_ANSWER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
};

export default createReducer(initialState, actionHandler);