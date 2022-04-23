import './common/env';
import Server from './common/server';
import routes from './routes';
import initSeed from './seeds';
import { connectDB } from './common/database';

connectDB().then(
  () => {
    // Init the seed after the DB connected
    // initSeed();
  },
  () => { }
);

export default new Server()
  .router(routes)
  .listen(parseInt(process.env.PORT));
