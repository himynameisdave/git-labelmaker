import createStore from './store/index.js';

const main = () => {
    const store = createStore();
    console.log(store);
    console.log(store.getState());
};

main();
