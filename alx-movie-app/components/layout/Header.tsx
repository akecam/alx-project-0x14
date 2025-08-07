import * as React from "react";

interface HeaderProps {
  propName: type;
}

const Header: React.FC<HeaderProps> = ({ propName }) => {
  return <div>Header</div>;
};

export default Header;
