/**
 *    Validates that the number of
 *    @param  {Array} removals - array of labels to be removed
 *    @return {String || Boolean} Returns true if there is one or more items in the array
 */
"use strict";

module.exports = (removals) => {
  return removals.length === 0 ? "Please select at least one label to remove." : true;
};
