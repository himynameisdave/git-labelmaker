/**
 *    Loops through labels passed in and logs them to the console
 *    @param  {Array} removals - array of labels to be removed
 */

'use strict';

module.exports = (removals) => removals.map(label => ` - ${label.name}`).forEach(prettyLabel => {
    console.log(prettyLabel);
});
