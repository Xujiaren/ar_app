import {createAction} from 'redux-actions';

const {GROUP_INDEX, GROUP_INFO, GROUP_PUBLISH, GROUP_SIGN, GROUP_COMMENT, GROUP_REPLY, GROUP_MEMBER, GROUP_ACTION, GROUP_APPLY, GROUP_EXIT, GROUP_USER} = require('../key').default;

import * as groupService from '../service/group';

export const index = createAction(GROUP_INDEX, async(page) => {
	return await groupService.index(page);
});

export const info = createAction(GROUP_INFO, async(activity_id) => {
	return await groupService.info(activity_id);
});

export const publish = createAction(GROUP_PUBLISH, groupService.publish, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const sign = createAction(GROUP_SIGN, groupService.sign, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const comment = createAction(GROUP_COMMENT, async(activity_id, page) => {
	return await groupService.comment(activity_id, page);
});

export const reply = createAction(GROUP_REPLY, groupService.reply, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const member = createAction(GROUP_MEMBER, async(activity_id, joinType, page) => {
	return await groupService.member(activity_id, joinType, page);
});

export const action = createAction(GROUP_ACTION, groupService.action, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const apply = createAction(GROUP_APPLY, groupService.apply, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const exit = createAction(GROUP_EXIT, groupService.exit, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const user = createAction(GROUP_USER, async(is_pass, page) => {
	return await groupService.user(is_pass, page);
});