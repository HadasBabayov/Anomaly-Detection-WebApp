const LinearAlgorithm = require('./LinearAlgorithm')
const Shapes = require('../Shapes')
const minCircle = require('smallest-enclosing-circle')
const CorrelatedFeatures = require("../CorrelatedFeatures");

class HybridAlgorithm extends LinearAlgorithm{
    #cf
    #minValue
    constructor() {
        super();
        this.#cf = super.getCf();
        this.#minValue = 0.5
    }

    dist(p1,p2){
        let x2 = (p1.x - p2.x) * (p1.x - p2.x);
        let y2 = (p1.y - p2.y) * (p1.y - p2.y);
        return Math.sqrt(x2+y2);
    }

    /* override LinearAlgorithm learnHelper method -
    *  in addition to find the most correlative features with linear reg which
    *  their pearson is bigger than the threshold, if their pearson is bigger than the pre-defined
    *  min value and smaller than the threshold than the method uses min algorithm and pushes them
    *  to the list of correlative features
    */
    learnHelper(ts, pearson, f1, f2, points) {
        super.learnHelper(ts, pearson, f1, f2, points);
        if(pearson > this.#minValue && pearson < super.getThreshold()){
            let minCircleData = minCircle(points)
            let circle = new Shapes.Circle(new Shapes.Point(minCircleData.x, minCircleData.y), minCircleData.r)
            let corrFeatures = new CorrelatedFeatures()
            corrFeatures.feature1 = f1;
            corrFeatures.feature2 = f2;
            corrFeatures.corrlation = pearson;
            corrFeatures.threshold = circle.radius*1.1; // 10% increase
            corrFeatures.cx = circle.center.x;
            corrFeatures.cy = circle.center.y;
            this.#cf.push(corrFeatures);
        }
    }

    /* override LinearAlgorithm isAnomalous method -
    *  instead of just checking whether the correlation is bigger than the threshold, the method checks
    *  in addition if the correlation is between min value and the threshold
    */
    isAnomalous(x, y, correlatedFeatures) {
        return (correlatedFeatures.corrlation >= super.getThreshold() && super.isAnomalous(x,y,correlatedFeatures)) ||
               (correlatedFeatures.corrlation > this.#minValue &&
                correlatedFeatures.corrlation < super.getThreshold() &&
                this.dist(new Shapes.Point(correlatedFeatures.cx, correlatedFeatures.cy),
                    new Shapes.Point(x, y)) > correlatedFeatures.threshold);
    }
}

module.exports = HybridAlgorithm;