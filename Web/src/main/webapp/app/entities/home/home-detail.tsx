import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';
import { getEntity } from './home.reducer';
import { MDBBtn, MDBCol, MDBIcon, MDBRow } from 'mdb-react-ui-kit';

export interface IHomeDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const HomeDetail = (props: IHomeDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { homeEntity } = props;
  return (
    <MDBRow>
      <MDBCol md="8">
        <h2 data-cy="homeDetailsHeading">Home</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">Name</span>
          </dt>
          <dd>{homeEntity.name}</dd>
          <dt>
            <span id="location">Location</span>
          </dt>
          <dd>{homeEntity.location}</dd>
        </dl>
        <MDBBtn tag={Link} to="/home" color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </MDBBtn>
        &nbsp;
        <MDBBtn tag={Link} to={`/home/${homeEntity.id}/edit`} color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </MDBBtn>
        &nbsp;
        <MDBBtn tag={Link} to={`/room?homeId=${homeEntity.id}`} color="warning">
          <MDBIcon icon="door-open" /> <span className="d-none d-md-inline">Room List</span>
        </MDBBtn>
      </MDBCol>
    </MDBRow>
  );
};

const mapStateToProps = ({ home }: IRootState) => ({
  homeEntity: home.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(HomeDetail);
