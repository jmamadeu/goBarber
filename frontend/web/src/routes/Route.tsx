import React from 'react';

import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
  Redirect,
} from 'react-router-dom';

import AuthLayout from '../pages/_layouts/auth';
import DefaultLayout from '../pages/_layouts/default';

interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate,
  component: Component,
  ...rest
}) => {
  const signed = false;

  if (signed && !isPrivate) {
    return <Redirect to="/dashboard" />;
  }

  if (!signed && isPrivate) {
    return <Redirect to="/" />;
  }

  const Layout = signed ? DefaultLayout : AuthLayout;

  // return (
  //   <ReactDOMRoute
  //     {...rest}
  //     render={props => (
  //       <Layout>
  //         <Component />
  //       </Layout>
  //     )}
  //     // component={Component}
  //   />
  // );

  return (
    <ReactDOMRoute {...rest}>
      <Layout>
        <Component />
      </Layout>
    </ReactDOMRoute>
  );
};

export default Route;
