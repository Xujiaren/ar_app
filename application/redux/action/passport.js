import {createAction} from 'redux-actions';

const {ISCORP, LOGIN, TOKEN, VCODE, LOGOUT, CLOSE, SWITCH_CARD, WECHAT_LOGIN, APPLE_LOGIN, BIND_MOBILE,LOGIN_LOG,} = require('../key').default;

import * as passportService from '../service/passport';

export const iscorp = createAction(ISCORP, passportService.iscorp, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const login = createAction(LOGIN, passportService.login, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const token = createAction(TOKEN, passportService.token, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const vcode = createAction(VCODE, passportService.vcode, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const logout = createAction(LOGOUT, passportService.logout, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const close = createAction(CLOSE, passportService.close, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const swicthCard = createAction(SWITCH_CARD, passportService.swicthCard, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const wechatLogin = createAction(WECHAT_LOGIN, passportService.wechatLogin, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const appleLogin = createAction(APPLE_LOGIN, passportService.appleLogin, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const bindMobile = createAction(BIND_MOBILE, passportService.bindMobile, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const LoginLog = createAction(LOGIN_LOG, passportService.LoginLog, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});