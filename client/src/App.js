import logo from './logo.svg';
import './App.css';
import * as tf from "@tensorflow/tfjs";
import { useEffect } from 'react';
import * as use from "@tensorflow-models/universal-sentence-encoder";
import axios from 'axios';
const errors = require('./data.json');


var aa = [{text: "Arjon", m: "ass"},{text: "Arjo1n", m: "asssa"},{text: "Arjo13n", m: "as23s"},{text: "Arjo1n5", m: "a4ss"}]
var aa1 = [{text: "Arjon"},{text: "Arjo1n"},{text: "Arjo13n"},{text: "Arjo1n5"}]

function App() {

  const test = [
    'Timed out',
    'Page Extension - Success status message for saved exists - expected "found" but got: "not found"',
    'Page Extension - Application (Timekeeper) exists in DOM - expected "found" but got: "not found"',
    'Failed [fail]: (Error while waiting for new tab after 10 milliseconds)',
    'at NightwatchAPI.<anonymous>'
  ];
  

  const trainModel = async (encoder, data) => {
    const sentences = errors.map(t => t.error.toLowerCase());

    const embeddingste = await encoder.embed(sentences);
    const embeddingstest = await encoder.embed(data);
    // 0 - Environment Issue// 1 - Test Issue // 2 - Bug // 3 - Unknown
    const out = tf.tensor2d(errors.map(err => 
      // [err.fail_type === "Environment Issue" ? 0 : 1, err.fail_type === "Environment Issue" ? 1 : 0]
      {
      var outs;
      switch(err.failure_type) {
        case "Environment Issue": 
        outs = [0,0,1];
        break;
        
        case "Test Issue": 
        outs = [0,1,0];
        break;

        case "Bug": 
        outs = [1,0,0];
        break;

        case "On-going Feature Work": 
        outs = [1,0,1];
        break;

        default: 
        outs = [1,1,1];
      }
      return outs;
    }
    ));

    const model = tf.sequential();

    // model.add(tf.layers.dense({
    //   inputShape: [embeddingste.shape[1]],
    //   activation: "sigmoid",
    //   units: 2
    // }));
    // model.add(tf.layers.dense({
    //   inputShape: [2],
    //   activation: "sigmoid",
    //   units: 5
    // }));

    // model.add(tf.layers.dense({
    //   activation: "sigmoid",
    //   units: 2
    // }));

    // model.compile({
    //   loss: "meanSquaredError",
    //   optimizer: tf.train.adam(.06)
    // });

    model.add(
      tf.layers.dense({
        inputShape: [embeddingste.shape[1]],
        activation: "softmax",
        units: 3,
      })
    )
    model.compile({
      loss: "categoricalCrossentropy",
      optimizer: tf.train.adam(0.001),
      metrics: ["accuracy"],
    })

    // model.fit(embeddingste, out, {epochs: 100})
    //   .then((history) => {
    //     console.log(history)
    //     model.predict(embeddingstest).print();
    //   })
    await model.fit(embeddingste, out, {
      batchSize: 32,
      validationSplit: 0.1,
      shuffle: true,
      epochs: 150
    })
      .then((history) => {
        model.predict(embeddingstest).print();
      })

  };
  
  

  // useEffect(() => {
  //   const loadModel = async () => {
  //     const sentenceEncoder = await use.load();
  //     // const embeddingsp = await use.load().embed(test);
  //     const mod = await trainModel(sentenceEncoder, test.map(t => t.toLowerCase()));
  //   };
  //   loadModel();
  // }, []);

const uploadFile = (event) => {
  const data = new FormData() ;
  data.append('file', event.target.files[0]);
  axios.post("http://localhost:3001/uploadFile", data)
      .then(res => { // then print response status
        axios.get("http://localhost:3001/train").then((st) => {
          console.log(st.statusText);
        })
      })
}

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      <input type="file" onChange={uploadFile} />
      </header>
    </div>
  );
}

export default App;
