// import { actionTypes } from './actions.js';
import initialState from './initial-state.js';

const actionsMap = {
    // [actionTypes.setGitHubToken]: (state, action) => ({
    //     ...state,
    //     token: {
    //         github: action.token,
    //     },
    // }),
};

export default (state = initialState, action) => {
    const reduceFn = actionsMap[action.type];
    if (!reduceFn) return state;
    return reduceFn(state, action);
};
