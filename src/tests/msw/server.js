import { setupServer } from 'msw/node';

export const server = setupServer();

export const API_URL = 'http://localhost:3000/api';
export const url = (path) => `${API_URL}${path}`;
