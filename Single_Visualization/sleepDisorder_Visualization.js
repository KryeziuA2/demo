class SleepDisorderVisualizer {
    constructor(data) {
        this.data = data;
    }

    createVisualization() {
        try {
            const sleepDisorderCounts = Object.values(this.data['Sleep Disorder']).reduce((counts, disorder) => {
                counts[disorder] = (counts[disorder] || 0) + 1;
                return counts;
            }, {});

            const sleepDisorderData = Object.keys(sleepDisorderCounts).map(disorder => ({
                disorder,
                count: sleepDisorderCounts[disorder]
            }));

            console.log('Sleep Disorder Data:', sleepDisorderData); // Log sleep disorder data

            const svg = d3.select("#sleepDisorder")
                .append("svg")
                .attr("width", 400)
                .attr("height", 300);

            console.log('SVG Element:', svg); // Log the SVG element

            const margin = { top: 20, right: 20, bottom: 30, left: 40 };
            const width = 400 - margin.left - margin.right;
            const height = 300 - margin.top - margin.bottom;

            const x = d3.scaleBand()
                .domain(sleepDisorderData.map(d => d.disorder))
                .range([margin.left, width - margin.right])
                .padding(0.1);

            const y = d3.scaleLinear()
                .domain([0, d3.max(sleepDisorderData, d => d.count)]).nice()
                .range([height - margin.bottom, margin.top]);

            console.log('X Scale:', x); // Log X scale
            console.log('Y Scale:', y); // Log Y scale

            svg.append("g")
                .attr("fill", "steelblue")
                .selectAll("rect")
                .data(sleepDisorderData)
                .join("rect")
                .attr("x", d => x(d.disorder))
                .attr("y", d => y(d.count))
                .attr("height", d => y(0) - y(d.count))
                .attr("width", x.bandwidth());

            svg.append("g")
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "rotate(-45)")
                .style("text-anchor", "end");

            svg.append("g")
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y));

            // Define padding values
            const paddingLeft = 20; // Adjust as needed
            const paddingTop = 5; // Adjust as needed

            // Add text with padding
            svg.append("text")
                .attr("x", width / 2 + paddingLeft)  // Adjust the left padding
                .attr("y", margin.top / 2 + paddingTop);  // Adjust the top padding
        } catch (error) {
            console.error('Error creating visualization:', error);
        }
    }
}

// Fetch data from FastAPI endpoint
fetch('http://localhost:8000/read_dataset')
    .then(response => response.json())
    .then(data => {
        const sleepDisorderVisualizer = new SleepDisorderVisualizer(data.data);
        sleepDisorderVisualizer.createVisualization();
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
