class OccupationVisualizer {
    constructor(data) {
      this.data = data;
    }
  
    createVisualization() {
      const occupationCounts = Object.values(this.data['Occupation']).reduce((counts, occupation) => {
        counts[occupation] = (counts[occupation] || 0) + 1;
        return counts;
      }, {});
  
      const occupationData = Object.keys(occupationCounts).map(occupation => ({
        occupation,
        count: occupationCounts[occupation]
      }));
  
      const svg = d3.select("#occupation")
        .append("svg")
        .attr("width", 400)
        .attr("height", 300);
  
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = 400 - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;
  
      const x = d3.scaleBand()
        .domain(occupationData.map(d => d.occupation))
        .range([margin.left, width - margin.right])
        .padding(0.1);
  
      const y = d3.scaleLinear()
        .domain([0, d3.max(occupationData, d => d.count)]).nice()
        .range([height - margin.bottom, margin.top]);
  
      svg.append("g")
        .attr("fill", "steelblue")
        .selectAll("rect")
        .data(occupationData)
        .join("rect")
        .attr("x", d => x(d.occupation))
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
    .attr("y", margin.top / 2 + paddingTop)  // Adjust the top padding
    ;
    }
  }
  
  // Fetch data from FastAPI endpoint
  fetch('http://localhost:8000/read_dataset')
    .then(response => response.json())
    .then(data => {
      const occupationVisualizer = new OccupationVisualizer(data.data);
      occupationVisualizer.createVisualization();
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  