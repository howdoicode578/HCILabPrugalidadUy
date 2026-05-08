import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

import "./analytics.css";

const Analytics = () => {

  const [chartData, setChartData] = useState({});
  const [comparisonData, setComparisonData] = useState([]);

  const [filter, setFilter] = useState("daily");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [filter]);

  // WEEK NUMBER FUNCTION
  const getWeekNumber = (date) => {
    const firstDay = new Date(date.getFullYear(), 0, 1);
    const pastDays = (date - firstDay) / 86400000;

    return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
  };

  // FETCH ANALYTICS
  const fetchAnalytics = async () => {
    try {
      const res = await axios.get("http://localhost:5000/orders");
      const orders = res.data;

      const grouped = {};
      const totals = {};

      const todayStr = new Date().toISOString().split("T")[0];

      orders.forEach((order) => {

        const orderDate = new Date(order.createdAt);
        const orderDay = orderDate.toISOString().split("T")[0];

        // =========================
        // LINE CHART (TODAY ONLY + TIME BASED)
        // =========================
        const timeLabel = orderDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        });

        const isToday = orderDay === todayStr;

        // =========================
        // BAR CHART FILTER LOGIC (UNCHANGED)
        // =========================
        let barPeriod = "";

        if (filter === "daily") {
          barPeriod = orderDay;
        } else if (filter === "weekly") {
          barPeriod = `Week ${getWeekNumber(orderDate)}`;
        } else if (filter === "monthly") {
          barPeriod = `${orderDate.getFullYear()}-${String(
            orderDate.getMonth() + 1
          ).padStart(2, "0")}`;
        }

        order.items.forEach((item) => {

          // =========================
          // LINE CHART DATA (ONLY TODAY)
          // =========================
          if (isToday) {

            if (!grouped[item.name]) {
              grouped[item.name] = [];
            }

            grouped[item.name].push({
              date: timeLabel,
              orders: item.quantity
            });
          }

          // =========================
          // BAR CHART DATA
          // =========================
          if (!totals[item.name]) {
            totals[item.name] = {};
          }

          if (!totals[item.name][barPeriod]) {
            totals[item.name][barPeriod] = 0;
          }

          totals[item.name][barPeriod] += item.quantity;
        });
      });

      // =========================
      // FORMAT LINE CHART DATA (SORT BY TIME)
      // =========================
      const formattedData = {};

      Object.keys(grouped).forEach((itemName) => {
        formattedData[itemName] = grouped[itemName]
          .sort((a, b) => {
            return new Date(`1970/01/01 ${a.date}`) -
                   new Date(`1970/01/01 ${b.date}`);
          });
      });

      // =========================
      // FORMAT BAR CHART DATA
      // =========================
      const formattedComparison =
        Object.entries(totals).map(([itemName, periods]) => {
          const totalOrders = Object.values(periods).reduce(
            (a, b) => a + b,
            0
          );

          return {
            itemName,
            totalOrders
          };
        });

      setChartData(formattedData);
      setComparisonData(formattedComparison);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // LOADING SCREEN
  if (loading) {
    return (
      <div className="analytics-page">
        <Navbar />

        <div className="loading-state">
          <div className="spinner"></div>
          <p>Analyzing Sales Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">

      <Navbar />

      <div className="analytics-container">

        <header className="analytics-header">
          <h1>Sales Analytics</h1>
          <div className="header-underline"></div>
          <p>Tracking item performance over time</p>
        </header>

        {/* DROPDOWN */}
        <div className="analytics-controls">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="daily">Daily Sales</option>
            <option value="weekly">Weekly Sales</option>
            <option value="monthly">Monthly Sales</option>
          </select>
        </div>

        {/* BAR CHART */}
        <div className="chart-card">

          <div className="chart-card-header">
            <h2>Item Comparison</h2>
            <span className="trend-tag">{filter}</span>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="itemName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="totalOrders"
                  fill="#b91c1c"
                  name="Total Orders"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* LINE CHARTS */}
        <div className="charts-grid">

          {Object.keys(chartData).map((itemName, index) => (
            <div className="chart-card" key={index}>

              <div className="chart-card-header">
                <h2>{itemName}</h2>
                <span className="trend-tag">Today</span>
              </div>

              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData[itemName]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="#b91c1c"
                      strokeWidth={3}
                      name="Orders"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export default Analytics;