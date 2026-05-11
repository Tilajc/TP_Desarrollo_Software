import { useState } from 'react';

const useCounter = () => {
  const [hookCount, setHookCount] = useState(0);

  const increment = () => {
    setHookCount(hookCount + 1);
  };

  const decrement = () => {
    setHookCount(hookCount - 1);
  };

  return { hookCount, increment, decrement };
};

export default useCounter;
