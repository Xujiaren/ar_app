import {createAction} from 'redux-actions';

const {STUDY_RANK, STUDY_PLAN,  STUDY_PLAN_INFO, STUDY_PLAN_ACCEPT, STUDY_PLAN_STATUS} = require('../key').default;

import * as studyService from '../service/study';

export const rank = createAction(STUDY_RANK, async(dayType) => {
	return await studyService.rank(dayType);
});

export const plan = createAction(STUDY_PLAN, async(page) => {
	return await studyService.plan(page);
});

export const planInfo = createAction(STUDY_PLAN_INFO, async(plan_id) => {
	return await studyService.planInfo(plan_id);
});

export const accept = createAction(STUDY_PLAN_ACCEPT, studyService.accept, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const planStatus = createAction(STUDY_PLAN_STATUS, studyService.planStatus, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});