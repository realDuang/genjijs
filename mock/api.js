const fs = require('fs');

function fromJSONFile() {
  return (req, res) => {
    const data = fs.readFileSync('./test/test.json').toString();
    const json = JSON.parse(data);
    return res.json(json);
  };
}
const proxy = {
  'GET /test': fromJSONFile()
};
module.exports = proxy;
