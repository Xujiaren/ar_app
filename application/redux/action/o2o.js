import {createAction} from 'redux-actions';

const {O2O_INDEX, O2O_INFO, O2O_PAY, O2O_APPLY, O2O_SIGN} = require('../key').default;

import * as o2oService from '../service/o2o';

export const index = createAction(O2O_INDEX, async(stype, page) => {
	return await o2oService.index(stype, page);
});

export const info = createAction(O2O_INFO, async(squad_id) => {
	return await o2oService.info(squad_id);
});

export const pay = createAction(O2O_PAY, o2oService.pay, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const apply = createAction(O2O_APPLY, o2oService.apply, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const sign = createAction(O2O_SIGN, o2oService.sign, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});