class AgeVisualizer {
    constructor(data) {
      this.data = data;
    }
  
    createVisualization() {
      const ages = Object.values(this.data['Age']);
      const ageCounts = {};
      
      ages.forEach(age => {
        ageCounts[age] = (ageCounts[age] || 0) + 1;
      });
  
      const ageData = Object.keys(ageCounts).map(age => ({
        age: parseInt(age),
        count: ageCounts[age]
      }));
  
      ageData.sort((a, b) => a.age - b.age);
  
      const svg = d3.select("#age")
        .append("svg")
        .attr("width", 400)
        .attr("height", 300);
  
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = 400 - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;
  
      const x = d3.scaleLinear()
        .domain(d3.extent(ageData, d => d.age))
        .range([margin.left, width - margin.right]);
  
      const y = d3.scaleLinear()
        .domain([0, d3.max(ageData, d => d.count)]).nice()
        .range([height - margin.bottom, margin.top]);
  
      const line = d3.line()
        .x(d => x(d.age))
        .y(d => y(d.count));
  
      svg.append("g")
        .append("path")
        .datum(ageData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);
  
      svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));
  
      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));
  
      // Define padding values
// Define padding values
const paddingLeft = 20; // Adjust as needed
const paddingTop = 5; // Adjust as needed

// Add text with padding
svg.append("text")
    .attr("x", width / 2 + paddingLeft)  // Adjust the left padding
    .attr("y", margin.top / 2 + paddingTop)  // Adjust the top padding
    .attr("text-anchor", "middle")
   
    }
  }
  
  // Fetch data from FastAPI endpoint
  fetch('http://localhost:8000/read_dataset')
    .then(response => response.json())
    .then(data => {
      const ageVisualizer = new AgeVisualizer(data.data);
      ageVisualizer.createVisualization();
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  