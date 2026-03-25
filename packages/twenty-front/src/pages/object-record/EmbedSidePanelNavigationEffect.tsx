/**
 * EmbedSidePanelNavigationEffect
 *
 * In TAU embed mode, clicking related records (Leads, Tasks, Notes…)
 * calls openRecordInSidePanel, which sets isSidePanelOpenedState=true.
 *
 * Instead of rendering a side panel overlay (complex, broken initialization),
 * we intercept that state change and convert it into a React Router navigation
 * to /embed/object/:objectNameSingular/:objectRecordId.
 *
 * This gives full-page embed navigation: back browser button returns to person.
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { isSidePanelOpenedState } from '@/side-panel/states/isSidePanelOpenedState';
import { sidePanelPageInfoState } from '@/side-panel/states/sidePanelPageInfoState';
import { viewableRecordIdComponentState } from '@/side-panel/pages/record-page/states/viewableRecordIdComponentState';
import { viewableRecordNameSingularComponentState } from '@/side-panel/pages/record-page/states/viewableRecordNameSingularComponentState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';
import { useStore } from 'jotai';

export const EmbedSidePanelNavigationEffect = () => {
  const navigate = useNavigate();
  const isSidePanelOpened = useAtomStateValue(isSidePanelOpenedState);
  const sidePanelPageInfo = useAtomStateValue(sidePanelPageInfoState);
  const setIsSidePanelOpened = useSetAtomState(isSidePanelOpenedState);
  const store = useStore();

  useEffect(() => {
    if (!isSidePanelOpened) return;

    const instanceId = sidePanelPageInfo?.instanceId;
    if (!instanceId) return;

    const objectNameSingular = store.get(
      viewableRecordNameSingularComponentState.atomFamily({ instanceId }),
    );
    const recordId = store.get(
      viewableRecordIdComponentState.atomFamily({ instanceId }),
    );

    if (!objectNameSingular || !recordId) return;

    // Close the side panel state (we handle navigation ourselves)
    setIsSidePanelOpened(false);

    // Navigate to the embed route for this record
    navigate(`/embed/object/${objectNameSingular}/${recordId}`);
  }, [isSidePanelOpened, sidePanelPageInfo, navigate, setIsSidePanelOpened, store]);

  return null;
};
