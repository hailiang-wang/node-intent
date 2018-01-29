/**
 * Sequence Labeler with CRF++
 */
const debug = require("debug")("intent:sequenceLabeler");
const crfsuite = require('crfsuite');
const tagger = crfsuite.Tagger();
const _ = require("lodash");
const nlp = require("./nlp");


function SequenceLabeler() {
    this.pool = {};
}

/**
 * train model
 * @param  {JSONArray} data samples
 * @return {String}      model saved path
 */
SequenceLabeler.prototype.train = function(data, saved) {
    debug("train model, data size: %s, saved: %s.", data.length, saved);
    let trainer = crfsuite.Trainer();
    _.each(data, (val, index) => {
        console.log("train index: %s, val: %j.", index, val);
        let xseq = val[0];
        let yseq = val[1];
        trainer.append(xseq, yseq);
    })
    trainer.train(saved);
}

/**
 * predict tags with xseq and model path
 * @param  {[type]} xseq  [description]
 * @param  {[type]} saved [description]
 * @return {[type]}       [description]
 */
SequenceLabeler.prototype.predict = function(xseq, saved) {
    debug("predict model[%s] %j", saved, xseq)
    let model = null;
    if (saved in this.pool) {
        debug("model in pool")
        model = this.pool[saved];
    } else {
        model = crfsuite.Tagger()
        let is_opened = model.open(saved);
        debug('File model is opened:', is_opened);
        this.pool[saved] = model;
    }
    let tags = model.tag(xseq);
    debug("predict result:", tags);
    return tags;
}


SequenceLabeler.prototype.extractEntities = function(tokens, tags){
    debug("extractEntities")
    let labels = {};
    if(tokens.length === tags.length){
        for(let x in tokens){
            debug("extractEntities token:%s, tag: %s", tokens[x], tags[x])
            let tag = tags[x];
            let token = tokens[x];
            if(tag !== "O"){
                let label = tag.slice(2)
                debug("label:", label)
                if(tag.startsWith("B")){
                    labels[label] = token;
                } else if(tag.startsWith("I") && (label in labels)){
                    labels[label] += token;
                }
            }
        }
    } else {
        throw new Error("extractEntities in different size.")
    }
    return labels;
}

exports = module.exports = new SequenceLabeler();
