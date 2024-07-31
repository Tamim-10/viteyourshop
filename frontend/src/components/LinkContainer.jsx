import { useNavigate } from 'react-router-dom';
import { cloneElement } from 'react';

const LinkContainer = ({ to, children }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate(to);
  };

  return cloneElement(children, { onClick: handleClick });
};

export default LinkContainer;   
