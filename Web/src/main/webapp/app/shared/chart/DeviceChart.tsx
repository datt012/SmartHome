import React, { useEffect, useState } from 'react';
import { IDevice } from 'app/shared/model/device.model';
import { MDBCard, MDBCardBody, MDBChart, MDBCol, MDBDatepicker, MDBIcon, MDBSelect } from 'mdb-react-ui-kit';
import dayjs, { Dayjs } from 'dayjs';
import { pusher } from 'app/shared/realtime/pusher';

interface DeviceChartProps {
  device: IDevice;
  refetch?: () => void;
}

const DeviceChart = ({ refetch, device: d }: DeviceChartProps) => {
  const [labels, setLabels] = useState([]);
  const [datasets, setDatasets] = useState([]);

  const handleSelect = option => {
    switch (option.value) {
      case 1:
        setLabels([
          dayjs(new Date().setDate(new Date().getDate() - 6)).format('DD/MM/YYYY'),
          dayjs(new Date().setDate(new Date().getDate() - 5)).format('DD/MM/YYYY'),
          dayjs(new Date().setDate(new Date().getDate() - 4)).format('DD/MM/YYYY'),
          dayjs(new Date().setDate(new Date().getDate() - 3)).format('DD/MM/YYYY'),
          dayjs(new Date().setDate(new Date().getDate() - 2)).format('DD/MM/YYYY'),
          dayjs(new Date().setDate(new Date().getDate() - 1)).format('DD/MM/YYYY'),
          dayjs(new Date()).format('DD/MM/YYYY'),
        ]);
        setDatasets([
          calculateSpendingTime(dayjs(new Date().setDate(new Date().getDate() - 6))),
          calculateSpendingTime(dayjs(new Date().setDate(new Date().getDate() - 5))),
          calculateSpendingTime(dayjs(new Date().setDate(new Date().getDate() - 4))),
          calculateSpendingTime(dayjs(new Date().setDate(new Date().getDate() - 3))),
          calculateSpendingTime(dayjs(new Date().setDate(new Date().getDate() - 2))),
          calculateSpendingTime(dayjs(new Date().setDate(new Date().getDate() - 1))),
          calculateSpendingTime(dayjs(new Date())),
        ]);
        break;
      default:
    }
  };

  useEffect(() => {
    setDatasets([
      calculateSpendingTime(dayjs(new Date().setDate(new Date().getDate() - 6))),
      calculateSpendingTime(dayjs(new Date().setDate(new Date().getDate() - 5))),
      calculateSpendingTime(dayjs(new Date().setDate(new Date().getDate() - 4))),
      calculateSpendingTime(dayjs(new Date().setDate(new Date().getDate() - 3))),
      calculateSpendingTime(dayjs(new Date().setDate(new Date().getDate() - 2))),
      calculateSpendingTime(dayjs(new Date().setDate(new Date().getDate() - 1))),
      calculateSpendingTime(dayjs(new Date())),
    ]);
  }, [new Date().getMinutes()]);

  const calculateSpendingTime = (date: Dayjs) => {
    const logsInDay = d.logs.filter(l => dayjs(l.createdDate).isSame(date, 'day'));

    let spendingTime = 0;

    if (logsInDay.length > 1) {
      if (logsInDay[logsInDay.length - 1]?.description.split(':')[1].trim() === 'ON') {
        spendingTime += Math.abs(dayjs(logsInDay[logsInDay.length - 1].createdDate).diff(date, 'minute'));
      }
    }

    for (let i = 0; i < logsInDay.length; ++i) {
      if (logsInDay[i]?.description.split(':')[1].trim() === 'ON' && logsInDay[i + 1]) {
        spendingTime += Math.abs(dayjs(logsInDay[i + 1].createdDate).diff(dayjs(logsInDay[i].createdDate), 'minute'));
      }
    }

    return spendingTime;
  };

  useEffect(() => {
    const channel = pusher.subscribe(`private-device_${d.id}`);
    channel.bind('update-status', data => {
      refetch && refetch();
    });
  }, []);

  return (
    <>
      <MDBCol md="4">
        <MDBCard alignment="center">
          <MDBCardBody>
            <div className="env-status d-flex flex-row align-items-center p-3 mb-3">
              <div className="d-flex flex-grow-1 flex-column align-items-center">
                <h5>{d.type}</h5>
                <p className="mb-0">Status: {d.status}</p>
              </div>
            </div>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
      <MDBCol md="8">
        <div className="d-flex justify-content-between mb-3">
          <p>{d.type}</p>
          <div>
            <MDBSelect data={[{ text: 'Last 7 days', value: 1, selected: true }]} getValue={handleSelect} />
          </div>
        </div>
        <MDBChart
          style={{ backgroundColor: '#FEFEFE' }}
          type="bar"
          data={{
            labels,
            datasets: [
              {
                label: 'Spending Time (minutes)',
                data: datasets,
                order: 1,
                yAxisID: 'y',
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
            },
          }}
        />
      </MDBCol>
    </>
  );
};

export default DeviceChart;
