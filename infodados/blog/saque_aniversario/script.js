var get = function (query) {
  return document.querySelector(query);
};

var brl = get('#brl');
var disponivel = get('#disponivel');

var tiers = [
  [20000, 0.05, 2900],
  [15000, 0.1, 1900],
  [10000, 0.15, 1150],
  [5000, 0.2, 650],
  [1000, 0.3, 150],
  [500, 0.4, 50],
  [0, 0.5, 0],
];

var getTier = function (brlInput) {
  var result = tiers.filter(function (e) {
    return brlInput > e[0];
  });

  if (result.length == 0) {
    return tiers[6];
  } else {
    return result[0];
  }
};

get('#form-inputs').addEventListener('focusin', function (e) {
  if (e.target.value == 0) {
    if (e.target.id == 'brl') {
      brl.value = '';
    }
  }
});

get('#form-inputs').addEventListener('input', function (e) {
  var value = brl.value + '';
  if (e.target.id == 'brl') {
    var brlInput = Number(value);
    var tier = getTier(brlInput);
    var varlorDisponivel = tier[1] * brlInput + tier[2];
    disponivel.value =
      varlorDisponivel > 0
        ? new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(varlorDisponivel)
        : '';
  }
});
