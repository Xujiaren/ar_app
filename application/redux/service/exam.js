import * as request from '../../util/net';

export function review(test_id) {
	return request.get('/exam/review/' + test_id, {
	});
}

export function test(test_id) {
	return request.get('/exam/test/info/', {
        test_id: test_id,
	});
}

export function must() {
	return request.get('/exam/user/must/do/paper', {
	});
}

export function userPaper(status, page) {
	return request.get('/exam/user/paper', {
        page: page,
		status: status,
		ctype: 96,
	});
}

export function wrongTest(page) {
	return request.get('/exam/user/wrong/answer', {
        page: page,
	});
}

export function info(paper_id, levelId) {
	return request.get('/exam/' + paper_id, {
        levelId: levelId,
	});
}

export function answer({test_id, duration, levelId, answer}) {
	return request.post('/user/exam/' + test_id, {
		levelId: levelId,
		duration: duration,
        answer: answer,
	});
}