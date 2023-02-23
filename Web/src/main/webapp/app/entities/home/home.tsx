import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';
import { getEntities } from './home.reducer';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardText, MDBCardTitle, MDBCol, MDBRow } from 'mdb-react-ui-kit';

export interface IHomeProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Home = (props: IHomeProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const handleSyncList = () => {
    props.getEntities();
  };

  const { homeList, match, loading, history } = props;

  return (
    <div>
      <h2 id="home-heading" data-cy="HomeHeading">
        Homes
        <div className="d-flex justify-content-end">
          <MDBBtn className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} /> Refresh List
          </MDBBtn>
          <Link to={`${match.url}/new`} className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Create new Home
          </Link>
        </div>
      </h2>
      <div>
        {homeList && homeList.length > 0 ? (
          <MDBRow>
            {homeList.map((home, i) => (
              <MDBCol key={i} md="3">
                <MDBCard alignment="center">
                  <MDBCardBody>
                    <MDBCardTitle style={{ cursor: 'pointer' }} onClick={() => history.push(`${match.url}/${home.id}`)}>
                      {home.name}
                    </MDBCardTitle>
                    <MDBCardText>Location: {home.location}</MDBCardText>
                    <div className="d-flex justify-content-center">
                      <MDBBtn tag={Link} to={`${match.url}/${home.id}/edit`} className="me-3">
                        Edit
                      </MDBBtn>
                      <MDBBtn tag={Link} to={`${match.url}/${home.id}/delete`} color="danger">
                        Delete
                      </MDBBtn>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            ))}
          </MDBRow>
        ) : (
          !loading && <div className="alert alert-warning">No Homes found</div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ home }: IRootState) => ({
  homeList: home.entities,
  loading: home.loading,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Home);
