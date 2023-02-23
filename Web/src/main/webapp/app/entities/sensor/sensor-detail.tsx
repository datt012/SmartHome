import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './sensor.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ISensorDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const SensorDetail = (props: ISensorDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { sensorEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="sensorDetailsHeading">Sensor</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{sensorEntity.id}</dd>
          <dt>
            <span id="type">Type</span>
          </dt>
          <dd>{sensorEntity.type}</dd>
          <dt>
            <span id="pin">Pin</span>
          </dt>
          <dd>{sensorEntity.pin}</dd>
        </dl>
        <Button tag={Link} to="/sensor" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/sensor/${sensorEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ sensor }: IRootState) => ({
  sensorEntity: sensor.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SensorDetail);
