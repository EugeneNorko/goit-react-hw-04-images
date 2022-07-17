import { ThreeDots } from 'react-loader-spinner';
import styled from 'styled-components';

const StyledSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Loader = () => (
  <StyledSpinner>
    <ThreeDots color="blue" ariaLabel="loading-indicator" />
  </StyledSpinner>
);
