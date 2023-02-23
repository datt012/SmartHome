import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './device.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IDeviceDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const DeviceDetail = (props: IDeviceDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { deviceEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="deviceDetailsHeading">Device</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{deviceEntity.id}</dd>
          <dt>
            <span id="status">Status</span>
          </dt>
          <dd>{deviceEntity.status}</dd>
          <dt>
            <span id="type">Type</span>
          </dt>
          <dd>{deviceEntity.type}</dd>
          <dt>
            <span id="pin">Pin</span>
          </dt>
          <dd>{deviceEntity.pin}</dd>
        </dl>
        <Button tag={Link} to="/device" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/device/${deviceEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ device }: IRootState) => ({
  deviceEntity: device.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DeviceDetail);
