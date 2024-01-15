class StressSleepRelationshipVisualizer {
    constructor(data) {
      this.data = data;
    }
  
    createVisualization() {
      const stressLevels = Object.values(this.data['Stress Level']);
      const sleepDurations = Object.values(this.data['Sleep Duration']);
  
      const svg = d3.select("#stressSleepRelationship")
        .append("svg")
        .attr("width", 400)
        .attr("height", 300);
  
      const margin = { top: 30, right: 30, bottom: 50, left: 50 };
      const width = 400 - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;
  
      const x = d3.scaleLinear()
        .domain([0, d3.max(stressLevels)]).nice()
        .range([margin.left, width - margin.right]);
  
      const y = d3.scaleLinear()
        .domain([0, d3.max(sleepDurations)]).nice()
        .range([height - margin.bottom, margin.top]);
  
      svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .append("text")
        .attr("x", width / 2)
        .attr("y", 35)
        .attr("fill", "#000")
        .text("Stress Level");
  
      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -35)
        .attr("x", -height / 2)
        .attr("fill", "#000")
        .attr("text-anchor", "middle")
        .text("Sleep Duration");
  
      svg.selectAll("circle")
        .data(stressLevels.map((stress, index) => ({ stress, sleepDuration: sleepDurations[index] })))
        .enter().append("circle")
        .attr("cx", d => x(d.stress))
        .attr("cy", d => y(d.sleepDuration))
        .attr("r", 5)
        .attr("fill", "steelblue");

        // Define padding values
        const paddingLeft = 35; // Adjust as needed
        const paddingTop = 5; // Adjust as needed
        
        // Add text with padding
        svg.append("text")
            .attr("x", width / 2 + paddingLeft)  // Adjust the left padding
            .attr("y", margin.top / 2 + paddingTop)  // Adjust the top padding
            .attr("text-anchor", "middle")
        .text("Stress Level Vs Sleep Duration");
    }
  }
  
  // Fetch data from FastAPI endpoint
  fetch('http://localhost:8000/read_dataset')
    .then(response => response.json())
    .then(data => {
      const stressSleepVisualizer = new StressSleepRelationshipVisualizer(data.data);
      stressSleepVisualizer.createVisualization();
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  