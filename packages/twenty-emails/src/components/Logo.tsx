import { Img } from '@react-email/components';

const logoStyle = {
  marginBottom: '40px',
};

export const Logo = () => {
  return (
    <Img
      src="https://taubot.ai/images/tau-logo.png"
      alt="TAU CRM logo"
      width="40"
      height="40"
      style={logoStyle}
    />
  );
};
