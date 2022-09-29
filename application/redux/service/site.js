import * as request from '../../util/net';
import store from 'react-native-simple-store';
import Immutable from 'immutable';

export function index() {
	return request.get('/site/index', {
	});
}

export function channel(channel_id, sort) {
	return request.get('/site/channel/' + channel_id, {
		sort: sort
	});
}

export function comment(content_id, ctype, sort, page) {
	return request.get('/site/comments/' + content_id, {
		ctype: ctype,
		sort: sort,
		page: page,
	});
}

export function upload({file}) {
	return request.post('/site/upload', {
		file:file,
	});
}

export function clearHistory({index}) {
	store.get('search').then(keys => {
		let _keys = keys || [];
		_keys.splice(index, 1);
		console.info(_keys);
		return store.save('search', Immutable.Set(_keys).toJS());
	});
}

export function clearAllHistory() {
	return store.delete("search");
}

export function history() {
	return store.get('search');
}

export function search(keyword) {
	store.get('search').then(keys => {
		let _keys = keys || [];
		_keys.push(keyword);
		_keys = _keys.slice(-10);
		store.save('search', Immutable.Set(_keys).toJS());
	})

	return request.get('/site/search', {
		keyword: keyword,
	});
}