const express      = require('express');
const port         = process.env.PORT || 4000;
const app          = express();
const dest         = `${__dirname}/public`;
const bodyParser   = require('body-parser');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(dest));


app.listen(port, () => console.log(`Express has started on port: ${port}`));
