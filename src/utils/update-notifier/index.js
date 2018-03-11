import updateNotifier from 'update-notifier';
import pkg from '../../../package.json';

const ONE_DAY = 1000 * 60 * 60 * 24;

export default () => updateNotifier({
    pkg,
    updateCheckInterval: ONE_DAY,
}).notify();
