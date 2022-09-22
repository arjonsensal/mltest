const tf = require("@tensorflow/tfjs-node");
const use = require("@tensorflow-models/universal-sentence-encoder");
const tfn = require("@tensorflow/tfjs-node");
const handler = tfn.io.fileSystem("./data/myModel/model.json");
const test = [
    'Timed out while waiting for element <div#applicationLoadingOverlay:not([style*="display: none"])> to be visible for 180000 milliseconds. - expected "visible" but got: "not visible"',
    'Failed [fail]: (afterCb function is required for button types)',
    'Testing if label of <div.saved_searches_menu span.navigator_popupmenu> is "Testing Search" in 1000 ms. - expected "Testing Search" but got: "Select Search"',
    'Testing if element <div[class="application-label"]> contains text: "Client Number Format" in 1000 ms. - expected "Client Number Format" but got: "Clients"',
    'at NightwatchAPI.<anonymous>'
  ];

/**
 * make prediction based on input
 * @param {Array} data Array of strings 
 */
exports.makePrediction = async (data) => {
    var percent;
    var total = 0;
    var right = 0;

    // load model
    const model = await tf.loadLayersModel(handler);
    // encoder
    const encoder = await use.load();
    
    const outputs = await encoder.embed(data.map(t => t.error.toLowerCase()));
    // model.predict(outputs).print();
    const tensor = await model.predict(outputs).arraySync()

    tensor.forEach((ten, i) => {
      var output = '';
      const max = Math.max(...ten)
      ten.map(t => {
        output += (t==max && parseInt(t) < 0.5) ? '1' : t.toFixed(0)
      });
      if (data[i].failure_type === output) {
        right++;
      }
      console.log(data[i].error, data[i].failure_type, output)
      total++;
    });
    console.log(right, total, (right/total).toFixed(2))
  };
