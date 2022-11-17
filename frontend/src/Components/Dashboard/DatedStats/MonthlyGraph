import React, { Component } from "react";
import Chart from "react-apexcharts";

class MonthlyGraph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          id: "Total Interactions"
        },
        xaxis: {
          categories: ['SEP', "OCT", 'NOV', 'DEC']
        }
      },
      series: [
        {
          name: "Interactions",
          data: [30, 40, 45, 50]
        }
      ]
    };
  }

  render() {
    return (
      <div className="app">
        <div className="row">
          <div className="mixed-chart">
            <Chart
              options={this.state.options}
              series={this.state.series}
              type="bar"
              width="100%"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default MonthlyGraph;