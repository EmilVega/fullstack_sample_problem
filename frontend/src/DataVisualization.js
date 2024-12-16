import React, { useState, useEffect } from 'react';
// Import the necessary components from recharts. It helps to create the plots easily
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import Slider from '@mui/material/Slider';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import './DataVisualization.css'; // Import the CSS file

const DataVisualization = ({ role }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [yBounds, setYBounds] = useState([0, 10]);
  const [selectedSeries, setSelectedSeries] = useState({
    sepalWidth: true,
    petalLength: true,
    petalWidth: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/iris', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ role }), // I needed to share the role because the session was not working because the CORS in the backend
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role]);

  const handleYBoundsChange = (event, newValue) => {
    setYBounds(newValue);
  };

  const handleSeriesChange = (event) => {
    setSelectedSeries({
      ...selectedSeries,
      [event.target.name]: event.target.checked,
    });
  };

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container">
      <h2>Your Iris-{role} Data</h2>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedSeries.sepalWidth}
              onChange={handleSeriesChange}
              name="sepalWidth"
            />
          }
          label="Sepal Width"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedSeries.petalLength}
              onChange={handleSeriesChange}
              name="petalLength"
            />
          }
          label="Petal Length"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedSeries.petalWidth}
              onChange={handleSeriesChange}
              name="petalWidth"
            />
          }
          label="Petal Width"
        />
        <Slider
          value={yBounds}
          onChange={handleYBoundsChange}
          valueLabelDisplay="auto"
          min={0}
          max={10}
          step={0.1}
        />
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sepal_length">
            <Label value="Sepal Length" offset={-5} position="insideBottom" />
          </XAxis>
          <YAxis domain={yBounds}>
            <Label value="Size" angle={-90} position="insideLeft" />
          </YAxis>
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          {selectedSeries.sepalWidth && <Line type="monotone" dataKey="sepal_width" stroke="#8884d8" />}
          {selectedSeries.petalLength && <Line type="monotone" dataKey="petal_length" stroke="#82ca9d" />}
          {selectedSeries.petalWidth && <Line type="monotone" dataKey="petal_width" stroke="#ffc658" />}
        </LineChart>
      </ResponsiveContainer>

      <div style={{ height: '50px' }}></div>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="petal_length">
            <Label value="Petal Length" offset={-5} position="insideBottom" />
          </XAxis>
          <YAxis domain={yBounds}>
            <Label value="Size" angle={-90} position="insideLeft" />
          </YAxis>
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          {selectedSeries.sepalWidth && <Line type="monotone" dataKey="sepal_width" stroke="#8884d8" />}
          {selectedSeries.petalLength && <Line type="monotone" dataKey="petal_length" stroke="#82ca9d" />}
          {selectedSeries.petalWidth && <Line type="monotone" dataKey="petal_width" stroke="#ffc658" />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DataVisualization;