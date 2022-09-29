import {createAction} from 'redux-actions';

const {EXAM_REVIEW, EXAM_TEST, EXAM_MUST, EXAM_USER, EXAM_USER_WRONG, EXAM_INFO, EXAM_ANSWER} = require('../key').default;

import * as examService from '../service/exam';

export const review = createAction(EXAM_REVIEW, async(test_id) => {
	return await examService.review(test_id);
});

export const test = createAction(EXAM_TEST, async(test_id) => {
	return await examService.test(test_id);
});

export const must = createAction(EXAM_MUST, async() => {
	return await examService.must();
});

export const userPaper = createAction(EXAM_USER, async(status, page) => {
	return await examService.userPaper(status, page);
});

export const wrongTest = createAction(EXAM_USER_WRONG, async(page) => {
	return await examService.wrongTest(page);
});

export const info = createAction(EXAM_INFO, async(paper_id, levelId) => {
	return await examService.info(paper_id, levelId);
});

export const answer = createAction(EXAM_ANSWER, examService.answer, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});