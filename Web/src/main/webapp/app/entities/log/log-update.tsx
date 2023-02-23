import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './log.reducer';
import { ILog } from 'app/shared/model/log.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ILogUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const LogUpdate = (props: ILogUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { logEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/log');
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
        ...logEntity,
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
          <h2 id="smartinumApp.log.home.createOrEditLabel" data-cy="LogCreateUpdateHeading">
            Create or edit a Log
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : logEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="log-id">ID</Label>
                  <AvInput id="log-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="descriptionLabel" for="log-description">
                  Description
                </Label>
                <AvField id="log-description" data-cy="description" type="text" name="description" />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="log-createdAt">
                  Created At
                </Label>
                <AvField id="log-createdAt" data-cy="createdAt" type="date" className="form-control" name="createdAt" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/log" replace color="info">
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
  logEntity: storeState.log.entity,
  loading: storeState.log.loading,
  updating: storeState.log.updating,
  updateSuccess: storeState.log.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(LogUpdate);
