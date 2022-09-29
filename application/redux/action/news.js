import {createAction} from 'redux-actions';

const {NEWS_INDEX, NEWS_SPECIAL, NEWS_INFO, NEWS_RELATION, NEWS_COMMENT, NEWS_ABOUT} = require('../key').default;

import * as newsService from '../service/news';

export const index = createAction(NEWS_INDEX, async(page) => {
	return await newsService.index(page);
});

export const special = createAction(NEWS_SPECIAL, async(page) => {
	return await newsService.special(page);
});

export const relation = createAction(NEWS_RELATION, async(news_id) => {
	return await newsService.relation(news_id);
});

export const info = createAction(NEWS_INFO, async(news_id) => {
	return await newsService.info(news_id);
});

export const comment = createAction(NEWS_COMMENT, async(news_id, sort, page) => {
	return await newsService.comment(news_id, sort, page);
});

export const about = createAction(NEWS_ABOUT, newsService.about, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});