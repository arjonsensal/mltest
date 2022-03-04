import logo from './logo.svg';
import './App.css';
import * as tf from "@tensorflow/tfjs";
import Tokenizer from "./Tokenizer";
import { useEffect } from 'react';
import * as use from "@tensorflow-models/universal-sentence-encoder";


var aa = [{text: "Arjon", m: "ass"},{text: "Arjo1n", m: "asssa"},{text: "Arjo13n", m: "as23s"},{text: "Arjo1n5", m: "a4ss"}]
var aa1 = [{text: "Arjon"},{text: "Arjo1n"},{text: "Arjo13n"},{text: "Arjo1n5"}]

function App() {

  const apps = [
    'Hubs - Projects - Plan',
    'Hubs - Activities',
    'Hubs - Billing Terms',
    'Hubs - Firms',
    'Resource Management',
    'Projects - Project',
    'Hubs - Boilerplate'
  ];
  

  const encodeData = async (encoder, tasks) => {
    const sentences = tasks//.map(t => t.text.toLowerCase());
    const embeddings = await encoder.embed(sentences);

    const Testapps = [
      'Happy - Hubs - Projects - Plan - Plan Checked In Dialog When Plan is Forcibly Checked In',
    ];
    const embeddingste = await encoder.embed(Testapps);
    // 0 - rpenabled 1 - accounting 2 - crm 3 - payroll
    const out = tf.tensor2d([[1,0,0,0], [0,0,1,0], [0,0,1,0], [1,1,0,0], [1,1,1,0], [1,0,0,0], [0,0,1,0]]);

    const model = tf.sequential();

    model.add(tf.layers.dense({
      inputShape: [embeddings.shape[1]],
      activation: "sigmoid",
      units: 2
    }));
    model.add(tf.layers.dense({
      inputShape: [2],
      activation: "sigmoid",
      units: 5
    }));

    model.add(tf.layers.dense({
      activation: "sigmoid",
      units: 4
    }));

    model.compile({
      loss: "meanSquaredError",
      optimizer: tf.train.adam(.06)
    });

    model.fit(embeddings, out, {epochs: 100})
      .then((history) => {
        console.log(history)
        model.predict(embeddingste).print();
      })
  };
  
  
  useEffect(() => {
    const loadModel = async () => {
      const sentenceEncoder = await use.load();
      const trainedModel = await encodeData(sentenceEncoder, apps);
    };
    loadModel();
  }, []);


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
      </header>
    </div>
  );
}

export default App;
