/**
 * Tokenizer, Tagging
 */
const path = require("path");
const natural = require("natural");
const debug = require("debug")("intent:nlp");
const _ = require("lodash");
const posjs = require('pos');
const tokenizer = new natural.WordTokenizer();
const tagger = new posjs.Tagger();

// attach stem fn to String prototype
natural.PorterStemmer.attach();

function NLP() {

}

/**
 * Convert sentences into plain text, tokenilized,
 * normalized.
 * @param  {JSONArray} sentences sentences
 * @return {String}           plain texts with punt.
 */
NLP.prototype.sentenceTokenize = function(sentences) {
    let plainText = "";
    // TODO normalized, tokenized
    plainText = sentences.join(" ");
    return plainText;
}

/**
 * Split sentence to tokens
 * @param  {String} sentence such as "I see the man with the telescope"
 * @return {[type]}          [description]
 */
NLP.prototype.tokenzie = function(sentence) {
    debug("tokenzie:", sentence)
    let word_n_tags = this.pos(sentence);
    let tokens = [];
    for (let x in word_n_tags) {
        let [token, tag] = word_n_tags[x]
        tokens.push(token)
    }
    return tokens;
}

/**
 * Part of speech Tagger
 * @param  {string JSONArray} sentence such as ["I", "see", "the", "man", "with", "the", "telescope"]
 * @return {JSONArray}          [["I","NN"],["see","VB"],["the","DT"],["man","NN"],["with","IN"],["the","DT"],["telescope","NN"]]
 */
NLP.prototype.pos = function(sentence) {
    debug("pos:", sentence);
    let tokens = [];

    if (_.isArray(sentence)) {
        let tmp = '';
        _.each(sentence, (val, index) => {
            tmp += (val + " ")
        })
        sentence = tmp.trim();
    }

    sentence = sentence.stem().split(" ");
    debug("pos post stem: %j", sentence)
    let pos = tagger.tag(sentence);
    debug("pos result: %j", pos);
    return pos;
}

exports = module.exports = new NLP();
