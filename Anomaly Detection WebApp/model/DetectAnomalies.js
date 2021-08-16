const fs = require('fs')
const TimeSeries = require('./TimeSeries')
const LinearAlgorithm = require('./Algorithms/LinearAlgorithm')
const HybridAlgorithm = require('./Algorithms/HybridAlgorithm')

const generatedFilesPath = "model/generatedFiles/"

function make2DMatrix(d1, d2) {
    let arr = new Array(d1), i;
    for (i = 0; i < d1; i++) {
        arr[i] = new Array(d2);
    }
    return arr;
}

function fillCsvKeys(data) {
    //init and fill csv keys
    let keys = data[0].split(",")
    keys[keys.length - 1] = keys[keys.length - 1].replaceAll("\r", "\n").slice(0, -1)
    return keys;
}

function fillCsvValues(numOfValue, keysLength, data) {
    //init and fill data values
    let dataValues = make2DMatrix(numOfValue, keysLength)
    for (let i = 0; i < numOfValue; i++) {
        dataValues[i] = data[i + 1].split(",");
    }

    //init and fill csv values
    let values = make2DMatrix(keysLength, numOfValue)
    for (let i = 0; i < keysLength; i++) {
        for (let j = 0; j < numOfValue; j++) {
            values[i][j] = dataValues[j][i].toString();
        }
    }
    //remove "\r" from last row of values
    for (let i = 0; i < numOfValue; i++) {
        values[values.length - 1][i] = values[values.length - 1][i].replaceAll("\r", "\n").slice(0, -1)
    }

    return values;
}

const createCsvFile = (data, name) => {
    let path = generatedFilesPath + name + ".csv";
    fs.writeFileSync(path, data, (err) => {
        if (err) {
            console.error(err)
        }
    });
    return path;
}

const detectAnomalies = async (trainFile, anomalyFile, type) => {

    // get the data (key + values) from the train file and save them
    let data = trainFile.toString().split("\n");
    let keys = fillCsvKeys(data);
    let values = fillCsvValues(data.length - 2, keys.length, data);

    // create local csv files
    let trainPath = createCsvFile(trainFile.toString(), "train")
    let anomalyPath = createCsvFile(anomalyFile.toString(), "anomaly")

    // learn the normal flight using time series according to the chosen algorithm
    let tsTrain = new TimeSeries(trainPath);
    let algorithm;
    if (type === 'linear') {
        algorithm = new LinearAlgorithm();
    } else if (type === 'hybrid') {
        algorithm = new HybridAlgorithm();
    }
    algorithm.learnNormal(tsTrain)

    // find the anomalies in the anomaly-flight file data
    let tsAnomaly = new TimeSeries(anomalyPath);
    let anomalies = algorithm.detect(tsAnomaly);

    return {
        anomalies: anomalies,
        keys: keys,
        values: values,
    };
}

module.exports.detectAnomalies = detectAnomalies