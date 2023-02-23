import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './room.reducer';

export interface IRoomUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const RoomUpdate = (props: IRoomUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { roomEntity, loading, updating, location } = props;
  const homeId = new URLSearchParams(location.search).get('homeId');

  const handleClose = () => {
    props.history.push(`/room?homeId=${homeId}`);
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
        ...roomEntity,
        ...values,
      };

      if (isNew) {
        props.createEntity(entity, homeId);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="smartinumApp.room.home.createOrEditLabel" data-cy="RoomCreateUpdateHeading">
            Create or edit a Room
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : roomEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="room-id">ID</Label>
                  <AvInput id="room-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="room-name">
                  Name
                </Label>
                <AvField id="room-name" data-cy="name" type="text" name="name" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to={`/room?homeId=${homeId}`} color="info">
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
  roomEntity: storeState.room.entity,
  loading: storeState.room.loading,
  updating: storeState.room.updating,
  updateSuccess: storeState.room.updateSuccess,
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
// @ts-expect-error
export default connect(mapStateToProps, mapDispatchToProps)(RoomUpdate);
