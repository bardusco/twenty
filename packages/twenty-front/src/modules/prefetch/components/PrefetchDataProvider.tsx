import { PrefetchRunFavoriteQueriesEffect } from '@/prefetch/components/PrefetchRunFavoriteQueriesEffect';
import { PrefetchRunNavigationMenuItemQueriesEffect } from '@/prefetch/components/PrefetchRunNavigationMenuItemQueriesEffect';
import React from 'react';
import { useLocation } from 'react-router-dom';

export const PrefetchDataProvider = ({ children }: React.PropsWithChildren) => {
  const location = useLocation();
  const isEmbedRoute = location.pathname.startsWith('/embed');

  if (isEmbedRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <PrefetchRunFavoriteQueriesEffect />
      <PrefetchRunNavigationMenuItemQueriesEffect />
      {children}
    </>
  );
};
