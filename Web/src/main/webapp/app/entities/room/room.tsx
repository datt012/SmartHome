import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';
import { getEntities } from './room.reducer';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCol, MDBRow } from 'mdb-react-ui-kit';

export interface IRoomProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Room = (props: IRoomProps) => {
  const { roomList, match, loading, history, location } = props;
  const homeId = new URLSearchParams(location.search).get('homeId');

  useEffect(() => {
    props.getEntities(null, null, null, homeId);
  }, []);

  const handleSyncList = () => {
    props.getEntities(null, null, null, homeId);
  };

  return (
    <div>
      <h2 id="room-heading" data-cy="RoomHeading">
        Rooms
        <div className="d-flex justify-content-end">
          <MDBBtn className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} /> Refresh List
          </MDBBtn>
          <Link
            to={`${match.url}/new?homeId=${homeId}`}
            className="btn btn-primary jh-create-entity"
            id="jh-create-entity"
            data-cy="entityCreateButton"
          >
            <FontAwesomeIcon icon="plus" />
            &nbsp; Create new Room
          </Link>
        </div>
      </h2>
      <div>
        {roomList && roomList.length > 0 ? (
          <MDBRow>
            {roomList.map((room, i) => (
              <MDBCol key={i} md="3">
                <MDBCard alignment="center">
                  <MDBCardBody>
                    <MDBCardTitle style={{ cursor: 'pointer' }} onClick={() => history.push(`${match.url}/${room.id}?homeId=${homeId}`)}>
                      {room.name}
                    </MDBCardTitle>
                    <div className="d-flex justify-content-center">
                      <MDBBtn tag={Link} to={`${match.url}/${room.id}/edit?homeId=${homeId}`} className="me-3">
                        Edit
                      </MDBBtn>
                      <MDBBtn tag={Link} to={`${match.url}/${room.id}/delete?homeId=${homeId}`} color="danger">
                        Delete
                      </MDBBtn>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            ))}
          </MDBRow>
        ) : (
          !loading && <div className="alert alert-warning">No Rooms found</div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ room }: IRootState) => ({
  roomList: room.entities,
  loading: room.loading,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Room);
