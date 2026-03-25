import { AuthModal } from '@/auth/components/AuthModal';
import { AppErrorBoundary } from '@/error-handler/components/AppErrorBoundary';
import { AppFullScreenErrorFallback } from '@/error-handler/components/AppFullScreenErrorFallback';
import { AppPageErrorFallback } from '@/error-handler/components/AppPageErrorFallback';
import { FileUploadProvider } from '@/file-upload/components/FileUploadProvider';
import { InformationBannerIsImpersonating } from '@/information-banner/components/impersonate/InformationBannerIsImpersonating';
import { KeyboardShortcutMenu } from '@/keyboard-shortcut-menu/components/KeyboardShortcutMenu';
import { NavigationMenuEditModeBar } from '@/navigation-menu-item/components/NavigationMenuEditModeBar';
import { AppNavigationDrawer } from '@/navigation/components/AppNavigationDrawer';
import { MobileNavigationBar } from '@/navigation/components/MobileNavigationBar';
import { PageDragDropProvider } from '@/navigation/components/PageDragDropProvider';
import { useIsSettingsPage } from '@/navigation/hooks/useIsSettingsPage';
import { OBJECT_SETTINGS_WIDTH } from '@/settings/data-model/constants/ObjectSettings';
import { SignInAppNavigationDrawerMock } from '@/sign-in-background-mock/components/SignInAppNavigationDrawerMock';
import { Suspense, lazy, useContext, useEffect } from 'react';


const SignInBackgroundMockPage = lazy(() =>
  import('@/sign-in-background-mock/components/SignInBackgroundMockPage').then(
    (module) => ({ default: module.SignInBackgroundMockPage }),
  ),
);
import { useShowFullscreen } from '@/ui/layout/fullscreen/hooks/useShowFullscreen';
import { useShowAuthModal } from '@/ui/layout/hooks/useShowAuthModal';
import { NAVIGATION_DRAWER_CONSTRAINTS } from '@/ui/layout/resizable-panel/constants/NavigationDrawerConstraints';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import { styled } from '@linaria/react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { Outlet, useNavigate } from 'react-router-dom';
import { useScreenSize } from 'twenty-ui/utilities';
import { ThemeContext, themeCssVariables } from 'twenty-ui/theme-constants';
const StyledLayout = styled.div`
  background: ${themeCssVariables.background.noisy};
  display: flex;
  flex-direction: column;
  height: 100dvh;
  position: relative;
  scrollbar-color: ${themeCssVariables.border.color.medium} transparent;
  scrollbar-width: 4px;
  width: 100%;

  *::-webkit-scrollbar-thumb {
    border-radius: ${themeCssVariables.border.radius.sm};
  }
`;

const StyledPageContainerBase = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  min-height: 0;
`;
const StyledPageContainer = motion.create(StyledPageContainerBase);

const StyledNavigationDrawerWrapper = styled.div`
  flex-shrink: 0;
`;

const StyledMainContainer = styled.div`
  display: flex;
  flex: 0 1 100%;
  overflow: hidden;
