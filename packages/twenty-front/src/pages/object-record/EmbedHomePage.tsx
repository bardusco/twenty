import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

/**
 * EmbedHomePage - Landing page for embed mode when no specific record is targeted.
 * Shows a simple message indicating the CRM is connected.
 */

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 24px;
  background: ${themeCssVariables.background.primary};
  color: ${themeCssVariables.font.color.secondary};
  font-family: ${themeCssVariables.font.family};
`;

const StyledTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: ${themeCssVariables.font.color.primary};
  margin-bottom: 8px;
`;

const StyledSubtitle = styled.p`
  font-size: 13px;
  color: ${themeCssVariables.font.color.tertiary};
  text-align: center;
  max-width: 280px;
  line-height: 1.5;
`;

const StyledIcon = styled.div`
  font-size: 40px;
  margin-bottom: 16px;
`;

export const EmbedHomePage = () => {
  return (
    <StyledContainer>
      <StyledIcon>✅</StyledIcon>
      <StyledTitle>CRM Conectado</StyledTitle>
      <StyledSubtitle>
        Selecione uma conversa para ver os detalhes do contato no CRM.
      </StyledSubtitle>
    </StyledContainer>
  );
};
