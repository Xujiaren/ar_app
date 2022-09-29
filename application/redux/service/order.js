import * as request from '../../util/net';

export function buy({from_uid, pay_type, course_id, chapter_id}) {
	return request.post('/order/course/submit',{
        from_uid: from_uid,
        pay_type: pay_type,
        course_id: course_id,
        chapter_id: chapter_id,
	});
}

export function recharge({pay_type, goods_id, goods_number, remark, transaction_id, payload}) {
	return request.post('/order/recharge',{
        pay_type: pay_type,
        goods_id: goods_id,
        goods_number: goods_number,
        remark: remark,
        transactionId: transaction_id,
        payload: payload,
	});
}