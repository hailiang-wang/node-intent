/**
 * Extract features for sentence
 */
const debug = require("debug")("intent:features");
const _ = require("lodash");
const nlp = require("./nlp");


function _isDigit(word) {
    return _.isNumber(word);
}

function _isTitle(word) {
    let first = word[0];
    return _.toUpper(first) === first;
}

function _isLower(word) {
    return _.toLower(word) === word;
}

function _isUpper(word) {
    return _.toUpper(word) === word;
}

function _extractFeatures(sent, i) {
    let word = sent[i][0];
    let postag = sent[i][1];
    let features = [
        'bias',
        'word.lower=' + _.toLower(word),
        'word[-3:]=' + word.slice(-3),
        'word[-2:]=' + word.slice(-2),
        'word.isupper=' + (_isUpper(word) ? 'True' : 'False'),
        'word.istitle=' + (_isTitle(word) ? 'True' : 'False'),
        'word.isdigit=' + (_isDigit(word) ? 'True' : 'False'),
        'postag=' + postag,
        'postag[:2]=' + postag.slice(0, 2)
    ];

    if (i > 0) {
        let word1 = sent[i - 1][0];
        let postag1 = sent[i - 1][1];
        features = _.concat(features,
            '-1:word.lower=' + _.toLower(word1),
            '-1:word.istitle=' + (_isTitle(word1) ? 'True' : 'False'),
            '-1:word.isupper=' + (_isUpper(word1) ? 'True' : 'False'),
            '-1:postag=' + postag1,
            '-1:postag[:2]=' + postag1.slice(0, 2)
        )
    } else {
        features.push('BOS');
    }

    if (i < (sent.length - 1)) {
        let word2 = sent[i + 1][0];
        let postag2 = sent[i + 1][1];
        features = _.concat(features,
            '+1:word.lower=' + _.toLower(word2),
            '+1:word.istitle=' + (_isTitle(word2) ? 'True' : 'False'),
            '+1:word.isupper=' + (_isUpper(word2) ? 'True' : 'False'),
            '+1:postag=' + postag2,
            '+1:postag[:2]=' + postag2.slice(0, 2)
        )
    } else {
        features.push('EOS')
    }
    return features;
}

/**
 * NER support functions for Feature extration
 * sent: sentence tokenlized in an array [[word,tag], [word,tag], [word,tag]]
 */
function extractFeatures(sent, i) {
    return _extractFeatures(sent, i);
}

/**
 * sentence
 * @param  {[type]} sentence [description]
 * @return {[type]}          [description]
 */
function sen2features(sentence) {
    let word_n_tags = nlp.pos(sentence);
    let features = [];
    for (let i = 0; i < word_n_tags.length; i++) {
        let feature = _extractFeatures(word_n_tags, i);
        features.push(feature)
    }
    return features;
}

exports = module.exports = {
    sen2features: sen2features,
    extractFeatures: extractFeatures,
    isDigit: _isDigit,
    isTitle: _isTitle,
    isLower: _isLower,
    isUpper: _isUpper
};
