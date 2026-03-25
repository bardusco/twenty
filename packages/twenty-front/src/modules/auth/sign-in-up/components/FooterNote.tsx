import { styled } from '@linaria/react';
import { Trans } from '@lingui/react/macro';

import { useWorkspaceBypass } from '@/auth/sign-in-up/hooks/useWorkspaceBypass';
import { useIsCurrentLocationOnAWorkspace } from '@/domain-manager/hooks/useIsCurrentLocationOnAWorkspace';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledCopyContainer = styled.div`
  align-items: center;
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  max-width: 280px;
  text-align: center;

  & > a {
    color: ${themeCssVariables.font.color.tertiary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const StyledLinksContainer = styled.div`
  align-items: center;
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  flex-wrap: nowrap;
  font-size: ${themeCssVariables.font.size.sm};
  gap: ${themeCssVariables.spacing[2]};
  justify-content: center;
  max-width: 100%;
  text-align: center;
  white-space: nowrap;

  & > a,
  & > button {
    background: none;
    border: none;
    color: ${themeCssVariables.font.color.tertiary};
    cursor: pointer;
    font: inherit;
    padding: 0;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const StyledSeparator = styled.span`
  color: ${themeCssVariables.font.color.tertiary};
`;

export const FooterNote = () => {
  const { isOnAWorkspace } = useIsCurrentLocationOnAWorkspace();

  const { shouldOfferBypass, shouldUseBypass, enableBypass } =
    useWorkspaceBypass();

  if (!isOnAWorkspace) {
    return (
      <StyledCopyContainer>
        <Trans>By using TAU CRM, you agree to the</Trans>{' '}
        <a
          href="https://docs.google.com/document/d/e/2PACX-1vQNYRKoM8AIaKiktSPZPT8oGpSLmiGcqliRv0THFUK8G3pygPP4EkRL9PyQa952NT9XEc_LiHfrt7mi/pub"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Trans>Terms of Service</Trans>
        </a>{' '}
        <Trans>and</Trans>{' '}
        <a
          href="https://docs.google.com/document/d/e/2PACX-1vSiVub5vOWWVNQDh-GL7gBBL7UpQ8x74xw0pC20ZYb3IfX05MhxFAaUDYHXlOhe8oI9Hl19mlTr_Evm/pub"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Trans>Privacy Policy</Trans>
        </a>
        .
      </StyledCopyContainer>
    );
  }

  return (
    <StyledLinksContainer>
      {shouldOfferBypass && !shouldUseBypass && (
        <>
          <button type="button" onClick={enableBypass}>
            <Trans>Bypass SSO</Trans>
          </button>
          <StyledSeparator>•</StyledSeparator>
        </>
      )}
      <a
        href="https://docs.google.com/document/d/e/2PACX-1vSiVub5vOWWVNQDh-GL7gBBL7UpQ8x74xw0pC20ZYb3IfX05MhxFAaUDYHXlOhe8oI9Hl19mlTr_Evm/pub"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Trans>Privacy Policy</Trans>
      </a>
      <StyledSeparator>•</StyledSeparator>
      <a
        href="https://docs.google.com/document/d/e/2PACX-1vQNYRKoM8AIaKiktSPZPT8oGpSLmiGcqliRv0THFUK8G3pygPP4EkRL9PyQa952NT9XEc_LiHfrt7mi/pub"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Trans>Terms of Service</Trans>
      </a>
    </StyledLinksContainer>
  );
};
