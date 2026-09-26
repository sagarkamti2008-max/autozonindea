import React from 'react';

export const CarPreloader = ({ onFinish }) => {
  if (onFinish) onFinish();
  return null;
};
