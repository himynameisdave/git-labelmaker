import reducer from './reducer.js';

const createStore = () => {
    let state = reducer(undefined, { type: '@@init' });
    const setState = (newState) => {
        state = {
            ...state,
            ...newState,
        };
        return state;
    };
    return {
        getState: () => state,
        dispatch: (action) => setState(reducer(this.getState(), action)),
    };
};

export default createStore;
