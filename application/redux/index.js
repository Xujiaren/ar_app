import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import {createLogger} from 'redux-logger';

import reducers from './reduce';
import asyncAction from './asyncAction';
import errorAction from './errorAction';

let middlewares = [
    thunk,
    promise,
    asyncAction,
    errorAction,
];

if (__DEV__) {
    const logger = createLogger();
    middlewares.push(logger);
}

const createAppStore = applyMiddleware(...middlewares)(createStore);

export default function configureStore() {
	const store = createAppStore(reducers);
    return store;
}