class StressLevelVisualizer {
    constructor(data) {
      this.data = data;
    }
  
    createVisualization() {
      const stressLevels = Object.values(this.data['Stress Level']);
      const stressLevelCounts = {};
  
      stressLevels.forEach(level => {
        const levelGroup = Math.floor(level);
        stressLevelCounts[levelGroup] = (stressLevelCounts[levelGroup] || 0) + 1;
      });
  
      const stressLevelData = Object.keys(stressLevelCounts).map(levelGroup => ({
        levelGroup,
        count: stressLevelCounts[levelGroup]
      }));
  
      stressLevelData.sort((a, b) => a.levelGroup - b.levelGroup);
  
      const svg = d3.select("#stressLevel")
        .append("svg")
        .attr("width", 400)
        .attr("height", 300);
  
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = 400 - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;
  
      const x = d3.scaleBand()
        .domain(stressLevelData.map(d => d.levelGroup))
        .range([margin.left, width - margin.right])
        .padding(0.1);
  
      const y = d3.scaleLinear()
        .domain([0, d3.max(stressLevelData, d => d.count)]).nice()
        .range([height - margin.bottom, margin.top]);
  
      svg.append("g")
        .attr("fill", "steelblue")
        .selectAll("rect")
        .data(stressLevelData)
        .join("rect")
        .attr("x", d => x(d.levelGroup))
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
        .text("Stress Level Distribution");
    }
  }
  
  // Fetch data from FastAPI endpoint
  fetch('http://localhost:8000/read_dataset')
    .then(response => response.json())
    .then(data => {
      const stressLevelVisualizer = new StressLevelVisualizer(data.data);
      stressLevelVisualizer.createVisualization();
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  