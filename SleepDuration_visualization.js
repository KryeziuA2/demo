class SleepDurationVisualizer {
    constructor(data) {
      this.data = data;
    }
  
    createVisualization() {
      const sleepDurations = Object.values(this.data['Sleep Duration']);
      const durationCounts = {};
  
      sleepDurations.forEach(duration => {
        const durationGroup = Math.floor(duration);
        durationCounts[durationGroup] = (durationCounts[durationGroup] || 0) + 1;
      });
  
      const durationData = Object.keys(durationCounts).map(durationGroup => ({
        durationGroup,
        count: durationCounts[durationGroup]
      }));
  
      durationData.sort((a, b) => a.durationGroup - b.durationGroup);
  
      const svg = d3.select("#sleepDuration")
        .append("svg")
        .attr("width", 400)
        .attr("height", 300);
  
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = 400 - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;
  
      const x = d3.scaleBand()
        .domain(durationData.map(d => d.durationGroup))
        .range([margin.left, width - margin.right])
        .padding(0.1);
  
      const y = d3.scaleLinear()
        .domain([0, d3.max(durationData, d => d.count)]).nice()
        .range([height - margin.bottom, margin.top]);
  
      svg.append("g")
        .attr("fill", "steelblue")
        .selectAll("rect")
        .data(durationData)
        .join("rect")
        .attr("x", d => x(d.durationGroup))
        .attr("y", d => y(d.count))
        .attr("height", d => y(0) - y(d.count))
        .attr("width", x.bandwidth());
  
      svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));
  
      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));
  
    // Define padding values
const paddingLeft = 20; // Adjust as needed
const paddingTop = 5; // Adjust as needed

// Add text with padding
svg.append("text")
    .attr("x", width / 2 + paddingLeft)  // Adjust the left padding
    .attr("y", margin.top / 2 + paddingTop)  // Adjust the top padding
    .attr("text-anchor", "middle")
        .text("Sleep Duration Distribution");
    }
  }
  
  // Fetch data from FastAPI endpoint
  fetch('http://localhost:8000/read_dataset')
    .then(response => response.json())
    .then(data => {
      const sleepDurationVisualizer = new SleepDurationVisualizer(data.data);
      sleepDurationVisualizer.createVisualization();
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  