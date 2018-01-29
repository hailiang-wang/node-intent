/**
 * Node Intent Object
 * train and predict
 */

const nlp = require("./lib/nlp");
const featureExtractor = require("./lib/featuresExtractor");
const SL = require("./lib/sequenceLabeler");

function Intent(){
    this.pool = {};
}

const intent = new Intent();

exports = module.exports = {
    sen2features: featureExtractor.sen2features,
    tokenzie: nlp.tokenzie,
    pos: nlp.pos,
    train: SL.train.bind(intent),
    predict: SL.predict.bind(intent),
    extractEntities: SL.extractEntities.bind(intent)
};
