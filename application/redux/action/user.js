import {createAction} from 'redux-actions';

const {USER, USER_ACCOUNT, USER_REMIND, USER_MESSAGE, USER_MESSAGE_UNREAD, USER_MESSAGE_OPERATE, USER_LEVEL, USER_STUDY, USER_STUDY_STAT, USER_STUDY_SYNC, USER_STUDY_ARTICLE_SYNC, USER_CREDIT, USER_INTEGRAL, USER_EXCHANGE, USER_BALANCE, USER_REWARD_INTEGRAL, USER_REWARD, USER_CERT, USER_MEDAL, USER_BOOK, USER_UNBOOK, USER_LOG, USER_SHARE, USER_COLLECT, USER_UNCOLLECT, USER_COLLECT_ITEM, USER_COLLECT_COURSE, USER_FOLLOW, USER_FOLLOW_CONTENT, USER_UNFOLLOW_CONTENT, USER_FOLLOW_TEACHER, USER_UNFOLLOW_TEACHER, USER_COMMENT, USER_LIKE_COMMENT, USER_UNLIKE_COMMENT, USER_LIKE_COURSE, USER_UNLIKE_COURSE, USER_COURSE, USER_TASK, USER_SQUAD, USER_ADDRESS, USER_SAVE_ADDRESS, USER_FIRST_ADDRESS, USER_REMOVE_ADDRESS, USER_FEEDBACK, FEEDBACK,SHAREVOD} = require('../key').default;

import * as userService from '../service/user';

export const user = createAction(USER, async() => {
	return await userService.user();
});

export const account = createAction(USER_ACCOUNT, userService.account, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const remind = createAction(USER_REMIND, async(page) => {
	return await userService.remind(page);
});

export const message = createAction(USER_MESSAGE, async(page) => {
	return await userService.message(page);
});

export const unread = createAction(USER_MESSAGE_UNREAD, async() => {
	return await userService.unread();
});

export const messageOperate = createAction(USER_MESSAGE_OPERATE, userService.messageOperate, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const level = createAction(USER_LEVEL, async() => {
	return await userService.level();
});

export const study = createAction(USER_STUDY, async(status, page) => {
	return await userService.study(status, page);
});

export const stat = createAction(USER_STUDY_STAT, async() => {
	return await userService.stat();
});

export const studySync = createAction(USER_STUDY_SYNC, userService.studySync, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const studyArticleSync = createAction(USER_STUDY_ARTICLE_SYNC, userService.studyArticleSync, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const credit = createAction(USER_CREDIT, async(page) => {
	return await userService.credit(page);
});

export const integral = createAction(USER_INTEGRAL, async(itype, page) => {
	return await userService.integral(itype, page);
});

export const exchange = createAction(USER_EXCHANGE, userService.exchange, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const balance = createAction(USER_BALANCE, async(type, page) => {
	return await userService.balance(type, page);
});

export const rewardIntegral = createAction(USER_REWARD_INTEGRAL, async(itype, page) => {
	return await userService.rewardIntegral(itype, page);
});

export const reward = createAction(USER_REWARD, userService.reward, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const cert = createAction(USER_CERT, async() => {
	return await userService.cert();
});

export const medal = createAction(USER_MEDAL, async() => {
	return await userService.medal();
});

export const book = createAction(USER_BOOK, userService.book, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const unbook = createAction(USER_UNBOOK, userService.unbook, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const log = createAction(USER_LOG, userService.log, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const share = createAction(USER_SHARE, userService.share, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const collect = createAction(USER_COLLECT, userService.collect, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const uncollect = createAction(USER_UNCOLLECT, userService.uncollect, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const collectCourse = createAction(USER_COLLECT_COURSE, async(keyword, cctype, status, page) => {
	return await userService.collectCourse(keyword, cctype, status, page);
});

export const collectItem = createAction(USER_COLLECT_ITEM, async(keyword, ctype, page) => {
	return await userService.collectItem(keyword, ctype, page);
});

export const follow = createAction(USER_FOLLOW, async(ctype, page) => {
	return await userService.follow(ctype, page);
});

export const followContent = createAction(USER_FOLLOW_CONTENT, userService.followContent, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const unfollowContent = createAction(USER_UNFOLLOW_CONTENT, userService.unfollowContent, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const followTeacher = createAction(USER_FOLLOW_TEACHER, userService.followTeacher, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const unfollowTeacher = createAction(USER_UNFOLLOW_TEACHER, userService.unfollowTeacher, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const comment = createAction(USER_COMMENT, userService.comment, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const likeComment = createAction(USER_LIKE_COMMENT, userService.likeComment, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const unlikeComment = createAction(USER_UNLIKE_COMMENT, userService.unlikeComment, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const likeCourse = createAction(USER_LIKE_COURSE, userService.likeCourse, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const unlikeCourse = createAction(USER_UNLIKE_COURSE, userService.unlikeCourse, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const course = createAction(USER_COURSE, async(page) => {
	return await userService.course(page);
});

export const task = createAction(USER_TASK, async() => {
	return await userService.task();
});

export const squad = createAction(USER_SQUAD, async(stype, page) => {
	return await userService.squad(stype, page);
});

export const address = createAction(USER_ADDRESS, async() => {
	return await userService.address();
});

export const saveAddress = createAction(USER_SAVE_ADDRESS, userService.saveAddress, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const firstAddress = createAction(USER_FIRST_ADDRESS, userService.firstAddress, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const removeAddress = createAction(USER_REMOVE_ADDRESS, userService.removeAddress, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const feedback = createAction(USER_FEEDBACK, async(page) => {
	return await userService.feedback(page);
});

export const publishFeedback = createAction(FEEDBACK, userService.publishFeedback, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const shareVod = createAction(SHAREVOD, userService.shareVod, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});