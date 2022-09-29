import * as request from '../../util/net';

export function index(stype, page) {
	return request.get('/o2o', {
		stype: stype,
		page: page,
	});
}

export function pay({squad_id, pay_type}) {
	return request.post('/o2o/order/' + squad_id, {
		pay_type: pay_type,
	})
}

export function info(squad_id) {
	return request.get('/o2o/' + squad_id, {

	});
}

export function apply({squad_id}) {
    return request.post('/user/squad/' + squad_id, {

	});
}

export function sign({squad_id}) {
    return request.post('/o2o/sign', {
		squad_id: squad_id,
	});
}