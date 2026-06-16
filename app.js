const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

let proximaSenha = 1;
let senhaAtual = 0;
let historico = [];

app.get('/', (req, res) => {
  res.redirect('/paciente');
});

app.get('/paciente', (req, res) => {
  const minhaSenha = req.query.senha ? parseInt(req.query.senha) : null;
  res.render('paciente', {
    senhaAtual,
    historico: [...historico].reverse(),
    minhaSenha
  });
});

app.post('/pegar-senha', (req, res) => {
  const senha = proximaSenha++;
  res.redirect('/paciente?senha=' + senha);
});

app.get('/funcionario', (req, res) => {
  res.render('funcionario', {
    senhaAtual,
    temProxima: proximaSenha > senhaAtual + 1
  });
});

app.post('/proxima', (req, res) => {
  if (proximaSenha > senhaAtual + 1) {
    if (senhaAtual > 0) {
      historico.push(senhaAtual);
      if (historico.length > 3) historico.shift();
    }
    senhaAtual++;
  }
  res.redirect('/funcionario');
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
