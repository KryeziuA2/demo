class QualityOfSleepVisualizer {
    constructor(data) {
        this.data = data;
    }

    createVisualization() {
        const qualityOfSleepValues = Object.values(this.data['Quality of Sleep']);
        const qualityOfSleepCounts = {};

        qualityOfSleepValues.forEach(quality => {
            const qualityGroup = Math.floor(quality);
            qualityOfSleepCounts[qualityGroup] = (qualityOfSleepCounts[qualityGroup] || 0) + 1;
        });

        const qualityOfSleepData = Object.keys(qualityOfSleepCounts).map(qualityGroup => ({
            qualityGroup,
            count: qualityOfSleepCounts[qualityGroup]
        }));

        qualityOfSleepData.sort((a, b) => a.qualityGroup - b.qualityGroup);

        const svg = d3.select("#qualityOfSleep")
            .append("svg")
            .attr("width", 400)
            .attr("height", 300);

        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 400 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const x = d3.scaleBand()
            .domain(qualityOfSleepData.map(d => d.qualityGroup))
            .range([margin.left, width - margin.right])
            .padding(0.1);

            const y = d3.scaleLinear()
            .domain([0, 24]) // Assuming 24 hours as the maximum value
            .range([height - margin.bottom, margin.top]);

        svg.append("g")
            .attr("fill", "steelblue")
            .selectAll("rect")
            .data(qualityOfSleepData)
            .join("rect")
            .attr("x", d => x(d.qualityGroup))
            .attr("y", d => y(d.count))
            .attr("height", d => y(0) - y(d.count))
            .attr("width", x.bandwidth());

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));

        // Add text with padding
        const paddingLeft = 20; // Adjust as needed
        const paddingTop = 5; // Adjust as needed

        svg.append("text")
            .attr("x", width / 2 + paddingLeft)  // Adjust the left padding
            .attr("y", margin.top / 2 + paddingTop)  // Adjust the top padding
    }
}

// Fetch data from FastAPI endpoint
fetch('http://localhost:8000/read_dataset')
    .then(response => response.json())
    .then(data => {
        const qualityOfSleepVisualizer = new QualityOfSleepVisualizer(data.data);
        qualityOfSleepVisualizer.createVisualization();
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
