import {} from 'dotenv/config';
import express from 'express';
import router from './router';

/**
 * Create Express App
 */
const app = express();
const port = process.env.PORT || 5000;
app.use(router);
app.listen(port, () => {
  console.log('TrackSale Backend Test: Pi Skill Check');
  console.log(`Server listening on port ${port}!`);
});
