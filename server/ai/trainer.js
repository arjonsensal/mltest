const express = require("express");
const app = express();
const tf = require("@tensorflow/tfjs-node");
const use = require("@tensorflow-models/universal-sentence-encoder");
const tfn = require("@tensorflow/tfjs-node");
const handler = tfn.io.fileSystem("./data/myModel/model.json");

/**
 * Trains and save model that accepts json as input
 * @param {object} data JSON to be trained 
 */
 exports.trainModel = async (data) => {
    
    return new Promise(async function (resolve, reject) {
        try {
            const encoder = await use.load();
            const errors = data.map(t => t.error.toLowerCase());
    
            const input = await encoder.embed(errors);
            // 0 - Environment Issue// 1 - Test Issue // 2 - Bug // 3 - Unknown
            const out = tf.tensor2d(data.map(err => [
            err.failure_type === "Environment Issue" ? 1 : 0, 
            err.failure_type === "Test Issue" ? 1 : 0,  
            err.failure_type === "Bug" ? 1 : 0]));
            // {
            // var outs;
            // switch(err.failure_type) {
            //     case "Environment Issue": 
            //     outs = [01];
            //     break;
                
            //     case "Test Issue": 
            //     outs = [0,1,0];
            //     break;
    
            //     case "Bug": 
            //     outs = [1,0,0];
            //     break;
    
            //     case "On-going Feature Work": 
            //     outs = [1,0,1];
            //     break;
    
            //     default: 
            //     outs = [1,1,1];
            // }
            // return outs;
            // }
            // ));
    
            // load model
            // const model = await tf.loadLayersModel(handler);
            const model = tf.sequential();
    
            model.add(tf.layers.dense({
              inputShape: [512],
              activation: "sigmoid",
              units: 3
            }));
            model.add(tf.layers.dense({
              inputShape: [3],
              activation: "sigmoid",
              units: 3
            }));
    
            model.add(tf.layers.dense({
              activation: "sigmoid",
              units: 3
            }));
    
            model.compile({
              loss: "meanSquaredError",
              optimizer: tf.train.adam(.01)
            });
    
            // model.add(
            // tf.layers.dense({
            //     inputShape: [input.shape[1]],
            //     activation: "softmax",
            //     units: 3,
            // })
            // );
    
            // model.compile({
            // loss: "categoricalCrossentropy",
            // optimizer: tf.train.adam(0.001),
            // metrics: ["accuracy"],
            // })
    
            await model.fit(input, out, {
            batchSize: 32,
            validationSplit: 0.2,
            shuffle: true,
            epochs: 150,
            // callbacks: tf.callbacks.earlyStopping({ 
            //     monitor: "val_loss" }),
            })
            .then((history) => {
                model.save('file://./data/myModel');
                resolve(data);
            })
        } catch (e){
            console.log(e)
            reject();
        }
    })
  };

// /**
//  * Runs training model 
//  * @param {object} data 
//  */
// exports.runTrainModel = async (data) => {

//     // const model = await tf.loadLayersModel('file:D:/Software/mltest/server/data/myModel/model.json');
//     const model = await tf.loadLayersModel(handler);
//     // const model = await tf.loadLayersModel('./data/myModel');
//     model.predict(embeddingstest).print();
//   };
//   const loadModel = async () => {
//     // const embeddingsp = await use.load().embed(test);
//     await predictModel(sentenceEncoder, test.map(t => t.toLowerCase()));
//     // const mod = await trainModel(sentenceEncoder, test.map(t => t.toLowerCase()));
//   };


