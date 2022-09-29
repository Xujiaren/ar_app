export default function createReducer(initialState, actionHandlers) {
	return (state = initialState, action) => {
		const reducerFn = actionHandlers[action.type];
		if (!reducerFn) {return state;}

		return { ...state, ...reducerFn(state, action)};
	};
}