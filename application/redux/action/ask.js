import {createAction} from 'redux-actions';

const {ASK_INDEX, ASK_INFO, ASK_REPLY, ASK_PUBLISH, ASK_ANSWER, ASK_RECOMM_USER, ASK_INVITE, ASK_USER_ASK, ASK_USER_ANSWER} = require('../key').default;

import * as askService from '../service/ask';

export const index = createAction(ASK_INDEX, async(category_id, keyword, sort, page) => {
	return await askService.index(category_id, keyword, sort, page);
});

export const info = createAction(ASK_INFO, async(ask_id) => {
	return await askService.info(ask_id);
});

export const reply = createAction(ASK_REPLY, async(ask_id, page) => {
	return await askService.reply(ask_id, page);
});

export const publish = createAction(ASK_PUBLISH, askService.publish, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const answer = createAction(ASK_ANSWER, askService.answer, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const recomm = createAction(ASK_RECOMM_USER, async(ask_id) => {
	return await askService.recomm(ask_id);
});


export const invite = createAction(ASK_INVITE, askService.invite, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const userAsk = createAction(ASK_USER_ASK, async(page) => {
	return await askService.userAsk(page);
});

export const userAnswer = createAction(ASK_USER_ANSWER, async(page) => {
	return await askService.userAnswer(page);
});