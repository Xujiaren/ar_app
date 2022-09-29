import {createAction} from 'redux-actions';

const {SITE_INDEX, SITE_CHANNEL, SITE_COMMENT, SITE_UPLOAD, SITE_SEARCH, SITE_SEARCH_HISTORY, SITE_SEARCH_CLEAR, SITE_SEARCH_CLEARALL} = require('../key').default;

import * as siteService from '../service/site';

export const index = createAction(SITE_INDEX, async() => {
	return await siteService.index();
});

export const channel = createAction(SITE_CHANNEL, async(channel_id, sort) => {
	return await siteService.channel(channel_id, sort);
});

export const comment = createAction(SITE_COMMENT, async(content_id, ctype, sort, page) => {
	return await siteService.comment(content_id, ctype, sort, page);
});

export const upload = createAction(SITE_UPLOAD, siteService.upload, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const search = createAction(SITE_SEARCH, async(keyword) => {
	return await siteService.search(keyword);
});

export const history = createAction(SITE_SEARCH_HISTORY, async() => {
	return await siteService.history();
});

export const clearHistory = createAction(SITE_SEARCH_CLEAR, siteService.clearHistory, ({resolved}) => {
	return {
		resolved
	};
});

export const clearAllHistory = createAction(SITE_SEARCH_CLEARALL, siteService.clearAllHistory, ({resolved}) => {
	return {
		resolved
	};
});