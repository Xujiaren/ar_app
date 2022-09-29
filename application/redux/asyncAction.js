export default function asyncAction() {
    return next => action => {
        const { meta = {}, error, payload } = action;
        const { resolved, rejected } = meta;
        error ? (rejected && rejected(payload)) : (resolved && resolved(payload));
        next(action);
    };
}