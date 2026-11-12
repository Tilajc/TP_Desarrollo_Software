import { render } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const LocationDisplay = () => (
  <div data-testid="location">{useLocation().pathname}</div>
);

// eslint-disable-next-line react-refresh/only-export-components
export const renderWithProviders = (ui, { route = '/' } = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        {ui}
        <LocationDisplay />
      </MemoryRouter>
    </QueryClientProvider>
  );
};
