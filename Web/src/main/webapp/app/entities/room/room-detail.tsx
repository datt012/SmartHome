import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './room.reducer';
import Chart from 'app/shared/chart/Chart';
import { MDBBtn, MDBCol, MDBRow } from 'mdb-react-ui-kit';

export interface IRoomDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const RoomDetail = (props: IRoomDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { roomEntity, location } = props;
  const homeId = new URLSearchParams(location.search).get('homeId');

  return (
    <>
      <MDBRow>
        <MDBCol md="8">
          <h2 data-cy="roomDetailsHeading">Room</h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="name">Name</span>
            </dt>
            <dd>{roomEntity.name}</dd>
          </dl>
          <MDBBtn tag={Link} to={`/room?homeId=${homeId}`} replace color="info" data-cy="entityDetailsBackButton">
            <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
          </MDBBtn>
          &nbsp;
          <MDBBtn tag={Link} to={`/room/${roomEntity.id}/edit?homeId=${homeId}`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
          </MDBBtn>
        </MDBCol>
      </MDBRow>
      <MDBRow className="mt-3">
        <Chart roomId={roomEntity.id} />
      </MDBRow>
    </>
  );
};

const mapStateToProps = ({ room }: IRootState) => ({
  roomEntity: room.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RoomDetail);
