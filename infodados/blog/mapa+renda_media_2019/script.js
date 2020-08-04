/*  Sources
 *   https://bl.ocks.org/d3noob/ddd7129c4486085937eb28da0d22a240
 *   https://bl.ocks.org/d3noob/879316f32be861b6870c98a277076d1b
 *   https://datawanderings.com/2018/10/28/making-a-map-in-d3-js-v-5/
 *   https://bl.ocks.org/ppKrauss/0c33364240e841fa23e78b21005f792c Brazil map
 *   https://stackoverflow.com/questions/13897534/add-names-of-the-states-to-a-map-in-d3-js
 */

// Define map size on screen

var current_color = 0,
  width,
  height,
  svg,
  g,
  path;

function showCanvas() {
  document.getElementById('d3js-loading').style.display = 'none';
  document.getElementById('d3js-plt-content-map').style.display = 'block';
}

function calculateClientSize() {
  (clientWidth = 620),
    (margin = { top: 5, right: 20, bottom: 5, left: 10 }),
    (width = clientWidth - margin.left - margin.right),
    (height = clientWidth - margin.top - margin.bottom);
}

function getColor(uf, ibgeData) {
  var state = ibgeData.states_last_year_data.filter(function (state) {
    return state.uf == uf;
  });
  return state[0].color;
}

function getValue(uf, ibgeData) {
  var state = ibgeData.states_last_year_data.filter(function (state) {
    return state.uf == uf;
  });
  return uf + ': R$ ' + d3.format('d')(state[0].value);
}

function initializeCanvas() {
  document.getElementById('d3js-plt-content-map').innerHTML = '';

  document
    .getElementById('d3js-plt-content-map')
    .addEventListener('mouseover', function (e) {
      [].forEach.call(document.querySelectorAll('.state_hover'), function (el) {
        el.classList.remove('state_hover');
      });
      [].forEach.call(
        document.querySelectorAll('.state_label_hover'),
        function (el) {
          el.classList.remove('state_label_hover');
        }
      );
      var classList = e.target.classList;
      if (
        classList.contains('state_map') ||
        classList.contains('state_label')
      ) {
        var id_end = e.target.id.split('_')[1];
        document
          .getElementById('label_' + id_end)
          .classList.add('state_label_hover');
        document.getElementById('state_' + id_end).classList.add('state_hover');
      }
    });
}

function processData(geoStateData, ibgeData) {
  g.append('rect') // the canvas frame
    .attr('x', 0)
    .attr('y', 0)
    .attr('class', 'map_canvas')
    .attr('width', width)
    .attr('height', height);

  // Extracting polygons and contours
  var states = topojson.feature(geoStateData, geoStateData.objects.estados);
  var states_contour = topojson.mesh(
    geoStateData,
    geoStateData.objects.estados
  );

  // Desenhando estados
  g.selectAll('.estado')
    .data(states.features)
    .enter()
    .append('path')
    .attr('class', 'state_map')
    .attr('d', path)
    .attr('id', function (d) {
      return 'state_' + d.id;
    })
    .style('fill', function (d) {
      return getColor(d.id, ibgeData);
    });

  g.append('path')
    .datum(states_contour)
    .attr('d', path)
    .attr('class', 'state_contour');

  g.selectAll('text')
    .data(states.features)
    .enter()
    .append('svg:text')
    .text(function (d) {
      return getValue(d.id, ibgeData);
    })
    .attr('id', function (d) {
      return 'label_' + d.id;
    })
    .attr('x', function (d) {
      return path.centroid(d)[0];
    })
    .attr('y', function (d) {
      if (d.id == 'GO') {
        return path.centroid(d)[1] + 10;
      } else if (d.id == 'DF') {
        return path.centroid(d)[1] - 4;
      } else {
        return path.centroid(d)[1];
      }
    })
    .attr('class', 'state_label');
}

function loadMapInformation() {
  calculateClientSize();
  initializeCanvas();

  // Set new data on your chart:
  svg = d3
    .select('#d3js-plt-content-map')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  g = svg.append('g');
  g.attr('id', 'd3js-brMap');
  d3.select(self.frameElement).style('height', height + 'px');

  // Align center of Brazil to center of map
  var projection = d3
    .geoMercator()
    .scale(815)
    .center([-52, -15])
    .translate([width / 2 + 20, height / 2]);
  path = d3.geoPath().projection(projection);

  /* States geo data from https://bl.ocks.org/ppKrauss/0c33364240e841fa23e78b21005f792c*/
  d3.json('./br-states.json').then(function (geoStateData) {
    geo_state_data = geoStateData;
    d3.json('./data.json').then(function (ibgeData) {
      processData(geoStateData, ibgeData);
      showCanvas();
    });
  });
}
