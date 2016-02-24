/**
 *    Curry for a function that returns an error object based on the id passed to this fn
 *    @return {Function}  Function that accpets a message and returns an error message`
 */
"use strict";
module.exports = (id) => {
  return (message) => ({ id: id, err: message });
};
