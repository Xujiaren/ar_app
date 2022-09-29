import * as request from '../../util/net';

export function index(page) {
	return request.get('/group/punch/page', {
        page: page,
	});
}

export function info(activity_id) {
	return request.get('/group/punch/' + activity_id, {
	});
}

export function publish({title, content, endTime, isPublic, activityImg, isMust}) {
    return request.post('/group/punch/create', {
        title: title,
        content: content,
        endTime: endTime,
        isPublic: isPublic,
        activityImg: activityImg,
        isMust: isMust,
    })
}

export function sign({activity_id, content, gallery}) {
    return request.post('/user/punch/' + activity_id, {
        content: content,
        gallery: gallery,
    })
}

export function comment(activity_id, page) {
    return request.get('/group/punch/comment/' + activity_id, {
        page: page,
	});
}

export function reply({comment_id, content}) {
    return request.post('/group/punch/comment/' + comment_id, {
        content: content,
	});
}

export function member(activity_id, joinType, page) {
    return request.get('/group/punch/join/user/' + activity_id, {
        joinType: joinType,
        page: page,
	});
}

export function action({activity_id, joinId, action}) {
    return request.post('/group/punch/user/review', {
        activity_id: activity_id,
        joinId: joinId,
        action: action,
	});
}

export function apply({activity_id, content}) {
    return request.post('/user/punch/apply/' + activity_id, {
        content: content,
	});
}

export function exit({activity_id}) {
    return request.post('/user/punch/drop/' + activity_id, {
	});
}

export function user(is_pass, page) {
    return request.get('/user/punch/have', {
        is_pass: is_pass,
        page: page,
	});
}