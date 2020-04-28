import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import CardDescription from '../CardDescription/';
import CardHeadline from '../CardHeadline/';

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px 0 20px 0;
  margin-bottom: 20px;
  border-bottom: 1px solid ${p => p.theme.colorGreyLight};
`;

const StyledCardHeadline = styled.div`
  margin-bottom: 10px;
`;

const StyledCardHeadlineMail = styled.div`
  font-size: .8rem;
`;

export default p => {
  const { email } = p;
  return (
    <Flex>
      <StyledCardHeadline>Dein Account:</StyledCardHeadline>
      <StyledCardHeadlineMail>{email}</StyledCardHeadlineMail>
      <CardDescription>Registrierte E-Mail Adresse</CardDescription>
    </Flex>
  )
}