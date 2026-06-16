// Importa o Express, que é o framework que cria o servidor web
const express = require('express');
const app = express();

// Diz pro Express usar EJS como sistema de templates (para gerar o HTML)
app.set('view engine', 'ejs');

// Permite ler os dados enviados pelos formulários HTML (método POST)
app.use(express.urlencoded({ extended: false }));

// Serve os arquivos estáticos da pasta "public" (ex: style.css)
app.use(express.static('public'));

// ─── Estado da fila (fica na memória enquanto o servidor estiver rodando) ───

let proximaSenha = 1;      // próximo número a ser emitido para um paciente
let senhaAtual = 0;        // número que está sendo atendido agora (0 = nenhum ainda)
let ultimaEmitida = null;  // última senha que um paciente retirou (para exibir na tela)
let historico = [];        // guarda os últimos 3 números que já foram chamados

// ─── Rotas ───────────────────────────────────────────────────────────────────

// GET "/" → abre a página principal
app.get('/', (req, res) => {
  res.render('index', {
    senhaAtual,                        // número em atendimento
    historico: historico.slice().reverse(), // cópia do histórico ao contrário (mais recente primeiro)
    ultimaEmitida,                     // senha que o paciente acabou de retirar
    temProxima: proximaSenha > senhaAtual + 1  // true se ainda tem gente na fila
  });
});

// POST "/pegar-senha" → paciente aperta o botão para retirar uma senha
app.post('/pegar-senha', (req, res) => {
  ultimaEmitida = proximaSenha; // salva o número que será dado ao paciente
  proximaSenha++;               // incrementa para o próximo paciente receber um número diferente
  res.redirect('/');            // redireciona para o GET "/" (evita reenvio do formulário ao atualizar)
});

// POST "/proxima" → funcionário aperta o botão para chamar a próxima senha
app.post('/proxima', (req, res) => {
  // só avança se houver alguém esperando na fila
  if (proximaSenha > senhaAtual + 1) {

    // se já havia alguém sendo atendido, guarda esse número no histórico
    if (senhaAtual > 0) {
      historico.push(senhaAtual);       // adiciona o número atual ao fim do array

      // se o histórico passou de 3 itens, remove o mais antigo (o primeiro)
      if (historico.length > 3) {
        historico.shift();
      }
    }

    senhaAtual++; // chama o próximo número
  }

  res.redirect('/'); // redireciona para o GET "/" para atualizar a página
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
