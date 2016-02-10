//  Simple util that will replace all instances of a sub-string in a string
module.exports = (str, find, replace) => str.split(find).join(replace);
