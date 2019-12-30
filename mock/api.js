const fs = require('fs');

function fromJSONFile() {
  return async (req, res) => {
    const data = fs.readFileSync('mock/mock.json').toString();
    const json = JSON.parse(data);
    await new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
    return res.json(json);
  };
}
const proxy = {
  'GET /mock': fromJSONFile()
};
module.exports = proxy;
