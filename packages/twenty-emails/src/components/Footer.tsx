import { type I18n } from '@lingui/core';
import { Column, Container, Row } from '@react-email/components';
import { Link } from 'src/components/Link';
import { ShadowText } from 'src/components/ShadowText';

const footerContainerStyle = {
  marginTop: '12px',
};

type FooterProps = {
  i18n: I18n;
};

export const Footer = ({ i18n }: FooterProps) => {
  return (
    <Container style={footerContainerStyle}>
      <Row>
        <Column>
          <ShadowText>
            <Link
              href="https://taubot.ai/"
              value={i18n._('Website')}
              aria-label={i18n._("Visit Twenty's website")}
            />
          </ShadowText>
        </Column>
        <Column>
          <ShadowText>
            <Link
              href="https://docs.taubot.ai/docs/crm"
              value={i18n._('User guide')}
              aria-label={i18n._("Read Twenty's user guide")}
            />
          </ShadowText>
        </Column>
      </Row>
      <ShadowText>
        <>
          {i18n._('TAU BOT SISTEMAS INTELIGENTES LTDA')}
        </>
      </ShadowText>
    </Container>
  );
};
