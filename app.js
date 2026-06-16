const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

let proximaSenha = 1;
let senhaAtual = 0;
let ultimaEmitida = null;
let historico = [];

app.get('/', (req, res) => {
  res.render('index', {
    senhaAtual,
    historico: historico.slice().reverse(),
    ultimaEmitida,
    temProxima: proximaSenha > senhaAtual + 1
  });
});

app.post('/pegar-senha', (req, res) => {
  ultimaEmitida = proximaSenha;
  proximaSenha++;
  res.redirect('/');
});

app.post('/proxima', (req, res) => {
  if (proximaSenha > senhaAtual + 1) {
    if (senhaAtual > 0) {
      historico.push(senhaAtual);
      if (historico.length > 3) {
        historico.shift();
      }
    }
    senhaAtual++;
  }
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
