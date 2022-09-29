import createReducer from '../../util/reduce';

const {USER, USER_ACCOUNT, USER_REMIND, USER_MESSAGE, USER_MESSAGE_UNREAD, USER_MESSAGE_OPERATE, USER_LEVEL, USER_STUDY, USER_STUDY_STAT, USER_STUDY_SYNC, USER_STUDY_ARTICLE_SYNC, USER_CREDIT, USER_INTEGRAL, USER_EXCHANGE, USER_BALANCE, USER_REWARD_INTEGRAL, USER_REWARD, USER_MEDAL, USER_CERT, USER_BOOK, USER_UNBOOK, USER_LOG, USER_SHARE, USER_COLLECT, USER_UNCOLLECT, USER_COLLECT_ITEM, USER_COLLECT_COURSE, USER_FOLLOW, USER_FOLLOW_CONTENT, USER_UNFOLLOW_CONTENT, USER_FOLLOW_TEACHER, USER_UNFOLLOW_TEACHER, USER_COMMENT, USER_LIKE_COMMENT, USER_UNLIKE_COMMENT, USER_LIKE_COURSE, USER_UNLIKE_COURSE, USER_COURSE, USER_TASK, USER_SQUAD, USER_ADDRESS, USER_SAVE_ADDRESS, USER_FIRST_ADDRESS, USER_REMOVE_ADDRESS, USER_FEEDBACK, FEEDBACK,SHAREVOD} = require('../key').default;

const initialState = {
	user: {},
	remind: {},
	message: {},
	unread: {},
	level: [],
	study: {},
	stat: {},
	credit: {},
	integral: {},
	balance: {},
	reward: {},
	medal: [],
	cert: [],
	collect_item: {},
	collect_course: {},
	follow: {},
	task: [],
	squad: {},
	course: {},
	address: [],
	feedback: {},
};

const actionHandler = {
    [USER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			user: error ? {} : {
                ...payload
            }
		};
	},
	[USER_ACCOUNT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_REMIND]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			remind: error ? {} : {
                ...payload
            }
		};
	},
	[USER_MESSAGE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			message: error ? {} : {
                ...payload
            }
		};
	},
	[USER_MESSAGE_UNREAD]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			unread: error ? {} : {
                ...payload
            }
		};
	},
	[USER_MESSAGE_OPERATE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_LEVEL]:  (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			level: error ? [] : payload,
		};
	},
	[USER_STUDY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			study: error ? {} : {
                ...payload
            }
		};
	},
	[USER_STUDY_SYNC]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_STUDY_ARTICLE_SYNC]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_STUDY_STAT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			stat: error ? {} : {
                ...payload
            }
		};
	},
	[USER_CREDIT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			credit: error ? {} : {
                ...payload
            }
		};
	},
	[USER_INTEGRAL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			integral: error ? {} : {
                ...payload
            }
		};
	},
	[USER_EXCHANGE]:  (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_BALANCE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			balance: error ? {} : {
                ...payload
            }
		};
	},
	[USER_REWARD_INTEGRAL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			reward: error ? {} : {
                ...payload
            }
		};
	},
	[USER_REWARD]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_CERT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			cert: error ? [] : payload
		};
	},
	[USER_MEDAL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			medal: error ? [] : payload
		};
	},
	[USER_BOOK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_UNBOOK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_LOG]:  (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_SHARE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_COLLECT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_UNCOLLECT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_COLLECT_ITEM]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			collect_item: error ? {} : {
                ...payload
            }
		};
	},
	[USER_COLLECT_COURSE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			collect_course: error ? {} : {
                ...payload
            }
		};
	},
	[USER_FOLLOW]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			follow: error ? {} : {
                ...payload
            }
		};
	},
	[USER_FOLLOW_CONTENT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_UNFOLLOW_CONTENT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_FOLLOW_TEACHER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_UNFOLLOW_TEACHER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_COMMENT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_LIKE_COMMENT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_UNLIKE_COMMENT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_LIKE_COURSE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_UNLIKE_COURSE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_COURSE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			course: error ? {} : {
                ...payload
            }
		};
	},
	[USER_TASK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			task: error ? [] : payload,
		};
	},
	[USER_SQUAD]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			squad: error ? {} : {
                ...payload
            }
		};
	},
	[USER_ADDRESS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			address: error ? [] : payload,
		};
	},
	[USER_SAVE_ADDRESS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_FIRST_ADDRESS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_REMOVE_ADDRESS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_FEEDBACK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			feedback: error ? {} : {
                ...payload
            }
		};
	},
	[FEEDBACK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[SHAREVOD]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
};

export default createReducer(initialState, actionHandler);