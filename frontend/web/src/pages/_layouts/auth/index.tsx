import React from 'react';

import { Wrapper, Content } from './styles';

const AuthLayout: React.FC = ({ children }) => {
  return (
    <Wrapper>
      <Content>{children}</Content>
    </Wrapper>
  );
};

export default AuthLayout;
