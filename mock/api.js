const fs = require('fs');

function fromJSONFile() {
  return (req, res) => {
    const data = fs.readFileSync('mock/mock.json').toString();
    const json = JSON.parse(data);
    return res.json(json);
  };
}
const proxy = {
  'GET /mock': fromJSONFile()
};
module.exports = proxy;
