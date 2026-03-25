import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useIsLogged } from '@/auth/hooks/useIsLogged';
import { useVerifyLogin } from '@/auth/hooks/useVerifyLogin';
import { clientConfigApiStatusState } from '@/client-config/states/clientConfigApiStatusState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { AppPath } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { useNavigateApp } from '~/hooks/useNavigateApp';

export const VerifyLoginTokenEffect = () => {
  const [searchParams] = useSearchParams();
  const loginToken = searchParams.get('loginToken');
  const redirectTo = searchParams.get('redirectTo');

  const isLogged = useIsLogged();
  const navigate = useNavigateApp();
  const routerNavigate = useNavigate();
  const { verifyLoginToken } = useVerifyLogin();

  const { isSaved: clientConfigLoaded } = useAtomStateValue(
    clientConfigApiStatusState,
  );

  useEffect(() => {
    if (!clientConfigLoaded) {
      return;
    }

    if (isDefined(loginToken)) {
      // Timeout to prevent infinite loading in embed flows
      const safeRedirect =
        isDefined(redirectTo) &&
        redirectTo.startsWith('/') &&
        !redirectTo.startsWith('//') &&
        !redirectTo.includes(':')
          ? redirectTo
          : undefined;

      const timeoutId = isDefined(safeRedirect)
        ? setTimeout(() => {
            // Timeout: verify took too long, redirect anyway to avoid blank iframe
            routerNavigate(safeRedirect, { replace: true });
          }, 15000)
        : undefined;

      verifyLoginToken(loginToken).then(() => {
        if (timeoutId) clearTimeout(timeoutId);
        // Support redirectTo for embed flows (e.g., iframe from Flutter app)
        // Validate: must be a relative path (starts with /) and not a protocol redirect
        if (
          isDefined(redirectTo) &&
          redirectTo.startsWith('/') &&
          !redirectTo.startsWith('//') &&
          !redirectTo.includes(':')
        ) {
          routerNavigate(redirectTo, { replace: true });
        }
      });
    } else if (!isLogged) {
      navigate(AppPath.SignInUp);
    }
    // Verify only needs to run once at mount
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [clientConfigLoaded]);

  return <></>;
};
