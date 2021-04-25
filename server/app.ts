import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import errorHandler from './middleware/error.middleware';
import buildingRoutes from './routes/building.route';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve("./", 'build')));

app.use(buildingRoutes);
app.use(errorHandler);

export default app;
module.exports = app;