import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/*
 * React Testing Library does not unmount between tests when `globals` is off,
 * so a leaked tree would make later queries ambiguous and tests order-dependent.
 */
afterEach(() => {
  cleanup();
});
