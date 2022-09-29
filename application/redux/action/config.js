import {createAction} from 'redux-actions';

const {CONFIG, CONFIG_OSS, CONFIG_AD, CONFIG_POP_AD, CONFIG_GROUP_AD, CONFIG_CATEGORY_ASK, CONFIG_CATEGORY_COURSE, CONFIG_CATEGORY_FEEDBACK, CONFIG_GIFT, CONFIG_RECHARGE, CONFIG_TIP} = require('../key').default;

import * as configService from '../service/config';

export const config = createAction(CONFIG, async() => {
	return await configService.config();
});

export const oss = createAction(CONFIG_OSS, configService.oss, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const ad = createAction(CONFIG_AD, async(ad_id) => {
	return await configService.ad(ad_id);
});

export const podAd = createAction(CONFIG_POP_AD, async() => {
	return await configService.ad(2);
});

export const groupAd = createAction(CONFIG_GROUP_AD, async() => {
	return await configService.ad(5);
});

export const categoryAsk = createAction(CONFIG_CATEGORY_ASK, async() => {
	return await configService.categoryAsk();
});

export const categoryCourse = createAction(CONFIG_CATEGORY_COURSE, async() => {
	return await configService.categoryCourse();
});

export const categoryFeedback = createAction(CONFIG_CATEGORY_FEEDBACK, async() => {
	return await configService.categoryFeedback();
});

export const gift = createAction(CONFIG_GIFT, async(gtype) => {
	return await configService.gift(gtype);
});

export const recharge = createAction(CONFIG_RECHARGE, async() => {
	return await configService.recharge();
});

export const tip = createAction(CONFIG_TIP, configService.tip, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});