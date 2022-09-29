import {createAction} from 'redux-actions';

const {COURSE_INDEX, COURSE_RECOMM, COURSE_LIVE, COURSE_LIVE_STAT, COURSE_PLAYBACK, COURSE_INFO, COURSE_COMMENT, COURSE_VERIFY, COURSE_SCORE, COURSE_GOODS, COURSE_GOODS_SHARE, COURSE_MAP,  COURSE_MAP_INFO, COURSE_LEVEL_STATUS,RELATED_GET} = require('../key').default;

import * as courseService from '../service/course';

export const index = createAction(COURSE_INDEX, async(category_id, ccategory_id, internal_category_id, ctype, sort, page) => {
	return await courseService.index(category_id, ccategory_id, internal_category_id, ctype, sort, page);
});

export const recomm = createAction(COURSE_RECOMM, async() => {
	return await courseService.recomm();
});

export const live = createAction(COURSE_LIVE, async(status, sort, page) => {
	return await courseService.live(status, sort, page);
});

export const stat = createAction(COURSE_LIVE_STAT, courseService.stat, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const playback = createAction(COURSE_PLAYBACK, async(sort, page) => {
	return await courseService.live(1, sort, page);
});

export const info = createAction(COURSE_INFO, async(course_id) => {
	return await courseService.info(course_id);
});

export const comment = createAction(COURSE_COMMENT, async(course_id, sort, page) => {
	return await courseService.comment(course_id, sort, page);
});

export const verify = createAction(COURSE_VERIFY, courseService.verify, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const score = createAction(COURSE_SCORE, courseService.score, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const goods = createAction(COURSE_GOODS, async(course_id) => {
	return await courseService.goods(course_id);
});

export const shareGoods = createAction(COURSE_GOODS_SHARE, courseService.shareGoods, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const map = createAction(COURSE_MAP, async(page) => {
	return await courseService.map(page);
});

export const mapInfo = createAction(COURSE_MAP_INFO, async(map_id) => {
	return await courseService.mapInfo(map_id);
});

export const levelStatus = createAction(COURSE_LEVEL_STATUS, courseService.levelStatus, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});
export const getRelated = createAction(RELATED_GET, async(limit,course_id) => {
	return await courseService.getRelated(limit,course_id);
});