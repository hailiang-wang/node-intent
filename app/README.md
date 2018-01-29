# Intent
Sequence Labeler to train NER model with CRF++.

![](https://camo.githubusercontent.com/ae91a5698ad80d3fe8e0eb5a4c6ee7170e088a7d/687474703a2f2f37786b6571692e636f6d312e7a302e676c622e636c6f7564646e2e636f6d2f61692f53637265656e25323053686f74253230323031372d30342d30342532306174253230382e32302e3437253230504d2e706e67)

# Usage
```
npm install @chatopera/node-ner
var intent = require("@chatopera/node-ner")
```

## pos
Part of Speech

```
let tags = intent.pos(["i", "want", "a", "cab", "from", "kak", "to", "idap"]);
console.log("tokens ", tags);
tags = intent.pos("I want a cab from beijing to shanghai");
console.log("tokens ", tags);
```

## tokenzie
Tokenizer

```
let tokens = intent.tokenzie("I want a cab from beijing to shanghai");
console.log("tokens ", tokens);
```

## features
Extract features for sentence that can be used as input to train CRF model.
```
let input_xseq1 = intent.sen2features("I want a cab from beijing to shanghai");
console.log(input_xseq1)
```

## train
Train models.
```
let curdir = __dirname;
let modelSavedPath = path.join(curdir, "tmp", "test.crf.book_cab.model");
let input_yseq1 = ["O", "O", "O", "O", "O", "B-from", "O", "B-destination"];
let samples = [
    [input_xseq1, input_yseq1],
    ... // add many as possible
];
let train = intent.train(samples, modelSavedPath);
```

## predict
Predict entities in sentence with model.
```
let curdir = __dirname;
let modelSavedPath = path.join(curdir, "tmp", "test.crf.book_cab.model");
let sentence = "book a cab from York to DC."
let tags = intent.predict(featureExtractor.sen2features(sentence), modelSavedPath);
let tokens = intent.tokenzie(sentence);
let result = intent.extractEntities(tokens, tags);
console.log("extractEntities", result)
// extractEntities { from: 'york', destination: 'dc.' }
```

More examples: check out ```test/index.js```.

# Contribute

```
cd app/
npm install
DEBUG=intent* ava test/index.js
```

# LICENSE
MIT
