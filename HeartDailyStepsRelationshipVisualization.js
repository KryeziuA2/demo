class HeartRateStepsRelationshipVisualizer {
    constructor(data) {
      this.data = data;
    }
  
    createVisualization() {
      try {
        const heartRates = Object.values(this.data['Heart Rate']);
        const dailySteps = Object.values(this.data['Daily Steps']);
  
        const svg = d3.select("#heartDailyStepsRelationship")
          .append("svg")
          .attr("width", 400)
          .attr("height", 300);
  
        const margin = { top: 30, right: 30, bottom: 50, left: 50 };
        const width = 400 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;
  
        const x = d3.scaleLinear()
          .domain([0, d3.max(heartRates)]).nice()
          .range([margin.left, width - margin.right]);
  
        const y = d3.scaleLinear()
          .domain([0, d3.max(dailySteps)]).nice()
          .range([height - margin.bottom, margin.top]);
  
        svg.append("g")
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .call(d3.axisBottom(x))
          .append("text")
          .attr("x", width / 2)
          .attr("y", margin.bottom - 5) // Adjusted position
          .attr("fill", "#000")
          .text("Heart Rate");
  
        svg.append("g")
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y))
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", -margin.left + 10) // Adjusted position
          .attr("x", -height / 2)
          .attr("fill", "#000")
          .attr("text-anchor", "middle")
          .text("Daily Steps");
  
        svg.selectAll("circle")
          .data(heartRates.map((heartRate, index) => ({ heartRate, dailyStepsValue: dailySteps[index] })))
          .enter().append("circle")
          .attr("cx", d => x(d.heartRate))
          .attr("cy", d => y(d.dailyStepsValue))
          .attr("r", 5)
          .attr("fill", "steelblue");
  
        // Add labels, title, etc. if needed
  
        console.log('Data fetched:', this.data);
        console.log('Heart Rates:', heartRates);
        console.log('Daily Steps:', dailySteps);
        console.log('Visualization created.');
      } catch (error) {
        console.error('Error creating visualization:', error);
      }
    }
  }
  
  // Fetch data from FastAPI endpoint
  fetch('http://localhost:8000/read_dataset')
    .then(response => response.json())
    .then(data => {
      const heartRateStepsVisualizer = new HeartRateStepsRelationshipVisualizer(data.data);
      heartRateStepsVisualizer.createVisualization();
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  