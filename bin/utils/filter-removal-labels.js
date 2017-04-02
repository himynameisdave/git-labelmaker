/**
 *    Filter function for removal labels
 *    @param  {Array} removals - array of labels to be removed
 *    @param  {Array} labels - full list of labels from GH API call
 *    @return {Array} removals - array of proper label objects to be removed
 */


module.exports = (labels, removals) => labels.reduce((a, label) => {
    if (removals.includes(label.name)) a.push(Object.assign({}, label, { color: `#${label.color}`, }));
    return a;
}, []);
