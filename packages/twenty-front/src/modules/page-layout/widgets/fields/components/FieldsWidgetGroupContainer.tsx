import { styled } from '@linaria/react';
import { useContext, useEffect, useState } from 'react';
import { IconChevronDown } from 'twenty-ui/display';
import { AnimatedExpandableContainer, Section } from 'twenty-ui/layout';
import { ThemeContext, themeCssVariables } from 'twenty-ui/theme-constants';

const StyledHeader = styled.header`
  align-items: center;
  cursor: pointer;
  display: flex;
  height: 24px;
  justify-content: space-between;
`;

const StyledTitleLabel = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledChevronWrapper = styled.div<{ isExpanded: boolean }>`
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  transform: ${({ isExpanded }) =>
    isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform
    calc(${themeCssVariables.animation.duration.normal} * 1s) ease;
`;

type FieldsWidgetGroupContainerProps = {
  children: React.ReactNode;
  title: string;
  defaultExpanded?: boolean;
  collapsedChildren?: React.ReactNode;
};

export const FieldsWidgetGroupContainer = ({
  children,
  title,
  defaultExpanded = true,
  collapsedChildren,
}: FieldsWidgetGroupContainerProps) => {
  const { theme } = useContext(ThemeContext);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggleGroup = () =>
    setIsExpanded((previousIsExpanded) => !previousIsExpanded);

  useEffect(() => {
    if (!window.location.pathname.startsWith('/embed/')) {
      return;
    }

    window.parent?.postMessage(
      {
        type: 'tau-crm-fields-group-toggle',
        title,
        isExpanded,
      },
      '*',
    );
  }, [isExpanded, title]);

  return (
    <Section>
      <StyledHeader onClick={handleToggleGroup}>
        <StyledTitleLabel>{title}</StyledTitleLabel>
        <StyledChevronWrapper isExpanded={isExpanded}>
          <IconChevronDown
            size={theme.icon.size.md}
            stroke={theme.icon.stroke.sm}
          />
        </StyledChevronWrapper>
      </StyledHeader>
      {!isExpanded && collapsedChildren}
      <AnimatedExpandableContainer
        isExpanded={isExpanded}
        initial={false}
        mode="fit-content"
      >
        {children}
      </AnimatedExpandableContainer>
    </Section>
  );
};
