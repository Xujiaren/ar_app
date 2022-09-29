import {createAction} from 'redux-actions';

const {ORDER_BUY, ORDER_RECHARGE} = require('../key').default;
import * as orderService from '../service/order';

export const buy = createAction(ORDER_BUY, orderService.buy, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const recharge = createAction(ORDER_RECHARGE, orderService.recharge, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});