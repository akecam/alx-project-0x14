import * as React from "react";

interface LoadingProps {
  propName: type;
}

const Loading: React.FC<LoadingProps> = ({ propName }) => {
  return <div>Loading</div>;
};

export default Loading;
