import * as request from '../../util/net';

export function index(category_id, keyword, sort, page) {
	return request.get('/ask', {
        category_id: category_id,
        keyword: keyword,
        sort: sort,
		page: page,
	});
}

export function info(ask_id) {
    return request.get('/ask/' + ask_id, {
	});
}

export function reply(ask_id, page) {
    return request.get('/ask/reply/' + ask_id, {
        page: page,
	});
}

export function publish({category_id, title, content, pics, videos}) {
    return request.post('/ask/ask/publish', {
        category_id: category_id,
        title: title,
        content: content,
        pics: pics,
        videos: videos,
    })
}

export function recomm(ask_id) {
    return request.get('/ask/invite', {
        ask_id: ask_id,
	});
}

export function invite({target_uid, ask_id}) {
    return request.post('/ask/answerInvite', {
        target_uid: target_uid,
        ask_id: ask_id,
    })
}

export function answer({ask_id, fuser_id, content, pics}) {
    return request.post('/ask/reply/' + ask_id, {
        fuser_id: fuser_id,
        content: content,
        pics: pics,
    })
}

export function userAsk(page) {
    return request.get('/ask/user/ask', {
        page: page,
    })
}

export function userAnswer(page) {
    return request.get('/ask/user/answer', {
        page: page,
    })
}