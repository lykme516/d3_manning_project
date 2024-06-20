// load top_albums.csv
d3.csv('../data/top_albums.csv').then(data => {
    console.log('data', data);
    createBubbleChart(data);
});

// Create and append the charat
const createBubbleChart = (data) => {
    const metrics = ['total_album_consumption_millions', 'album_sales_millions', 'song_sales', 'on_demand_audio_streams_millions', 'on_demand_video_streams_millions'];
    const artists = [];

    // format
    data.forEach(datum => {
        metrics.forEach(metric => {
            datum[metric] = parseFloat(datum[metric]); // convert string to numbers
        });
        artists.push(datum.artist);  // populate the artists array
    });

    // set chart dimensions
    const width = 1160;
    const height = 400;
    const margin = {top: 60, right: 0, bottom: 60, left: 40};

    const bubbleChart = d3.select('#bubble-chart')
        .append('svg')
            .attr('viewbox', [0, 0, width, height])
            .attr('width', width)
            .attr('height', height);
    
    const audioStreamsScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.on_demand_audio_streams_millions + 500)])
        .range([margin.left, width - margin.left - margin.right]);

    // Create and append x-axis 'On-demand Audio Streams'
    bubbleChart
        .append('g')
            .attr('transform', `translate(0, ${height - margin.bottom - margin.top})`)
            .call(d3.axisBottom(audioStreamsScale));
    bubbleChart
        .append('text')
            .attr('text-anchor', 'end')
            .attr('x', width - margin.left)
            .attr('y', height - margin.top - margin.bottom + 50)
            .text('On-demand Audio Streams (millions)')
            .style('font-weight', 700);
    
    // Create and append y-axis - On-demand video streams
    const videoStreamsScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.on_demand_video_streams_millions) + 300])
        .range([height - margin.top - margin.bottom, margin.top]);
    bubbleChart
        .append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(videoStreamsScale));
    bubbleChart
        .append('text')
            .attr('text-anchor', 'start')
            .attr('x', 0)
            .attr('y', 20)
            .text('On-demand Video Streams (millions)')
            .style('font-weight', 700);

    const bubblesAreaScale = d3.scaleSqrt()
        .domain([0, d3.max(data, d => d.album_sales_millions)])
        .range([0, 25]);
    const colorScale = d3.scaleOrdinal()
        .domain(artists)
        .range(d3.schemeTableau10);
    
    // Bind data to circles and position them on chart
    bubbleChart
        .append('g')
            .attr('class', 'bubbles-group')
        .selectAll('circle')
        .data(data)
        .join('circle')
            .attr('cx', d => audioStreamsScale(d.on_demand_audio_streams_millions))
            .attr('cy', d => videoStreamsScale(d.on_demand_video_streams_millions))
            .attr('r', d => bubblesAreaScale(d.album_sales_millions))
            .attr('fill', d => colorScale(d.artist));
    
    // append color legend
    const colorLegend = d3.select('.legend-color')
        .append('ul')
        .selectAll('.bubble-color-legend-item')
        .data(data)
        .join('li')
            .attr('class', 'bubble-color-legend-item');
    colorLegend
        .append('span')
            .attr('class', 'legend-circle')
            .style('background-color', (d, i) => {
                return d3.schemeTableau10[i];
            });
    colorLegend
        .append('span')
            .attr('class', 'legend-label')
            .text(d => `${d.title}, ${d.artist}`);
    
    // Append area legend
    const areaLegendCircles = d3.select('.legend-area')
        .append('svg')
            .attr('viewbox', [0, 0, 150, 100])
            .attr('width', 150)
            .attr('height', 100);
    
    const circlesGroup = areaLegendCircles
        .append('g')
            .attr('class', 'circles-group')
            .attr('fill', '#727a87')
            .attr('fill-opacity', 0.4);
    
    circlesGroup
        .append('circle')
            .attr('cx', bubblesAreaScale(1.5))
            .attr('cy', bubblesAreaScale(1.5) + 5)
            .attr('r', bubblesAreaScale(1.5));
    circlesGroup
        .append('circle')
            .attr('cx', bubblesAreaScale(1.5))
            .attr('cy', 2 * bubblesAreaScale(1.5) - bubblesAreaScale(0.5) + 5)
            .attr('r', bubblesAreaScale(0.5))
    circlesGroup
        .append('circle')
            .attr('cx', bubblesAreaScale(1.5))
            .attr('cy', 2 * bubblesAreaScale(1.5) - bubblesAreaScale(0.1) + 5)
            .attr('r', bubblesAreaScale(0.1))
    
    const linesGroup = areaLegendCircles
        .append('g')
            .attr('class', 'lines-group')
            .attr('stroke', '#333') // Same here, I can apply the lines styles to the group instead of repeating them for each line
            .attr('stroke-dasharray', '6 4');
    linesGroup
        .append('line')
            .attr('x1',  bubblesAreaScale(1.5))
            .attr('y1', 5)
            .attr('x2',  bubblesAreaScale(1.5) + 60)
            .attr('y2', 5);
    linesGroup
        .append('line')
            .attr('x1',  bubblesAreaScale(1.5))
            .attr('y1', 2 * bubblesAreaScale(1.5) - 2 * bubblesAreaScale(0.5) + 5)
            .attr('x2',  bubblesAreaScale(1.5) + 60)
            .attr('y2', 2 * bubblesAreaScale(1.5) - 2 * bubblesAreaScale(0.5) + 5);
    linesGroup
        .append('line')
            .attr('x1',  bubblesAreaScale(1.5))
            .attr('y1', 2 * bubblesAreaScale(1.5) - 2 * bubblesAreaScale(0.1) + 5)
            .attr('x2',  bubblesAreaScale(1.5) + 60)
            .attr('y2', 2 * bubblesAreaScale(1.5) - 2 * bubblesAreaScale(0.1) + 5);
            
    const labelsGroup = areaLegendCircles
        .append('g')
            .attr('class', 'labels-group')
            .attr('fill', '#333');
    labelsGroup
        .append('text')
            .attr('class', 'label')
            .attr('x',  bubblesAreaScale(1.5) + 70)
            .attr('y', 10)
            .text('1.5M');
    labelsGroup
        .append('text')
            .attr('class', 'label')
            .attr('x',  bubblesAreaScale(1.5) + 70)
            .attr('y', 2 * bubblesAreaScale(1.5) - 2 * bubblesAreaScale(0.5) + 10)
            .text('0.5M');
    labelsGroup
        .append('text')
            .attr('class', 'label')
            .attr('x',  bubblesAreaScale(1.5) + 70)
            .attr('y', 2 * bubblesAreaScale(1.5) - 2 * bubblesAreaScale(0.1) + 10)
            .text('0.1M');
};

    






