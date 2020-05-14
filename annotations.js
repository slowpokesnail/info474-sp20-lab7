// measurements for our viz
const m = {
    width: 800,
    height: 600,
    margin: 50 // margin for all sides
}

// append svg to body
// mention how this is different from observable
const svg = d3.select('body').append('svg')
    .attr('width', m.width)
    .attr('height', m.height)

// load in data and create scatter plot
// take note of the .then vs using cells to handle async
d3.csv('pokemon.csv').then((data) => {

    // create the scales
    // everything here is the same as what you would do on
    // observable

    const xLimits = d3.extent(data, d => d.Attack)
    const xScale = d3.scaleLinear()
        .domain(xLimits)
        .range([m.margin, m.width - m.margin])
        .nice() //  get nice rounded numbers

    const yLimits = d3.extent(data, d => d.Defense)
    const yScale = d3.scaleLinear()
        .domain(yLimits)
        .range([m.height - m.margin, m.margin])

    // append the axes
    const xAxis = d3.axisBottom().scale(xScale)
    svg.append('g')
        .attr('transform', `translate(0,${m.height - m.margin})`)
        .call(xAxis)

    const yAxis = d3.axisLeft().scale(yScale)
    svg.append('g')
        .attr('transform', `translate(${m.margin},0)`)
        .call(yAxis)

    // append the points using an update function
    // mention how this is analogous to chart.update
    function update(data) {
        svg.selectAll('circle')
            .data(data)
            .join(
                enter => enter.append('circle')
                    .attr('cx', d => xScale(d.Attack))
                    .attr('cy', d => yScale(d.Defense))
                    .attr('r', 5)
                    .attr('fill', 'steelblue'),
                update => update, // don't do anything
                exit => exit.remove()            
            )
            .attr('cx', d => xScale(d.Attack))
            .attr('cy', d => yScale(d.Defense))
    }
    update(data)

    // append the title and axes labels
    svg.append('text')
            .attr('x', m.width/2)
            .attr('y', m.height - m.margin + 30)
            .attr('text-anchor', 'middle')
            .text("Attack")

    svg.append('text')
            .attr('transform', `translate(${15}, ${m.height/2})rotate(-90)`)
            .text("Defense")

    svg.append('text')
            .attr('x', m.width/2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .text("Pokemon Attack vs Defense")

    // make a filter of pokemon Type 1
    // this part is significantly different than observable
    const filter = d3.select('body')
            .append('select')
    
    // get an array of types 
    const types = [...new Set(data.map(d => d['Type 1']))]
    
    // append filter
    // in observable we can do this much easier with an import
    filter.selectAll('option')
        .data(types)
        .join(
            enter => enter.append('option')
                .attr('value', d => d)
                .text(d => d)
        )

    /**
     * get the value of the dropdown on change
     * and use update function to update data
     * mention how we can use 'this'
     * also mention that we have to use 'function' keyword
     * if we want 'this' to work correctly
     */ 
    filter.on('change', function() {
        const type = d3.select(this).node().value
        const filteredData = data.filter(d => d['Type 1'] == type)
        update(filteredData)
    })

})