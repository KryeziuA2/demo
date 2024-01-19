class SleepActivityRelationshipVisualizer {
  constructor(data) {
    this.data = data;
  }

  createVisualization() {
    const activityLevels = Object.values(this.data['Physical Activity Level']);
    const sleepQualities = Object.values(this.data['Quality of Sleep']);

    const svg = d3.select("#sleepActivityRelationship")
      .append("svg")
      .attr("width", 400)
      .attr("height", 300);

    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const x = d3.scaleLinear()
      .domain([0, d3.max(activityLevels)]).nice()
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(sleepQualities)]).nice()
      .range([height - margin.bottom, margin.top]);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .append("text")
      .attr("x", width / 2)
      .attr("y", 35)
      .attr("fill", "#000")
      .text("Physical Activity Level");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -35)
      .attr("x", -height / 2)
      .attr("fill", "#000")
      .attr("text-anchor", "middle")
      .text("Quality of Sleep");

    svg.selectAll("circle")
      .data(activityLevels.map((activity, index) => ({ activity, sleepQuality: sleepQualities[index] })))
      .enter().append("circle")
      .attr("cx", d => x(d.activity))
      .attr("cy", d => y(d.sleepQuality))
      .attr("r", 5)
      .attr("fill", "steelblue");

    // Define padding values
    const paddingLeft = 35; // Adjust as needed
    const paddingTop = 5; // Adjust as needed

    // Add text with padding
    svg.append("text")
      .attr("x", width / 2 + paddingLeft)  // Adjust the left padding
      .attr("y", margin.top / 2 + paddingTop)  // Adjust the top padding
  }
}

// Fetch data from FastAPI endpoint
fetch('http://localhost:8000/read_dataset')
  .then(response => response.json())
  .then(data => {
    const sleepActivityVisualizer = new SleepActivityRelationshipVisualizer(data.data);
    sleepActivityVisualizer.createVisualization();
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
