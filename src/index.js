#!/usr/bin/env node

// import createStore from './store/index.js';
import updateNotifier from './utils/update-notifier/index.js';


const main = () => {
    // const store = createStore();

    //  Let the users know if there is an update
    updateNotifier();
};

main();
