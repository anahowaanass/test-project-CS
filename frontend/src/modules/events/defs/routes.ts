import { CrudAppRoutes } from '@common/defs/types';

const prefix = '/events';
const Routes: CrudAppRoutes = {
  ReadAll: prefix, // Fetch all events
  MyEvents: '/my', // Fetch only the authenticated user's events
  CreateOne: prefix + '/create',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}/delete',
};

export default Routes;
