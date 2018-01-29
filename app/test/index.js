/*
 * Test
 */
const curdir = __dirname;
const path = require("path");
const test = require("ava");
const _ = require("lodash");
const debug = require("debug")("intent:test");
const input_sentence1 = "I want a cab from beijing to shanghai";
const input_sentence2 = "I want a cab from beijing";
const input_sentence3 = "I want a cab to shanghai";
const input_sentence4 = "book a cab from shanghai";
const input_sentence5 = "book a cab to shanghai";
const input_sentence6 = "book a cab from shanghai to Beijing";
const input_xseq1 = require("./fixtures/doc.json");
const input_yseq1 = [
    "O",
    "O",
    "O",
    "O",
    "O",
    "B-from",
    "O",
    "B-destination"
];
const input_yseq2 = [
    "O",
    "O",
    "O",
    "O",
    "O",
    "B-from"
];
const input_yseq3 = [
    "O",
    "O",
    "O",
    "O",
    "O",
    "B-destination"
];
const input_yseq4 = [
    "O",
    "O",
    "O",
    "O",
    "B-from"
];
const input_yseq5 = [
    "O",
    "O",
    "O",
    "O",
    "B-destination"
];
const input_yseq6 = [
    "O",
    "O",
    "O",
    "O",
    "B-from",
    "O",
    "B-destination"
];



const intent = require("../index");

test("Intent Test#features", async(t) => {
    // console.log("input_xseq", JSON.stringify(input_xseq))
    // 
    // let tokens = nlp.tokenzie(input_sentence);
    let features = intent.sen2features(input_sentence1);
    console.log(features)
    t.pass();
})


test("Intent Test#tokenzie", async(t) => {
    let tokens = intent.tokenzie(input_sentence1);
    console.log("nlp: tokens ", tokens);
    t.true(tokens.length == 8, "should have 8 tokens");
    t.pass();
})

test("Intent Test#tag sentence in array", async(t) => {
    let tags = intent.pos(["i", "want", "a", "cab", "from", "kak", "to", "idap"]);
    console.log("nlp: tokens ", tags);
    // t.true(tokens.length == 8, "should have 8 tokens");
    t.pass();
})

test("Intent Test#tag sentence in string", async(t) => {
    let tags = intent.pos(input_sentence1);
    console.log("nlp: tokens ", tags);
    t.true(tags.length == 8, "should have 8 tokens");
    t.pass();
})

test("Intent Test#train model", async(t) => {
    let modelSavedPath = path.join(curdir, "..", "..", "tmp", "test.crf.book_cab.model");
    let samples = [
        [intent.sen2features(input_sentence1), input_yseq1],
        [intent.sen2features(input_sentence2), input_yseq2],
        [intent.sen2features(input_sentence3), input_yseq3],
        [intent.sen2features(input_sentence4), input_yseq4],
        [intent.sen2features(input_sentence5), input_yseq5],
        [intent.sen2features(input_sentence6), input_yseq6]
    ];
    // console.log("samples:", samples)
    let train = intent.train(samples, modelSavedPath);

    t.pass();
})

test("Intent Test#predict model", async(t) => {
    let modelSavedPath = path.join(curdir, "fixtures", "crf.book_cab.model");
    console.log("predict", modelSavedPath);
    let sentence = "book a cab from York to DC."
    let tags = intent.predict(intent.sen2features(sentence), modelSavedPath);
    let tokens = intent.tokenzie(sentence);
    let result = intent.extractEntities(tokens, tags);
    console.log("extractEntities", result)
    t.pass();
})
