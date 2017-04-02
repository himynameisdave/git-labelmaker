/**
 *    Curry for a fn that recursivly asks if you want to add another new label, then calls a callback when youre all done
 *    @param  {Array}  prompts - array of addCustom prompts
 *    @return {Function} function that will recursivly generate a list of new custom labels
 */


const prompt = require('./prompt.js');

module.exports = (prompts) => {
    const doCustomLabelPrompts = (newLabels, done) => {
        prompt(prompts)
      .then((answers) => {
          newLabels.push({ name: answers.labelName, color: answers.labelColor, });
          if (answers.addAnother) {
              doCustomLabelPrompts(newLabels, done);
          } else {
              done(newLabels);
          }
      })
      .catch(console.warn);
    };
    return doCustomLabelPrompts;
};
