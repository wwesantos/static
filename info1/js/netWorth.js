
var idade = get('#age');
var brl = get('#usd');
var patrominio = get('#netWorth');

get('#form-inputs').addEventListener('focusin', (e) => {
  if (e.target.value == 0) {
    if (e.target.id == 'age') {
      idade.value = '';
    }
    if (e.target.id == 'usd') {
      brl.value = '';
    }
  }
});

get('#form-inputs').addEventListener('input', (e) => {
  if (e.target.id == 'age' || e.target.id == 'usd') {
    var idadeInput = idade.value;
    var brlInput = brl.value;
    var patrominioIdeal = idadeInput * brlInput * 12;
    if (patrominioIdeal > 0) {
      patrominio.value =
        new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(patrominioIdeal * 0.1) +
        ' ~ ' +
        new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(patrominioIdeal * 0.15);
    } else {
      patrominio.value = 'Your ideal net worth is...';
    }
  }
});
