const CorrelatedFeatures = require("../CorrelatedFeatures");
const Shapes = require("../Shapes");
const AnomalyReport = require("../AnomalyReport");
const anomalyDetectionUtil = require('../AnomalyDetectionUtil')

class LinearAlgorithm {
    #cf
    #threshold
    #anomalyDetectionUtil

    constructor() {
        this.#cf = [] // list of correlated features
        this.#anomalyDetectionUtil = new anomalyDetectionUtil();
        this.#threshold = 0.9
        this.f = false;
    }

    /*
     * learn normal flight data
     * Find and set the most correlative features
     */
    learnNormal(ts){
        let atts = ts.getAttributes()

        //init vals
        let vals = new Array(atts.length)
        let numOfRows= ts.getNumOfValuesRows()
        for (let i = 0; i < atts.length; i++){
            vals[i] = new Array(numOfRows);
        }

        //fill vals
        for (let i = 0; i < atts.length; i++){
            let x = ts.getAttributeData(atts[i])
            for (let j = 0; j < numOfRows; j++){
                vals[i][j] = parseFloat(x[j]);
            }
        }

        for (let i = 0; i < atts.length; i++){
            let f1 = atts[i];// get feature 1
            let max = 0;
            let jMax = 0;

            //find the most correlative feature to f1
            for (let j = i+1; j < atts.length; j++) {
                let p = Math.abs(parseFloat(this.#anomalyDetectionUtil.pearson(vals[i], vals[j])))
                if (p > max) {
                    max = p;
                    jMax = j;
                }
            }

            let f2 = atts[jMax];
            let ps = this.toPoints(ts.getAttributeData(f1),ts.getAttributeData(f2));
            this.learnHelper(ts,max,f1,f2,ps);
        }
    }

    /* learn normal helper - if the pearson of the features is higher than the pre-defined threshold
    * than add it to the cf list
    */
    learnHelper(ts, pearson, f1, f2, points){
        if(pearson>this.#threshold){
            let len = ts.getRowSize();
            let c = new CorrelatedFeatures();
            c.feature1=f1;
            c.feature2=f2;
            c.correlation=parseFloat(pearson);
            c.lin_reg=this.#anomalyDetectionUtil.linear_reg(points);
            c.threshold=this.findThreshold(points,len,c.lin_reg)*1.1; // 10% increase
            this.#cf.push(c);
        }
    }

    /*
    * convert the given float arrays to list of points
    */
    toPoints(v1,v2){
        let ps = new Array(v1.length)
        for (let i = 0; i < v1.length; i++){
            ps[i] = new Shapes.Point(parseFloat(v1[i]), parseFloat(v2[i]));
        }
        return ps;
    }

    /* detect anomalies in the given flight data */
    detect(ts){
        let v = [];
        for (let i = 0; i < this.#cf.length; i++){
            let currentCorrelatedFeatures = this.#cf[i];
            let x = ts.getAttributeData(currentCorrelatedFeatures.feature1);
            let y = ts.getAttributeData(currentCorrelatedFeatures.feature2);
            for(let j= 0; j < x.length; j++){
                if(this.isAnomalous(x[j],y[j],currentCorrelatedFeatures)){
                    let d = currentCorrelatedFeatures.feature1 + " + " + currentCorrelatedFeatures.feature2;
                    v.push(new AnomalyReport(d,(j+1)));
                }
            }
        }
        return v;
    }

    getCf(){
        return this.#cf
    }

    setCorrelationThreshold(newThreshold){
        this.#threshold = newThreshold;
    }

    /* check if the given values are anomalous */
    isAnomalous(x,y, correlatedFeatures){
        return (Math.abs(parseFloat(y) -
            correlatedFeatures.lin_reg.f(parseFloat(x))) > parseFloat(correlatedFeatures.threshold));
    }

    /* find the threshold of the given features (by the list of points) using linear reg */
    findThreshold(points, len, rl){
        let max = 0;
        for (let i = 0; i < len; i++){
            let d = Math.abs(parseFloat(points[i].y) - parseFloat(rl.f(parseFloat(points[i].x))))
            if(d > max){
                max = d;
            }
        }
        return max;
    }

    getThreshold(){
        return this.#threshold;
    }
}

module.exports = LinearAlgorithm