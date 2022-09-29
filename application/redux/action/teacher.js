import {createAction} from 'redux-actions';

const {TEACHER_INDEX, TEACHER_RECOMM, TEACHER_INFO, TEACHER_APPLY, TEACHER_APPLY_CORP, TEACHER_APPLY_INFO, TEACHER_CERT} = require('../key').default;

import * as teacherService from '../service/teacher';

export const index = createAction(TEACHER_INDEX, async(page) => {
	return await teacherService.index(page);
});

export const recomm = createAction(TEACHER_RECOMM, async() => {
	return await teacherService.recomm();
});

export const info = createAction(TEACHER_INFO, async(teacher_id) => {
	return await teacherService.info(teacher_id);
});

export const apply = createAction(TEACHER_APPLY, teacherService.apply, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const corpApply = createAction(TEACHER_APPLY_CORP, teacherService.corpApply, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const applyInfo = createAction(TEACHER_APPLY_INFO, async(page) => {
	return await teacherService.applyInfo();
});

export const cert = createAction(TEACHER_CERT, async() => {
	return await teacherService.cert();
});
