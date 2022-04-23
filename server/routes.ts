import { Application } from 'express';
import api from './api';

export default function routes(app: Application): void {
  app.use('/api', api);
}
