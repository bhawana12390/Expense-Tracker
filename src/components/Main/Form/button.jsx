import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const rgbEffect = keyframes`
  0% { border-color: #ff0000; }
  33% { border-color: #00ff00; }
  66% { border-color: #0000ff; }
  100% { border-color: #ff0000; }
`;

const StyledMicButton = styled.button`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 3px solid transparent;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 15px rgba(0,0,0,0.2);
  }

  &:active {
    transform: translateX(-50%) scale(0.95);
  }

  ${props => props.listening && `
    animation: ${rgbEffect} 3s linear infinite;
    box-shadow: 0 0 20px rgba(0,0,0,0.2);
  `}
`;

const MicIcon = styled.div`
  width: 24px;
  height: 24px;
  background-color: ${props => props.listening ? '#4CAF50' : '#000000'};
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z'/%3E%3C/svg%3E") no-repeat center center;
  mask-size: cover;
`;

const MicButton = ({ onClick, listening }) => (
  <StyledMicButton onClick={onClick} listening={listening}>
    <MicIcon listening={listening} />
  </StyledMicButton>
);

export default MicButton;