`;

export const DefaultLayout = () => {
  const isMobile = useIsMobile();
  const isSettingsPage = useIsSettingsPage();
  const windowsWidth = useScreenSize().width;
  const showAuthModal = useShowAuthModal();
  const useShowFullScreen = useShowFullscreen();
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  // Hide navigation drawer when embedded in an iframe by TAU admin panel.
  // NOTE: In production, the reverse proxy (Traefik) must set
  // Content-Security-Policy: frame-ancestors 'self' *.taubot.ai
  // to restrict which sites can embed this app in an iframe.
  // Uses an allowlist of parent origins to avoid hiding the sidebar for
  // arbitrary embedders. In dev, allows any origin (no referrer check).
  const isEmbedded = (() => {
    // Detect embed mode by URL path (works regardless of iframe context)
    if (window.location.pathname.startsWith('/embed')) return true;
    if (window === window.parent) return false;
    try {
      // In same-origin iframes we can read parent.location
      const parentOrigin = window.parent.location.origin;
      return parentOrigin.includes('taubot.ai');
    } catch {
      // Cross-origin: check document.referrer as best-effort
      const ref = document.referrer || '';
      const isDev = process.env.NODE_ENV !== 'production';
      return ref.includes('taubot.ai') || (isDev && (ref.includes('localhost') || ref.includes('0.0.0.0')));
    }
  })();

  // When embedded, add a class to body so we can hide UI chrome (header, etc.)
  // via CSS without modifying deep component trees.
  if (isEmbedded) {
    document.body.classList.add('tau-embedded');
  } else {
    document.body.classList.remove('tau-embedded');
  }

  // Apply theme from URL query param (set by Flutter on iframe creation)
  // and listen for runtime theme changes via postMessage.
  useEffect(() => {
    if (!isEmbedded) return;

    const applyScheme = (scheme: string) => {
      if (scheme !== 'dark' && scheme !== 'light') return;
      const root = document.documentElement;
      root.classList.toggle('dark', scheme === 'dark');
      root.classList.toggle('light', scheme === 'light');
    };

    // Read initial theme from URL query param (?theme=dark|light)
    const params = new URLSearchParams(window.location.search);
    const urlTheme = params.get('theme');
    if (urlTheme) {
      applyScheme(urlTheme);
    }

    // Listen for messages from parent (TAU admin) via postMessage
    const handleMessage = (event: MessageEvent) => {
      const { type } = event.data ?? {};
      console.log('[TAU-EMBED] message received:', type, event.data);
      if (type === 'tau-theme') {
        applyScheme(event.data.colorScheme);
      } else if (type === 'tau-navigate') {
        // Navigate to a new path within the SPA without full reload
        // e.g., { type: 'tau-navigate', path: '/embed/object/person/xxx' }
        const path = event.data.path;
        if (typeof path === 'string' && path.startsWith('/')) {
          navigate(path);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isEmbedded, navigate]);

  return (
    <>
      <FileUploadProvider>
        <StyledLayout>
          <AppErrorBoundary FallbackComponent={AppFullScreenErrorFallback}>
            <InformationBannerIsImpersonating />
            <NavigationMenuEditModeBar />
            <StyledPageContainer
              animate={{
                marginLeft:
                  isSettingsPage && !isMobile && !useShowFullScreen
                    ? (windowsWidth -
                        (OBJECT_SETTINGS_WIDTH +
                          NAVIGATION_DRAWER_CONSTRAINTS.default +
                          76)) /
                      2
                    : 0,
              }}
              transition={{
                duration: theme.animation.duration.normal,
              }}
            >
              <PageDragDropProvider>
                {!showAuthModal && <KeyboardShortcutMenu />}
                {showAuthModal ? (
                  <StyledNavigationDrawerWrapper>
                    <SignInAppNavigationDrawerMock />
                  </StyledNavigationDrawerWrapper>
                ) : (useShowFullScreen || isEmbedded) ? null : (
                  <StyledNavigationDrawerWrapper>
                    <AppNavigationDrawer />
                  </StyledNavigationDrawerWrapper>
                )}
                {showAuthModal ? (
                  <>
                    <StyledMainContainer>
                      <Suspense fallback={null}>
                        <SignInBackgroundMockPage />
                      </Suspense>
                    </StyledMainContainer>
                    <AnimatePresence mode="wait">
                      <LayoutGroup>
                        <AuthModal>
                          <Outlet />
                        </AuthModal>
                      </LayoutGroup>
                    </AnimatePresence>
                  </>
                ) : (
                  <StyledMainContainer>
                    <AppErrorBoundary FallbackComponent={AppPageErrorFallback}>
                      <Outlet />
                    </AppErrorBoundary>
                  </StyledMainContainer>
                )}
              </PageDragDropProvider>
            </StyledPageContainer>
            {isMobile && !showAuthModal && !isEmbedded && <MobileNavigationBar />}
          </AppErrorBoundary>
        </StyledLayout>
      </FileUploadProvider>
    </>
  );
};
