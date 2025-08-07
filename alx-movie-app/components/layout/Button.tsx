import * as React from "react";

interface ButtonProps {
  propName: type;
}

const Button: React.FC<ButtonProps> = ({ propName }) => {
  return <div>Button</div>;
};

export default Button;
