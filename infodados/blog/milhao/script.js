const get = function (query) {
  return document.querySelector(query);
};

const initialValue = get('#valor-inicial');
const monthlyValue = get('#valor-mensal');
const milhao = get('#milhao');
const interestRange = get('#taxa-juros');
const interestValue = get('#juros-span');
const evolution = get('#evolution');
const canva = get('#dataviz');

const MILLION = 1_000_000;

const dateOptions = { year: 'numeric', month: 'long' };
const currencyOptions = { style: 'currency', currency: 'BRL' };

//https://cdn.jsdelivr.net/npm/d3-format@1/locale/pt-BR.json
const locale = d3.formatLocale({
  decimal: ',',
  thousands: '.',
  grouping: [3],
  currency: ['R$', ' '],
});
const fformat = locale.format('$,');

const getTime = function (totalMonths) {
  const years = Math.trunc(totalMonths / 12);
  const months = totalMonths % 12;
  let time = months > 0 ? '' : ' Inicial ';

  if (years == 1) {
    time = years + ' ano ';
  } else if (years > 1) {
    time = years + ' anos ';
  }

  if (years > 0 && months > 0) {
    time += 'e ';
  }

  if (months == 1) {
    time += months + ' mês ';
  } else if (months > 1) {
    time += months + ' meses ';
  }
  return time;
};

const addRows = function (data) {
  data.forEach(function (element) {
    let tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' +
      getTime(element.month) +
      '</td><td>' +
      element.fortatedDate +
      '</td><td>' +
      element.formatedValue +
      '</td>';
    evolution.appendChild(tr);
  });
};

const plotBars = function (data) {
  // set the dimensions and margins of the graph

  // set the ranges
  //var x = d3.scaleTime().range([0, width]);
  const clientWidth = Math.min(
    document.getElementById('d3-js-container').clientWidth,
    650
  );

  const margin = { top: 30, right: 20, bottom: 90, left: 85 },
    width = clientWidth - margin.left - margin.right,
    height = clientWidth - margin.top - margin.bottom - 0.2 * clientWidth;

  // append the svg object to the body of the page
  var svg = d3
    .select('#dataviz')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // X axis
  var x = d3
    .scaleBand()
    .range([0, width])
    .domain(
      data.map(function (d) {
        return getTime(d.month);
      })
    )
    .padding(0.2);

  svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('transform', 'translate(-10,0)rotate(-45)')
    .style('text-anchor', 'end');

  // Add Y axis
  var y = d3.scaleLinear().domain([0, MILLION]).range([height, 0]);

  // add the Y gridlines
  svg
    .append('g')
    .attr('class', 'd3js-grid')
    .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(''));

  svg.append('g').call(
    d3.axisLeft(y).tickFormat(function (d) {
      return fformat(d);
    })
  );

  // Bars
  svg
    .selectAll('mybar')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', function (d) {
      return x(getTime(d.month));
    })
    .attr('y', function (d) {
      return y(d.value);
    })
    .attr('width', x.bandwidth())
    .attr('height', function (d) {
      return height - y(d.value);
    })
    .attr('fill', '#69b3a2');
};

get('#form-inputs').addEventListener('focusin', function (e) {
  if (e.target.value == 0) {
    if (e.target.id == 'valor-inicial') {
      initialValue.value = '';
    }
    if (e.target.id == 'valor-mensal') {
      monthlyValue.value = '';
    }
  }
});

get('#form-inputs').addEventListener('input', function (e) {
  if (e.target.id == 'taxa-juros') {
    interestValue.innerHTML = e.target.value + '%';
  }

  const anualInterestRate = Number(interestRange.value);
  const initial = Number(initialValue.value.replace('.', ''));
  const monthly = Number(monthlyValue.value.replace('.', ''));

  milhao.value = '';
  evolution.innerHTML = '';
  canva.innerHTML = '';

  if (monthly > 9 || initial > 99) {
    const monthlyIncrement = (Number(anualInterestRate) / 100 + 1) ** (1 / 12);

    let count = 0;
    let result = initial;

    while (result < MILLION) {
      count++;
      result = result * monthlyIncrement + monthly;
    }

    if (count > 0) {
      let step = count > 10 ? Math.trunc(count / 10) : 1;
      let currentValue = initial;
      let i = 0;
      const data = [];
      while (i <= count) {
        if ((i % step == 0 && step < count - i) || count == i) {
          const today = new Date();
          const next = new Date(today.setMonth(today.getMonth() + i));
          const nexDate = new Intl.DateTimeFormat('pt-BR', dateOptions).format(
            next
          );

          const nexValue = new Intl.NumberFormat(
            'pt-BR',
            currencyOptions
          ).format(currentValue);

          data.push({
            fortatedDate: nexDate,
            formatedValue: nexValue,
            value: currentValue,
            month: i,
          });
        }

        currentValue = currentValue * monthlyIncrement + monthly;
        i++;
      }
      plotBars(data);
      addRows(data);
    }

    const today = new Date();

    const next = new Date(today.setMonth(today.getMonth() + count));
    milhao.value = new Intl.DateTimeFormat('pt-BR', dateOptions).format(next);
  }
});
