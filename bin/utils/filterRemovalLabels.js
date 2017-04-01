/**
 *    Filter function for removal labels
 *    @param  {Array} removals - array of labels to be removed
 *    @param  {Array} labels - full list of labels from GH API call
 *    @return {Array} removals - array of proper label objects to be removed
 */


module.exports = (labels, removals) => labels.map((label) => ({ name: label.name, color: `#${label.color}`, }))
  .filter((label) => removals.indexOf(label.name) > -1);
