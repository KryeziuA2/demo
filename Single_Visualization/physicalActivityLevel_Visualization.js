class PhysicalActivityLevelVisualizer {
    constructor(data) {
        this.data = data;
    }

    createVisualization() {
        const physicalActivityLevels = Object.values(this.data['Physical Activity Level']);
        const physicalActivityLevelCounts = {};

        physicalActivityLevels.forEach(activity => {
            const activityGroup = Math.floor(activity);
            physicalActivityLevelCounts[activityGroup] = (physicalActivityLevelCounts[activityGroup] || 0) + 1;
        });

        const physicalActivityLevelData = Object.keys(physicalActivityLevelCounts).map(activityGroup => ({
            activityGroup,
            count: physicalActivityLevelCounts[activityGroup]
        }));

        physicalActivityLevelData.sort((a, b) => a.activityGroup - b.activityGroup);

        const svg = d3.select("#physicalActivityLevel")
            .append("svg")
            .attr("width", 400)
            .attr("height", 300);

        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 400 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const x = d3.scaleBand()
            .domain(physicalActivityLevelData.map(d => d.activityGroup))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, 100]) // Assuming 100 as the maximum value
            .range([height - margin.bottom, margin.top]);

        svg.append("g")
            .attr("fill", "steelblue")
            .selectAll("rect")
            .data(physicalActivityLevelData)
            .join("rect")
            .attr("x", d => x(d.activityGroup))
            .attr("y", d => y(d.count))
            .attr("height", d => y(0) - y(d.count))
            .attr("width", x.bandwidth());

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
        const physicalActivityLevelVisualizer = new PhysicalActivityLevelVisualizer(data.data);
        physicalActivityLevelVisualizer.createVisualization();
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
