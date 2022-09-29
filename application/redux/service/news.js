import * as request from '../../util/net';

export function index(page) {
	return request.get('/article', {
		page: page,
	});
}

export function special(page) {
	return request.get('/article/special', {
		page: page,
	});
}

export function info(news_id) {
	return request.get('/article/' + news_id, {
	});
}

export function relation(news_id) {
    return request.get('/article/relation/' + news_id, {
	});
}

export function comment(news_id, sort, page) {
	return request.get('/article/comment/' + news_id, {
		sort: sort,
		page: page,
	});
}

export function about({type}) {
	return request.get('/article/system/' + type, {
	});
}