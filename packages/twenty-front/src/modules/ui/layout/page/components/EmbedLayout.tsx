import { AppErrorBoundary } from '@/error-handler/components/AppErrorBoundary';
import { AppFullScreenErrorFallback } from '@/error-handler/components/AppFullScreenErrorFallback';
import { AppPageErrorFallback } from '@/error-handler/components/AppPageErrorFallback';
import { styled } from '@linaria/react';
import { Outlet } from 'react-router-dom';
import { themeCssVariables } from 'twenty-ui/theme-constants';

/**
 * EmbedLayout - Minimal layout for embedding Twenty pages in external apps (e.g., Flutter WebView/iframe).
 * No navigation drawer, no mobile bar, no keyboard shortcuts, no auth modal.
 * Just the page content.
 */

const StyledLayout = styled.div`
  background: ${themeCssVariables.background.noisy};
  display: flex;
  flex-direction: column;
  height: 100dvh;
  width: 100%;
  overflow: hidden;
`;

const StyledMainContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

export const EmbedLayout = () => {
  return (
    <StyledLayout>
      <AppErrorBoundary FallbackComponent={AppFullScreenErrorFallback}>
        <StyledMainContainer>
          <AppErrorBoundary FallbackComponent={AppPageErrorFallback}>
            <Outlet />
          </AppErrorBoundary>
        </StyledMainContainer>
      </AppErrorBoundary>
    </StyledLayout>
  );
};
