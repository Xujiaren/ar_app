import * as request from '../../util/net';

export function index(keyword, page) {
	return request.get('/activity', {
		keyword: keyword,
		page: page,
	});
}

export function info(activity_id) {
	return request.get('/activity/' + activity_id, {

	});
}

export function join({activity_id, user_name, mobile, work_name, work_intro, work_url}) {
	return request.post('/activity/join/' + activity_id, {
		user_name: user_name,
		mobile: mobile,
		work_name: work_name,
		work_intro: work_intro,
		work_url: work_url,
	});
}

export function work(activity_id, keyword, page) {
	return request.get('/activity/joininfo/' + activity_id, {
		keyword: keyword,
		page: page,
	});
}

export function vote({join_id}) {
	return request.post('/activity/vote/' + join_id, {
	});
}

export function userVote(activity_id) {
	return request.get('/activity/vote/' + activity_id, {
	});
}

export function paper(activity_id) {
	return request.get('/activity/' + activity_id + '/paper', {
	});
}

export function answer({activity_id, answer}) {
	return request.post('/activity/' + activity_id + '/answer', {
		answer: answer,
	});
}

export function flop(activity_id) {
	return request.get('/activity/flop/' + activity_id, {
	});
}

export function reward(page) {
	return request.get('/activity/lottery/reward', {
		page: page,
	});
}

export function lottery({activity_id, ts, index}) {
	return request.post('/activity/lottery/' + activity_id, {
		ts: ts,
		index: index,
	});
}

export function lotteryReceive({reward_id, name, mobile, address}) {
	return request.post('/activity/lottery/receive/' + reward_id, {
		realname: name,
		mobile: mobile,
		address: address,
	});
}