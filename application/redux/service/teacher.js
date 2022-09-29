import * as request from '../../util/net';

export function index(page) {
	return request.get('/teacher', {
		page: page,
	});
}

export function recomm() {
	return request.get('/teacher/recomm', {
	});
}

export function info(teacher_id) {
	return request.get('/teacher/' + teacher_id, {
	});
}

export function apply({gallerys}) {
	return request.post('/user/teacher/apply', {
		gallerys: gallerys,
	});
}

export function corpApply({company_name, system_name, job, name, sex, birthday, school, edu, specialty, work_years, this_work_years, train_cert, show_value, train_exp, strong}) {
	return request.post('/user/teacher/apply/internal', {
		company_name: company_name,
		system_name: system_name,
		job: job,
		name: name,
		sex: sex,
		birthday: birthday,
		school: school,
		edu: edu,
		specialty: specialty,
		work_years: work_years,
		this_work_years: this_work_years,
		train_cert: train_cert,
		show_value: show_value,
		train_exp: train_exp,
		strong: strong,
	})
}

export function applyInfo() {
	return request.get('/user/teacher/applyInfo', {
	});
}

export function cert() {
	return request.get('/user/teacher/cert', {
	});
}