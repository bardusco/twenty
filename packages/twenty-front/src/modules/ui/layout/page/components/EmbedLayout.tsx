import { AppErrorBoundary } from '@/error-handler/components/AppErrorBoundary';
import { FileUploadProvider } from '@/file-upload/components/FileUploadProvider';
import { AppFullScreenErrorFallback } from '@/error-handler/components/AppFullScreenErrorFallback';
import { AppPageErrorFallback } from '@/error-handler/components/AppPageErrorFallback';
import { styled } from '@linaria/react';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

/**
 * EmbedLayout - Minimal layout for embedding Twenty pages in external apps (e.g., Flutter WebView/iframe).
 * No navigation drawer, no mobile bar, no keyboard shortcuts, no auth modal.
 * Just the page content.
 */

const StyledLayout = styled.div`
  background: #ffffff;
  color-scheme: light;
  display: flex;
  flex-direction: column;
  height: 100dvh;
  width: 100%;
  overflow: hidden;

  .react-loading-skeleton {
    --base-color: #e5e7eb !important;
    --highlight-color: #f8fafc !important;
    background-color: #e5e7eb !important;
  }
`;

const StyledMainContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

export const EmbedLayout = () => {
  useEffect(() => {
    document.body.classList.add('tau-embedded');

    const applyScheme = (scheme: string) => {
      const normalizedScheme = scheme === 'dark' ? 'dark' : 'light';
      const root = document.documentElement;
      root.classList.toggle('dark', normalizedScheme === 'dark');
      root.classList.toggle('light', normalizedScheme === 'light');
      root.style.colorScheme = normalizedScheme;
    };

    const params = new URLSearchParams(window.location.search);
    applyScheme(params.get('theme') ?? 'light');

    const handleMessage = (event: MessageEvent) => {
      const { type } = event.data ?? {};
      if (type === 'tau-theme') {
        applyScheme(event.data.colorScheme);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      document.body.classList.remove('tau-embedded');
    };
  }, []);

  return (
    <FileUploadProvider>
      <StyledLayout>
        <AppErrorBoundary FallbackComponent={AppFullScreenErrorFallback}>
          <StyledMainContainer>
            <AppErrorBoundary FallbackComponent={AppPageErrorFallback}>
              <Outlet />
            </AppErrorBoundary>
          </StyledMainContainer>
        </AppErrorBoundary>
      </StyledLayout>
    </FileUploadProvider>
  );
};
