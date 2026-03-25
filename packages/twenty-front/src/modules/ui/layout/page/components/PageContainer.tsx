import { styled } from '@linaria/react';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

// Wrapper to add data-component for CSS targeting in embed mode
import { type ComponentProps } from 'react';

export const PageContainer = (props: ComponentProps<typeof StyledContainer>) => (
  <StyledContainer data-component="page-container" {...props} />
);
