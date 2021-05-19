const fs = require('fs')
const TimeSeries = require('./TimeSeries')
const LinearAlgorithm = require('./Algorithms/LinearAlgorithm')
const HybridAlgorithm = require('./Algorithms/HybridAlgorithm')

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

const createCsvString = (keys, values) => {
    let header = keys.join(',');
    let csv = header + "\n"
    for (let i = 0; i < values.length; i++) {
        if (i === values.length - 1) {
            csv += values[i]
        } else {
            csv += values[i] + "\n";
        }
    }
    return csv;
}

const createCsvFile = (data, name) => {
    let path = "model/generatedFiles/" + name + ".csv";
    fs.writeFileSync(path, data, (err) => {
        if (err) {
            console.error(err)
        }
    });
    return path;
}

const detectAnomalies = async (trainFile, anomalyFile) => {

    let data = trainFile.toString().split("\n");
    let keys = fillCsvKeys(data);
    let values = fillCsvValues(data.length - 2, keys.length, data);
    let trainPath = createCsvFile(data = trainFile.toString(), "train")
    let anomalyPath = createCsvFile(anomalyFile.toString(), "anomaly")
    let tsTrain = new TimeSeries(trainPath);
    let algorithm = new HybridAlgorithm();
    algorithm.learnNormal(tsTrain)
    let corrFeatures = algorithm.getCf();
    let tsAnomaly = new TimeSeries(anomalyPath);
    let anomalies = algorithm.detect(tsAnomaly);

    /*
    1) keysAndValuesMap -->  key: key from keys[] , value: values from values[[]]
    2) map2 -->  key: feature, value: most correlative feature
    3) array of anomalies --> [ [feature, most corr feature, timeStep], [...], ... ]
    //
    // 1) get most correlative - from map2
    // 2) get feature values - from keysAndValuesMap
    // 2) get most correlative feature values - from keysAndValuesMap
    */

    let keysAndValuesMap = new Map()
    for (let i = 0; i < keys.length; i++) {
        keysAndValuesMap.set(keys[i], values[i]);
    }

    let mostCorrFeatureMap = new Map()
    for (let i = 0; i < keys.length; i++) {
        let currentFeature = keys[i];

        // default case
        if (currentFeature === keys[0]) {
            mostCorrFeatureMap.set(currentFeature, keys[1]);
        } else {
            mostCorrFeatureMap.set(currentFeature, keys[0]);
        }

        for (let j = 0; j < corrFeatures.length; j++) {
            if (corrFeatures[j].feature1 === currentFeature) {
                mostCorrFeatureMap.set(currentFeature, corrFeatures[j].feature2);
            }
        }
    }
   /* console.log("most corr map: ")
    console.log(mostCorrFeatureMap)*/

    let anomaliesArray = new Array(anomalies.length)
    for (let i = 0; i < anomalies.length; i++) {
        let currentFeature = anomalies[i].description;

        // split the two correlative by '+'
        let features = currentFeature.split("+");
        anomaliesArray[i] = new Array(3)
        /* // default case
         if (currentFeature === keys[0]) {
             anomaliesArray[i][0] = currentFeature
             anomaliesArray[i][1] = keys[1]
             anomaliesArray[i][2] = 0
         } else {
             anomaliesArray[i][0] = currentFeature
             anomaliesArray[i][1] = keys[0]
             anomaliesArray[i][2] = 0
         }*/

        /* for (let j = 0; j < corrFeatures.length; j++) {
             if (corrFeatures[j].feature1 === currentFeature) {
                 console.log(currentFeature)
                 anomaliesArray[i][0] = currentFeature
                 anomaliesArray[i][1] = mostCorrFeatureMap.get(currentFeature)
                 console.log("most correlative " +mostCorrFeatureMap.get(currentFeature) )
                 anomaliesArray[i][2] = anomalies[i].timeStep
             }
         }*/

        // fill the arrays with the correct values of the anomalies and the line it happened
        for (let j = 0; j < corrFeatures.length; j++) {
            if (corrFeatures[j].feature1 === features[0]) {
                // fill each cell in the array
                anomaliesArray[i][0] = features[0]
                anomaliesArray[i][1] = features[1]
                anomaliesArray[i][2] = anomalies[i].timeStep
            } else if (corrFeatures[j].feature1 === features[1]) {
                anomaliesArray[i][0] = features[1]
                anomaliesArray[i][1] = features[0]
                anomaliesArray[i][2] = anomalies[i].timeStep
            }
        }
    }

   // console.log(anomaliesArray)

    return {
        anomalies: anomalies,
        keys: keys,
        values: values,
    };
}

module.exports.detectAnomalies = detectAnomalies