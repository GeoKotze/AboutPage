interface Props {
  logo: string;
  logoText: string;
}

//If in the future i  need a comment to understand this something has gone horribly wrong
const Logo = ({ logo, logoText }: Props) => {
  return (
    <>
      <img src={logo} width="40" height="40" />
      <span
        className="hidden-xs"
        style={{
          padding: "10px",
          verticalAlign: "middle",
        }}
      >
        {logoText}
      </span>
    </>
  );
};

export default Logo;
