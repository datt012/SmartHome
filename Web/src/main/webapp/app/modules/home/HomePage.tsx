import React from 'react';
import { connect } from 'react-redux';
import './HomePage.scss';
import { Redirect } from 'react-router-dom';

export type IHomePageProp = StateProps;

export const HomePage = (props: IHomePageProp) => {
  const { isAuthenticated } = props;

  if (isAuthenticated) {
    return <Redirect to="/home" />;
  }

  return (
    <div>
      <p>Please login</p>
    </div>
  );
};

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(HomePage);
