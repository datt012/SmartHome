import React, { useEffect } from 'react';
import { MDBCol, MDBRow } from 'mdb-react-ui-kit';
import { IRootState } from 'app/shared/reducers';
import { getEntities as getControllers } from 'app/entities/controller/controller.reducer';
import { getEntities as getSensors } from 'app/entities/sensor/sensor.reducer';
import { getEntities as getDevices } from 'app/entities/device/device.reducer';
import { connect } from 'react-redux';
import TempChart from 'app/shared/chart/TempChart';
import DeviceChart from 'app/shared/chart/DeviceChart';

interface ChartProps extends StateProps, DispatchProps {
  roomId: string;
}

const Chart = (props: ChartProps) => {
  useEffect(() => {
    if (props.roomId) {
      props.getControllers(undefined, undefined, undefined, props.roomId);
    }
  }, [props.roomId]);

  useEffect(() => {
    if (!props.controllerLoading && props.controllerList && props.controllerList.length > 0) {
      props.getSensors(undefined, undefined, undefined, props.controllerList[0].id);
      props.getDevices(undefined, undefined, undefined, props.controllerList[0].id);
    }
  }, [props.controllerLoading, props.controllerList]);

  const handleSync = () => {
    props.getControllers(undefined, undefined, undefined, props.roomId);
  };

  return (
    <MDBRow className="pt-3 dashboard m-0 mb-5">
      <MDBCol>
        <div className="dashboard-main">
          <MDBRow>
            {props.sensorList &&
              props.sensorList.length > 0 &&
              props.sensorList.map(s => {
                if (s.type.toLowerCase().includes('dht')) {
                  return <TempChart key={s.id} sensor={s} refetch={handleSync} />;
                }
              })}
          </MDBRow>
          <MDBRow className="mt-5">
            <p style={{ fontSize: '22px' }}>Devices</p>
            {props.deviceList &&
              props.deviceList.length > 0 &&
              props.deviceList.map(d => <DeviceChart key={d.id} device={d} refetch={handleSync} />)}
          </MDBRow>
        </div>
      </MDBCol>
    </MDBRow>
  );
};

const mapStateToProps = ({ controller, sensor, device }: IRootState) => ({
  controllerList: controller.entities,
  controllerLoading: controller.loading,
  sensorList: sensor.entities,
  sensorLoading: sensor.loading,
  deviceList: device.entities,
  deviceLoading: device.loading,
});

const mapDispatchToProps = {
  getControllers,
  getSensors,
  getDevices,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
