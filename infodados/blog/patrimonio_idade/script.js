var get = function (query) {
  return document.querySelector(query);
};

var idade = get('#idade');
var brl = get('#brl');
var patrominio = get('#patrominio');

get('#form-inputs').addEventListener('focusin', (e) => {
  if (e.target.value == 0) {
    if (e.target.id == 'idade') {
      idade.value = '';
    }
    if (e.target.id == 'brl') {
      brl.value = '';
    }
  }
});

get('#form-inputs').addEventListener('input', (e) => {
  if (e.target.id == 'brl' || e.target.id == 'idade') {
    var idadeInput = idade.value;
    var brlInput = brl.value;
    var patrominioIdeal = idadeInput * brlInput * 12;
    if (patrominioIdeal > 0) {
      patrominio.value =
        new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(patrominioIdeal * 0.1) +
        ' ~ ' +
        new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(patrominioIdeal * 0.15);
    } else {
      patrominio.value = 'Faixa de patrimônio ideal em reais';
    }
  }
});
