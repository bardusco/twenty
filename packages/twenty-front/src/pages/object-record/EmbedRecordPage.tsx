import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { useOpenRecordInSidePanel } from '@/side-panel/hooks/useOpenRecordInSidePanel';
import { SidePanelForDesktop } from '@/side-panel/components/SidePanelForDesktop';
import { isSidePanelOpenedState } from '@/side-panel/states/isSidePanelOpenedState';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

/**
 * EmbedRecordPage — Minimal embed page that opens a record directly
 * in the Twenty side panel view (compact header with back arrow + tabs).
 *
 * This is used by the TAU admin iframe embed to show CRM record details
 * without the full RecordShowPage layout overhead.
 */

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  overflow: hidden;
  width: 100%;
`;

const StyledSidePanelWrapper = styled.div`
  flex: 1;
  height: 100%;
  overflow: hidden;
  /* Give the side panel full width in embed mode */
  > div {
    width: 100% !important;
    min-width: 0 !important;
  }
`;

const StyledPlaceholder = styled.div`
  background: ${themeCssVariables.background.noisy};
  display: none;
  flex: 1;
`;

const EmbedRecordOpenEffect = ({
  objectNameSingular,
  objectRecordId,
}: {
  objectNameSingular: string;
  objectRecordId: string;
}) => {
  const { openRecordInSidePanel } = useOpenRecordInSidePanel();
  // Track the current pending timer so both the initial delay and any
  // retry timers can be cancelled on cleanup or on prop change.
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!objectNameSingular || !objectRecordId) return;

    // Metadata may not be loaded immediately — retry until it's available
    let attempts = 0;
    const tryOpen = () => {
      attempts++;
      try {
        openRecordInSidePanel({
          recordId: objectRecordId,
          objectNameSingular,
          resetNavigationStack: true,
        });
        timerRef.current = null;
      } catch (e) {
        if (attempts < 10) {
          timerRef.current = setTimeout(tryOpen, 300);
        } else {
          timerRef.current = null;
        }
      }
    };

    // Small delay to let workspace metadata load first
    timerRef.current = setTimeout(tryOpen, 200);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [objectNameSingular, objectRecordId, openRecordInSidePanel]);

  return null;
};

export const EmbedRecordPage = () => {
  const { objectNameSingular = '', objectRecordId = '' } = useParams<{
    objectNameSingular: string;
    objectRecordId: string;
  }>();

  // Force the side panel open state so it doesn't close during navigation
  const setIsSidePanelOpened = useSetAtomState(isSidePanelOpenedState);
  useEffect(() => {
    setIsSidePanelOpened(true);
  }, [setIsSidePanelOpened]);

  return (
    <StyledContainer>
      <EmbedRecordOpenEffect
        objectNameSingular={objectNameSingular}
        objectRecordId={objectRecordId}
      />
      {/* Hidden placeholder — side panel takes full width */}
      <StyledPlaceholder />
      <StyledSidePanelWrapper>
        <SidePanelForDesktop />
      </StyledSidePanelWrapper>
    </StyledContainer>
  );
};
