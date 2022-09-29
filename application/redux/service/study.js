import * as request from '../../util/net';

export function rank(dayType) {
	return request.get('/study/rank/day', {
        dayType: dayType,
	});
}

export function plan(page) {
	return request.get('/study/plan', {
        page: page,
	});
}

export function planInfo(plan_id) {
	return request.get('/study/plan/info/' + plan_id, {
        
	});
}

export function accept({plan_id}) {
	return request.post('/user/plan/accept', {
        planId: plan_id,
	});
}

export function planStatus({plan_id}) {
	return request.get('/study/plan/user/' + plan_id, {
        
	});
}