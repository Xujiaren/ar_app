import * as request from '../../util/net';
import store from 'react-native-simple-store';

export function iscorp({mobile}) {
	return request.get('/passport/internal/info', {
		mobile: mobile
	})
}

export function login({mobile, code, uniqueId, descriptionType, cardCodes, chiefCode, reg_from}) {
	return request.post('/passport/login',{
		phone: mobile,
		uniqueId: uniqueId,
		descriptionType: descriptionType,
		verifyCode: code,
		cardCodes: cardCodes,
		chiefCode: chiefCode,
		reg_from: reg_from,
	});
}

export function token({token}) {
	global.token = token;
	return store.save('token', token);
}

export function vcode({mobile}) {
	return request.post('/passport/code',{
		phone: mobile,
	});
}

export function logout() {
	global.token = '';
	return store.delete('token');

}

export function close() {
	return request.get('/passport/close',{

	});

}

export function swicthCard({phone, cardCode}) {
	return request.post('/passport/switch',{
		phone: phone,
		cardCode: cardCode,
	});
}

export function wechatLogin({code, fuser}) {
	return request.post('/passport/oauth/wxapp/2',{
		code: code,
		fuser: fuser,
	});
}

export function appleLogin({apple_id, authorization_code, identity_token}) {
	return request.post('/passport/oauth/apple',{
		apple_id: apple_id,
		authorization_code: authorization_code,
		identity_token: identity_token,
	});
}

export function bindMobile({union_id, mobile,code, uniqueId, descriptionType, cardCodes, reg_from}) {
	return request.post('/passport/bind/mobile',{
		union_id: union_id,
		mobile: mobile,
		code:code,
		uniqueId: uniqueId,
		descriptionType: descriptionType,
		cardCodes: cardCodes,
		reg_from: reg_from,
	});
}
export function LoginLog({from}) {
	return request.post('/passport/login/log',{
		from
	});
}