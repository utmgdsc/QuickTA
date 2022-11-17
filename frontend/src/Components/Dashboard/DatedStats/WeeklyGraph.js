import React, { Component } from "react";
import Chart from "react-apexcharts";

class WeeklyGraph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          id: "Total Interactions"
        },
        xaxis: {
          categories: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
        }
      },
      series: [
        {
          name: "Interactions",
          data: [30, 40, 45, 50, 49, 60, 70]
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
              type="line"
              width="100%"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default WeeklyGraph;