const topRockSongs = [
    { artist: "Fleetwod Mac", title: "Dreams", sales_and_streams: 1882000},
    { artist: "AJR", title: "Bang!", sales_and_streams: 1627000},
    { artist: "Imagine Dragons", title: "Believer", sales_and_streams: 1571000},
    { artist: "Journey", title: "Don't Stop Believin", sales_and_streams: 1497000},
    { artist: "Eagles", title: "Hotel California", sales_and_streams: 1393000}
];

const topSongsSection = d3.select('#top-songs')

topSongsSection.append('h3').text('Top Rock Songs')

const circlesChartWidth = 550;
const circlesChartHeight = 130;
const circlesChart = topSongsSection
    .append('svg')
        .attr('viewbox', [0, 0, circlesChartWidth, circlesChartHeight])
        .attr('width', circlesChartWidth)
        .attr('height', circlesChartHeight);

const marginTop = circlesChartHeight / 2;

circlesChart
    .append('line')
    .attr('x1', 0)
    .attr('y1', marginTop)
    .attr('x2', circlesChartWidth)
    .attr('y2', marginTop)
    .attr('stroke', '#333')
    .attr('stroke-width', 2);

const radiusMax = 40;
const circlesScale = d3.scaleSqrt()
    .domain([0, d3.max(topRockSongs, d => d.sales_and_streams)])
    .range([0, radiusMax])

const circlesChartGroups = circlesChart
    .selectAll('.circle-group')
    .data(topRockSongs)
    .join('g')
        .attr('class', 'circle-group');

const circlesSpacing = 15;
circlesChartGroups
    .append('circle')
        .attr('r', d => circlesScale(d.sales_and_streams))
        .attr('cx', (d, i) => {
            console.log(radiusMax + circlesSpacing + (i * 2 * (radiusMax + circlesSpacing)));
            return radiusMax + circlesSpacing + (i * 2 * (radiusMax + circlesSpacing));
        })
        .attr('cy', circlesChartHeight / 2)
        .attr('fill', '#8da0cb');

// Add labels for the number of songs sold and streamed
circlesChartGroups
    .append('text')
        .attr('class', 'label label-group')
        .attr('x', (d, i) => radiusMax + circlesSpacing + (i * 2 * (radiusMax + circlesSpacing)))
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .text(d => (d.sales_and_streams / 1000000) + 'M');


// Add labels for the songs titles
circlesChartGroups
    .append('text')
        .attr('class', 'label label-group')
        .attr('x', (d, i) => radiusMax + circlesSpacing + (i * 2 * (radiusMax + circlesSpacing)))
        .attr('y', circlesChartHeight - 5)
        .attr('text-anchor', 'middle')
        .text(d => d.title);
