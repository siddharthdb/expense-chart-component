import "./styles/index.less";
import { max } from "lodash";
import * as d3 from "d3";
// import data from "./data.json";

const data = [
  {
    "day": "mon",
    "amount": 17.45
  },
  {
    "day": "tue",
    "amount": 34.91
  },
  {
    "day": "wed",
    "amount": 52.36
  },
  {
    "day": "thu",
    "amount": 31.07
  },
  {
    "day": "fri",
    "amount": 23.39
  },
  {
    "day": "sat",
    "amount": 43.28
  },
  {
    "day": "sun",
    "amount": 25.48
  }
]

function ExpenseChart() {

  this.init = () => {    
    const isMobile = window.innerWidth < 575;

    const maxValue = max(data.map(d => d.amount));
    
    const HEIGHT = 178,
      WIDTH = d3.select("#expense-bar").node().getBoundingClientRect().width,
      margin = { top: 30, right: 0, bottom: 30, left: 0 };

    let svg = d3
      .select("#expense-bar")
      .append("svg")
      .attr("width", d3.select("#expense-bar").node().getBoundingClientRect().width)
      .attr("height", HEIGHT + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    let x = d3.scaleBand().range([0, WIDTH]).padding(0.28);
    let y = d3.scaleLinear().range([HEIGHT, 0]);

    function createAxisLeft(data) {
      y.domain([
        0,
        d3.max(
          data.map((e) => e.amount),
          (d) => Number(d)
        ),
      ]).nice();

      svg.append("g")
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll('.tick').remove());
    }

    function formatText(text) {
      text
      .selectAll("text")
      .attr("x", 0)
      .attr("y", 10)
      .style("font-size", "14px")
      .style("fill", "#92857A");
    }

    function createAxisBottom(data) {
      x.domain(data.map((e) => e.day));
      const text = svg
        .append("g")
        .attr("transform", `translate(0, ${HEIGHT})`)
        .call(d3.axisBottom(x))
        .call(g => g.select(".domain").remove());
      formatText(text, x);
    }

    function addLabelsToBars(bars) {

      const xRectDiff = !isMobile ? 5 : 7;
      const yRectDiff = !isMobile ? 35 : 30;

      bars
        .append("rect")
        .attr("class", "bglbl")
        .attr("x", (d) => x(d.day) - xRectDiff)
        .attr("y", (d) => y(d.amount) - yRectDiff)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("width", isMobile ? 45 : 60)
        .attr("height", isMobile ? 25 : 30)
        .style("visibility", "hidden")
        .style("fill", "#382314");

      bars
        .append("text")
        .text((d) => `$${d.amount}`)
        .style("opacity", 0)
        .attr("class", "txtlbl")
        .attr("x", (d) => x(d.day) + x.bandwidth() / 2)
        .attr("y", (d) => y(d.amount) - 15)
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .style("visibility", "hidden")
        .transition()
        .duration(500)
        .style("opacity", 1);
    }

    function createBars(data) {
      const bars = svg
        .selectAll(".bars")
        .data(data, (d) => d.day)
        .enter()
        .append("g")
        .attr("class", "bars")
        .style("opacity", 1);

      // Appending rectangles
      bars
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => x(d.day))
        .attr("y", (d) => y(0))
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .style("fill", function(d) {
          if (d.amount === maxValue) {
            return "#76B5BC";
          } else {
            return "#EC755D";
          }

        })
        .on("mouseover", function(d) {
          d3.select(this.parentNode).select('.txtlbl').style('visibility', 'visible');
          d3.select(this.parentNode).select('.bglbl').style('visibility', 'visible');
          d3.select(this.parentNode).select('.bar').style("opacity", 0.6);
        })
        .on("mouseout", function(d) {
          d3.select(this.parentNode).select('.txtlbl').style('visibility', 'hidden');
          d3.select(this.parentNode).select('.bglbl').style('visibility', 'hidden');
          d3.select(this.parentNode).select('.bar').style("opacity", 1);
        })
        .transition()
        .duration(750)
        .attr("y", (d) => y(d.amount))
        .attr("height", (d) => HEIGHT - y(d.amount));

      addLabelsToBars(bars);
    }

    createAxisLeft(data);
    createAxisBottom(data);
    createBars(data);    
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const expenseChart = new ExpenseChart();
  expenseChart.init();
});
