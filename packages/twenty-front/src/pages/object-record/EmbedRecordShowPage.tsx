/**
 * EmbedRecordShowPage - Renders a record in "side panel" layout for TAU embed mode.
 *
 * Layout: optional back arrow + compact header (SummaryCard, 77px) +
 *         tabs (Home/Timeline/Tasks/+4 More) + scrollable content.
 *
 * Related record navigation (Leads, Tasks, Notes…) is handled by
 * EmbedSidePanelNavigationEffect, which intercepts openRecordInSidePanel calls
 * and converts them to React Router navigations (/embed/object/:name/:id).
 */
import { useNavigate, useParams } from 'react-router-dom';

import { CommandMenuComponentInstanceContext } from '@/command-menu/states/contexts/CommandMenuComponentInstanceContext';
import { TimelineActivityContext } from '@/activities/timeline-activities/contexts/TimelineActivityContext';
import { ContextStoreComponentInstanceContext } from '@/context-store/states/contexts/ContextStoreComponentInstanceContext';
import { RecordComponentInstanceContextsWrapper } from '@/object-record/components/RecordComponentInstanceContextsWrapper';
import { SummaryCard } from '@/object-record/record-show/components/SummaryCard';
import { PageLayoutRecordPageRenderer } from '@/object-record/record-show/components/PageLayoutRecordPageRenderer';
import { EmbedSidePanelNavigationEffect } from '~/pages/object-record/EmbedSidePanelNavigationEffect';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const EMBED_CONTEXT_INSTANCE_ID = 'tau-embed-record-page';

const StyledRoot = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  min-width: 0;
  overflow: hidden;
  width: 100%;
  background: ${themeCssVariables.background.primary};
`;

const StyledHeaderRow = styled.div`
  align-items: center;
  display: flex;

  /* SummaryCard fills remaining space */
  & > :last-child {
    flex: 1;
  }
`;

const StyledBackButton = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  padding: 0 ${themeCssVariables.spacing[1]} 0 ${themeCssVariables.spacing[3]};
  align-self: stretch;
  color: ${themeCssVariables.font.color.secondary};
  font-size: 18px;
  user-select: none;

  &:hover {
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

export const EmbedRecordShowPage = () => {
  const { objectNameSingular, objectRecordId } = useParams();
  const navigate = useNavigate();

  if (!objectNameSingular || !objectRecordId) {
    return null;
  }

  // Show back arrow when navigating away from person (the root record)
  const canGoBack = objectNameSingular !== 'person';

  return (
    <RecordComponentInstanceContextsWrapper
      componentInstanceId={`record-show-${objectRecordId}`}
    >
      <ContextStoreComponentInstanceContext.Provider
        value={{ instanceId: EMBED_CONTEXT_INSTANCE_ID }}
      >
        <CommandMenuComponentInstanceContext.Provider
          value={{ instanceId: EMBED_CONTEXT_INSTANCE_ID }}
        >
          {/* Converts openRecordInSidePanel → navigate('/embed/object/…') */}
          <EmbedSidePanelNavigationEffect />

          <StyledRoot>
            {/* Compact header with optional back arrow */}
            <StyledHeaderRow>
              {canGoBack && (
                <StyledBackButton onClick={() => navigate(-1)}>
                  ←
                </StyledBackButton>
              )}
              <SummaryCard
                objectNameSingular={objectNameSingular}
                objectRecordId={objectRecordId}
                isInSidePanel={true}
              />
            </StyledHeaderRow>

            {/* All tabs in tab list (isInSidePanel=true → no pinned left panel) */}
            <StyledContent>
              <TimelineActivityContext.Provider
                value={{ recordId: objectRecordId }}
              >
                <PageLayoutRecordPageRenderer
                  targetRecordIdentifier={{
                    id: objectRecordId,
                    targetObjectNameSingular: objectNameSingular,
                  }}
                  isInSidePanel={true}
                />
              </TimelineActivityContext.Provider>
            </StyledContent>
          </StyledRoot>
        </CommandMenuComponentInstanceContext.Provider>
      </ContextStoreComponentInstanceContext.Provider>
    </RecordComponentInstanceContextsWrapper>
  );
};
