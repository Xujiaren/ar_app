import {createAction} from 'redux-actions';

const {ACTIVITY_INDEX, ACTIVITY_INFO, ACTIVITY_JOIN, ACTIVITY_WORK, ACTIVITY_VOTE, ACTIVITY_USER_VOTE, ACTIVITY_PAPER, ACTIVITY_ANSWER, ACTIVITY_FLOP, ACTIVITY_FLOP_REWARD, ACTIVITY_FLOP_LOTTERY, ACTIVITY_FLOP_LOTTERY_RECEIVE} = require('../key').default;

import * as activityService from '../service/activity';

export const index = createAction(ACTIVITY_INDEX, async(keyword, page) => {
	return await activityService.index(keyword, page);
});

export const info = createAction(ACTIVITY_INFO, async(activity_id) => {
	return await activityService.info(activity_id);
});

export const join = createAction(ACTIVITY_JOIN, activityService.join, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const work = createAction(ACTIVITY_WORK, async(activity_id, keyword, page) => {
	return await activityService.work(activity_id, keyword, page);
});

export const vote = createAction(ACTIVITY_VOTE, activityService.vote, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const userVote = createAction(ACTIVITY_USER_VOTE, async(activity_id) => {
	return await activityService.userVote(activity_id);
});

export const paper = createAction(ACTIVITY_PAPER, async(activity_id) => {
	return await activityService.paper(activity_id);
});

export const answer = createAction(ACTIVITY_ANSWER, activityService.answer, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const flop = createAction(ACTIVITY_FLOP, async(activity_id) => {
	return await activityService.flop(activity_id);
});

export const reward = createAction(ACTIVITY_FLOP_REWARD, async(page) => {
	return await activityService.reward(page);
});

export const lottery = createAction(ACTIVITY_FLOP_LOTTERY, activityService.lottery, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const lotteryReceive = createAction(ACTIVITY_FLOP_LOTTERY_RECEIVE, activityService.lotteryReceive, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});