import * as request from '../../util/net';

export function index(category_id, ccategory_id, internal_category_id, ctype, sort, page) {
	return request.get('/course', {
		category_id: category_id,
		ccategory_id: ccategory_id,
		internal_category_id: internal_category_id,
		ctype: ctype,
		sort: sort,
		page: page,
	});
}

export function recomm() {
	return request.get('/course/recommend', {
	});
}

export function live(status, sort, page) {
	return request.get('/course/live', {
		status: status,
		sort: sort,
		page: page,
	});
}

export function stat({course_id, duration}) {
	return request.get('/course/live/leave/' + course_id, {
		duration: duration,
	});
}

export function info(course_id) {
	return request.get('/course/' + course_id, {
	});
}

export function comment(course_id, sort, page) {
	return request.get('/course/comment/' + course_id, {
		sort: sort,
		page: page,
	});
}

export function verify({media_id}) {
	return request.post('/course/verify', {
		media_id: media_id
	});
}

export function score({course_id, score, teacher_score}) {
	return request.post('/user/comment/course/' + course_id, {
		score: score,
		teacher_score: teacher_score,
	});
}

export function goods(course_id) {
	return request.get('/course/live/goods', {
		course_id: course_id,
	});
}

export function shareGoods({fromuid, sku_code}) {
	return request.get('/course/share/goods/url', {
		fromuid: fromuid,
		sku_code: sku_code,
	});
}

export function map(page) {
	return request.get('/course/map/get', {
		page: page,
	});
}

export function mapInfo(map_id) {
	return request.get('/course/map', {
		mapId: map_id,
	});
}

export function levelStatus({level_id}) {
	return request.get('/course/map/level/status', {
		levelId: level_id,
	});
}
export function getRelated(limit,course_id) {
	return request.get('/course/related/'+course_id, {
		limit
	});
}