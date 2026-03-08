const express = require('express');
const {BearerParser, BearerValidator} = require('bearer-token-parser');

const app = express();
app.use(express.json());

// --- Header token validation ---
// curl -H "Authorization: Bearer mytoken123" http://localhost:3000/header
app.get('/header', [
  BearerValidator.validation({
    realm: 'sandbox',
    tokenCheckCallback: token => token === 'mytoken123',
  })
], (req, res) => {
  const token = BearerParser.parseBearerToken(req);
  res.json({message: 'Authenticated', token});
});

// --- Query token validation ---
// curl http://localhost:3000/query?access_token=mytoken123
app.get('/query', [
  BearerValidator.validation({
    tokenLocation: 'query',
    tokenParameter: 'access_token',
    realm: 'sandbox',
    tokenCheckCallback: token => token === 'mytoken123',
  })
], (req, res) => {
  const token = BearerParser.parseBearerTokenQuery(req, 'access_token');
  res.json({message: 'Authenticated', token});
});

// --- Body token validation ---
// curl -X POST -H "Content-Type: application/json" -d '{"access_token":"mytoken123"}' http://localhost:3000/body
app.post('/body', [
  BearerValidator.validation({
    tokenLocation: 'body',
    tokenParameter: 'access_token',
    realm: 'sandbox',
    tokenCheckCallback: token => token === 'mytoken123',
  })
], (req, res) => {
  const token = BearerParser.parseBearerTokenBody(req, 'access_token');
  res.json({message: 'Authenticated', token});
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Sandbox running on http://localhost:${port}`);
});
