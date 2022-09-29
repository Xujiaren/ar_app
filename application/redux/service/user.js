import * as request from '../../util/net';

export function user() {
	return request.get('/user', {
	});
}

export function account({field,val}) {
	return request.post('/user', {
		field:field,
		val:val,
	});
}

export function unread() {
	return request.get('/user/message/unread', {
	});
}

export function remind(page) {
	return request.get('/user/remind', {
		page: page,
	});
}

export function message(page) {
	return request.get('/user/message', {
		page: page,
	});
}

export function messageOperate({type, message_ids, operate}) {
	return request.post('/user/message/operate', {
		type: type,
		message_ids: message_ids,
		operate: operate,
	});
}

export function level() {
	return request.get('/user/level', {
	});
}

export function study(status, page) {
	return request.get('/user/course', {
		status: status,
		page: page,
	});
}

export function stat() {
	return request.get('/user/study', {
	});
}

export function studySync({levelId, course_id, chapter_id, cchapter_id, duration}) {
	return request.post('/user/learn/' + course_id, {
		levelId: levelId,
		chapter_id: chapter_id,
		cchapter_id: cchapter_id,
		duration: duration,
	});
}

export function studyArticleSync({course_id}) {
	return request.post('/user/learn/article/' + course_id, {

	});
}

export function credit(page) {
	return request.get('/user/credit', {
		page: page,
	});
}

export function integral(itype, page) {
	return request.get('/user/integral', {
		itype: itype,
		page: page,
	});
}

export function exchange({card, changeBalance}) {

	if (global.utype == 0) {
		return request.post('/user/anran/beans/provide', {
			card: card,
			changeBalance: changeBalance,
		});
	} else {
		return request.post('/user/anran/welfare/exchange', {
			integral: changeBalance,
		});
	}
	
}

export function balance(type, page) {
	return request.get('/user/balance', {
		type: type,
		page: page,
	});
}

export function rewardIntegral(itype, page) {
	return request.get('/user/reward', {
		itype: itype,
		page: page,
	});
}

export function reward({gift_id, course_id}) {
	return request.post('/user/reward/' + gift_id, {
		course_id: course_id,
	});
}

export function cert() {
	return request.get('/user/user/cert', {
	});
}

export function medal() {
	return request.get('/user/medal', {
	});
}

export function book({course_id}) {
	return request.post('/user/book/' + course_id, {
		form_id: 'app'
	});
}

export function unbook({course_id}) {
	return request.post('/user/book/remove/' + course_id, {
		form_id: 'app'
	});
}

export function share({ctype, content_id, from_uid}) {
	return request.post('/user/share/' + content_id, {
		ctype: ctype,
		from_uid: from_uid,
	});
}

export function log({log_type, type, device_id, intro, content_id, param, from}) {
	return request.post('/user/log', {
		log_type: log_type,
		type: type,
		device_id: device_id,
		intro: intro,
		content_id: content_id,
		param: param,
		from: from,
	});
}

export function collect({ctype, content_id}) {
	return request.post('/user/collect/' + content_id, {
		ctype: ctype,
	});
}

export function uncollect({ctype, content_id}) {
	return request.post('/user/collect/remove/' + content_id, {
		ctype: ctype,
	});
}

export function collectItem(keyword, ctype, page) {
	return request.get('/user/collect', {
		keyword: keyword,
		ctype: ctype,
		page: page,
	});
}

export function collectCourse(keyword, cctype, status, page) {
	return request.get('/user/collect/course', {
		keyword: keyword,
		cctype: cctype,
		status: status,
		page: page,
	});
}

export function follow(ctype, page) {
	return request.get('/user/follow', {
		ctype: ctype,
		page: page,
	});
}

export function followContent({content_id, ctype}) {
	return request.post('/user/follow/' + content_id, {
		ctype: ctype,
	});
}

export function unfollowContent({content_id, ctype}) {
	return request.post('/user/follow/remove/' + content_id, {
		ctype: ctype,
	});
}

export function followTeacher({teacher_id}) {
	return request.post('/user/follow/teacher/' + teacher_id, {
	});
}

export function unfollowTeacher({teacher_id}) {
	return request.post('/user/follow/teacher/remove/' + teacher_id, {
	});
}

export function comment({ctype, content_id, score, teacher_score, content, gallery}) {
	return request.post('/user/comment/' + content_id, {
		ctype: ctype,
		score: score,
		teacher_score: teacher_score,
		content: content, 
		gallery: gallery,
	});
}

export function likeComment({comment_id}) {
	return request.post('/user/like/comment/' + comment_id, {
	});
}

export function unlikeComment({comment_id}) {
	return request.post('/user/like/comment/remove/' + comment_id, {
	});
}

export function likeCourse({course_id}) {
	return request.post('/user/like/course/' + course_id, {
	});
}

export function unlikeCourse({course_id}) {
	return request.post('/user/like/course/remove/' + course_id, {
	});
}

export function course(page) {
	return request.get('/user/content', {
		page: page,
	});
}

export function task() {
	return request.get('/user/task', {
	});
}

export function squad(stype, page) {
	return request.get('/user/squad', {
		stype: stype,
		page: page,
	});
}

export function address() {
	return request.get('/user/address', {
	});
}

export function saveAddress({address_id, realname, mobile, province, city, district, address, is_first}) {
	return request.post('/user/address', {
		address_id: address_id,
		realname: realname,
		mobile: mobile,
		province: province,
		city: city,
		district: district,
		address: address,
		is_first: is_first,
	});
}

export function firstAddress({address_id}) {
	return request.post('/user/address/first', {
		address_id: address_id,
	});
}

export function removeAddress({address_id}) {
	return request.post('/user/address/remove', {
		address_id: address_id,
	});
}

export function feedback(page) {
	return request.get('/user/feedback', {
		page: page,
	});
}

export function publishFeedback({category_id, mobile, content, gallery, videos}) {
	return request.post('/user/feedback', {
		category_id: category_id,
		mobile: mobile,
		content: content,
		gallery: gallery,
		videos: videos,
	});
}

export function shareVod({course_id}) {
	return request.post('/user/share/course/'+course_id, {
	});
}