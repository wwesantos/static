var clientWidth,
  margin,
  width,
  height,
  x,
  y,
  svg,
  valueLine,
  allData = {},
  selectedSeries = [];

function showCanvas() {
  document.getElementById('d3js-loading').style.display = 'none';
}

function resetCanvas() {
  document.getElementById('d3js-plt-content').innerHTML = '';

  valueline = d3
    .line()
    .x(function (d) {
      return x(d.year);
    })
    .y(function (d) {
      return y(d.value);
    });

  svg = d3
    .select('#d3js-plt-content')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
}

function addX() {
  var years = allData.years;
  var min = years[0];
  var max = years[years.length - 1] + 0.99;

  // Scale the range of the data
  x.domain([min, max]);

  // Add the x Axis
  svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x).tickFormat(d3.format('d')));

  //add the X gridlines
  svg
    .append('g')
    .attr('class', 'd3js-grid')
    .attr('transform', 'translate(0,' + height + ')')
    .call(
      d3
        .axisBottom(x)
        .ticks(allData.years.length)
        .tickSize(-height)
        .tickFormat('')
    );
}

function addY() {
  // Scale the range of the data
  var min = 5000;
  var max = 0;
  if (selectedSeries.length == 0) {
    min = 0;
    max = 3000;
  } else {
    selectedSeries.forEach(function (serie) {
      serie.value.forEach(function (v) {
        min = Math.min(min, v.value);
        max = Math.max(max, v.value);
      });
    });
  }

  min = Math.max(min - 200, 0);
  max = max + 100;

  y.domain([min, max]);

  // Add the y Axis
  svg.append('g').call(
    d3.axisLeft(y).tickFormat(function (d) {
      return 'R$ ' + d3.format('d')(d) + ',00';
    })
  );

  // add the Y gridlines
  svg
    .append('g')
    .attr('class', 'd3js-grid')
    .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(''));
}

function loadSelectedSeries() {
  // Add the valueline path.
  selectedSeries.forEach(function (serie) {
    //Add label
    svg
      .append('g')
      .selectAll('text')
      .data([serie])
      .enter()
      .append('text')
      .attr('x', x(allData.years[allData.last_year_index] - 0.1))
      .attr('y', function (d) {
        return y(d.value[allData.last_year_index].value + 1);
      })
      .style('fill', function (d) {
        return allData.color_map[d.name];
      })
      .text(function (d) {
        return d.name;
      });

    //Add path
    svg
      .append('path')
      .data([serie.value])
      .attr('class', 'line')
      .style('stroke', allData.color_map[serie.name])
      .attr('d', valueline);
  });
}

function reloadCanvas() {
  resetCanvas();
  addX();
  addY();
  loadSelectedSeries();
}
function addElementTo(id, divId, type) {
  document
    .getElementById(divId)
    .insertAdjacentHTML(
      'beforeend',
      '<input type="checkbox" id="' +
        id +
        '" value="' +
        type +
        '"> ' +
        '<label id="lbl' +
        id +
        '" for="' +
        id +
        '">' +
        id +
        '</label>' +
        '<br>'
    );
}

function createElements() {
  allData.country_data.forEach(function (element) {
    addElementTo(element.name, 'd3js-countries-col-0', 'country');
  });
  allData.regions_data
    .map(function (e) {
      return e.name;
    })
    .sort()
    .forEach(function (e) {
      addElementTo(e, 'd3js-regions-col-0', 'region');
    });
  var states = 0;
  allData.states_data
    .map(function (e) {
      return e.name;
    })
    .sort()
    .forEach(function (e) {
      addElementTo(e, 'd3js-states-col-' + (states % 2), 'state');
      states++;
    });
}

function addAllSeriesOf(series) {
  var selectedSeriesIds = selectedSeries.map(function (e) {
    return e.name;
  });
  series.forEach(function (s) {
    const id = s.name;
    //Add only series that are not selected yet
    if (selectedSeriesIds.indexOf(id) == -1) {
      addSerie(id, series);
    }
  });
  reloadCanvas();
}

function removeAllSeriesOf(series) {
  var selectedSeriesIds = selectedSeries.map(function (e) {
    return e.name;
  });
  series.forEach(function (s) {
    if (selectedSeriesIds.indexOf(s.name) > -1) {
      removeSerie(s.name);
    }
  });
  reloadCanvas();
}

function addSerie(id, data) {
  data.forEach(function (serie) {
    if (serie.name == id) {
      selectedSeries.push(serie);
      document.getElementById(id).checked = true;
      document.getElementById('lbl' + id).style.color = allData.color_map[id];
    }
  });
}

function removeSerie(id) {
  selectedSeries = selectedSeries.filter(function (serie) {
    return serie.name != id;
  });
  document.getElementById('lbl' + id).style.color = '';
  document.getElementById(id).checked = false;
}

function calculateClientSize() {
  // set the ranges
  //var x = d3.scaleTime().range([0, width]);
  (clientWidth = Math.min(
    document.getElementById('d3js-plt-content').clientWidth,
    1080
  )),
    (margin = { top: 10, right: 50, bottom: 30, left: 70 }),
    (width = clientWidth - margin.left - margin.right),
    (height = clientWidth / 1.8 - margin.top - margin.bottom),
    (x = d3.scaleLinear().range([0, width])),
    (y = d3.scaleLinear().range([height, 0]));
}

function processData(data) {
  allData = data;
  selectedSeries = [];
  calculateClientSize();
  createElements();
  addSerie('Brasil', allData.country_data);
  reloadCanvas();

  window.addEventListener('resize', function (e) {
    calculateClientSize();
    reloadCanvas();
  });
  document.getElementById('allRegions').addEventListener('click', function (e) {
    addAllSeriesOf(allData.regions_data);
  });

  document.getElementById('noRegions').addEventListener('click', function (e) {
    removeAllSeriesOf(allData.regions_data);
  });

  document.getElementById('allStates').addEventListener('click', function (e) {
    addAllSeriesOf(allData.states_data);
  });

  document.getElementById('noStates').addEventListener('click', function (e) {
    removeAllSeriesOf(allData.states_data);
  });
  document
    .getElementById('d3js-controls')
    .addEventListener('change', function (e) {
      var v = e.target.value;
      if (v == 'country' || v == 'region' || v == 'state') {
        const id = e.target.id;
        if (e.target.checked) {
          if (v == 'country') {
            addSerie(id, allData.country_data);
          } else if (v == 'region') {
            addSerie(id, allData.regions_data);
          } else if (v == 'state') {
            addSerie(id, allData.states_data);
          }
        } else {
          removeSerie(id);
        }
        reloadCanvas();
      }
    });
}

function loadYearsData() {
  d3.json('./data.json').then(function (data) {
    processData(data);
    showCanvas();
  });
}
