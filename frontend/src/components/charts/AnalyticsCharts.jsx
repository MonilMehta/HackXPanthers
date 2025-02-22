import React from "react";
import ReactApexChart from "react-apexcharts";

export const BookingTrendsChart = () => {
  const options = {
    chart: {
      type: "area",
      toolbar: { show: false },
      background: "transparent",
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    grid: { show: false },
    theme: { mode: "dark" },
  };

  const series = [
    {
      name: "Bookings",
      data: [30, 40, 35, 50, 49, 60, 70],
    },
  ];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="area"
      height={350}
    />
  );
};

export const UserDemographicsChart = () => {
  const options = {
    chart: {
      type: "donut",
      background: "transparent",
    },
    labels: ["Artists", "Venues", "Customers"],
    colors: ["#ff9800", "#4caf50", "#2196f3"],
    legend: {
      position: "bottom",
    },
    theme: { mode: "dark" },
  };

  const series = [44, 55, 67];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="donut"
      height={350}
    />
  );
};

export const PeakHoursHeatMap = () => {
  const options = {
    chart: {
      type: "heatmap",
      background: "transparent",
    },
    dataLabels: { enabled: false },
    colors: ["#008FFB"],
    theme: { mode: "dark" },
  };

  const series = [
    {
      name: "Bookings",
      data: generateHeatMapData(),
    },
  ];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="heatmap"
      height={250}
    />
  );
};

export const RevenueChart = () => {
  const options = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    theme: { mode: "dark" },
  };

  const series = [
    {
      name: "Revenue",
      data: [2100, 1800, 2800, 2300, 2600, 3200, 2900],
    },
  ];

  return (
    <ReactApexChart options={options} series={series} type="bar" height={350} />
  );
};

function generateHeatMapData() {
  return Array.from({ length: 7 }, (_, i) => ({
    name: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100)),
  }));
}
