import React, { useEffect, useState } from 'react';
import { MDBCard, MDBCardBody, MDBChart, MDBCol, MDBIcon, MDBDatepicker } from 'mdb-react-ui-kit';
import dayjs from 'dayjs';
import { ISensor } from 'app/shared/model/sensor.model';
import { pusher } from 'app/shared/realtime/pusher';

interface TempChartProps {
  sensor: ISensor;
  refetch?: () => void;
}

const TempChart = ({ refetch, sensor: s }: TempChartProps) => {
  const [datePickerValue, setDatePickerValue] = useState(dayjs(new Date()).format('DD/MM/YYYY'));
  const [filteredLogs, setFilteredLogs] = useState([]);

  const handleSetDate = value => {
    setDatePickerValue(value);
    setFilteredLogs(s.logs.filter(l => dayjs(l.createdDate).format('DD/MM/YYYY') === value));
  };

  useEffect(() => {
    setFilteredLogs(s.logs);
  }, [s.logs]);

  useEffect(() => {
    const channel = pusher.subscribe(`private-sensor_${s.id}`);
    channel.bind('update', data => {
      refetch && refetch();
    });
  }, []);

  return (
    <>
      <MDBCol md="4">
        <MDBCard alignment="center">
          <MDBCardBody>
            <div className="env-status d-flex flex-row align-items-center p-3 mb-3">
              <div className="icon-wrapper shadow-3 d-flex align-items-center justify-content-center">
                <MDBIcon style={{ color: '#95E1D3' }} size="3x" fas icon="thermometer-empty" />
              </div>
              <div className="d-flex flex-grow-1 flex-column align-items-center">
                <h5>Temperature</h5>
                <p className="mb-0">{JSON.parse(s.logs[s.logs.length - 1].description)['temperature'].toFixed(2)}°C</p>
              </div>
            </div>
            <div className="env-status d-flex flex-row align-items-center p-3">
              <div className="icon-wrapper shadow-3 d-flex align-items-center justify-content-center">
                <MDBIcon style={{ color: '#1E90FF' }} size="3x" fas icon="tint" />
              </div>
              <div className="d-flex flex-grow-1 flex-column align-items-center">
                <h5>Humidity</h5>
                <p className="mb-0">{JSON.parse(s.logs[s.logs.length - 1].description)['humidity'].toFixed(2)}%</p>
              </div>
            </div>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
      <MDBCol md="8">
        <div className="d-flex justify-content-between mb-3">
          <p style={{ fontSize: '22px' }}>Temperature and Humidity</p>
          <div>
            <MDBDatepicker value={datePickerValue} setValue={handleSetDate} />
          </div>
        </div>
        <MDBChart
          style={{ backgroundColor: '#FEFEFE' }}
          type="bar"
          data={{
            labels: filteredLogs.map(l => dayjs(l.createdDate).format('HH:mm:ss')).slice(-12),
            datasets: [
              {
                label: 'Temperature',
                data: filteredLogs.map(l => JSON.parse(l.description)['temperature']).slice(-12),
                order: 1,
                yAxisID: 'y',
              },
              {
                label: 'Humidity',
                data: filteredLogs.map(l => JSON.parse(l.description)['humidity']).slice(-12),
                yAxisID: 'y2',
                type: 'line',
                order: 0,
                backgroundColor: 'rgba(66, 133, 244, 0.0)',
                borderColor: '#94DFD7',
                borderWidth: 2,
                pointBorderColor: '#94DFD7',
                pointBackgroundColor: '#94DFD7',
                lineTension: 0.0,
              },
            ],
          }}
          options={{
            scales: {
              y1: {
                stacked: false,
                position: 'left',
                grid: {
                  drawOnChartArea: false,
                  drawBorder: false,
                  drawTicks: false,
                },
                ticks: {
                  display: false,
                },
              },
              y2: {
                stacked: false,
                position: 'right',
                grid: {
                  drawOnChartArea: false,
                },
                ticks: {
                  beginAtZero: true,
                },
              },
            },
          }}
        />
      </MDBCol>
    </>
  );
};

export default TempChart;
