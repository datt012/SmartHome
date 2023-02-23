import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './device.reducer';
import { IDevice } from 'app/shared/model/device.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IDeviceUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const DeviceUpdate = (props: IDeviceUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { deviceEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/device');
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...deviceEntity,
        ...values,
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="smartinumApp.device.home.createOrEditLabel" data-cy="DeviceCreateUpdateHeading">
            Create or edit a Device
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : deviceEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="device-id">ID</Label>
                  <AvInput id="device-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="statusLabel" for="device-status">
                  Status
                </Label>
                <AvInput
                  id="device-status"
                  data-cy="status"
                  type="select"
                  className="form-control"
                  name="status"
                  value={(!isNew && deviceEntity.status) || 'ON'}
                >
                  <option value="ON">ON</option>
                  <option value="OFF">OFF</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="typeLabel" for="device-type">
                  Type
                </Label>
                <AvField id="device-type" data-cy="type" type="text" name="type" />
              </AvGroup>
              <AvGroup>
                <Label id="pinLabel" for="device-pin">
                  Pin
                </Label>
                <AvField id="device-pin" data-cy="pin" type="string" className="form-control" name="pin" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/device" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Back</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Save
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  deviceEntity: storeState.device.entity,
  loading: storeState.device.loading,
  updating: storeState.device.updating,
  updateSuccess: storeState.device.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(DeviceUpdate);
