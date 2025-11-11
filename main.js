import express from 'express';
import path from 'node:path';
import { dbconnect } from './src/db/index.js';
import {config} from "./src/config/index.js"
import MainRouter from './src/routes/index.js';
import cookieParser from "cookie-parser"
import methodOverride from 'method-override'; 
import session from 'express-session';

const app = express();
app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(import.meta.dirname, 'views'));
app.use(methodOverride('_method'));
app.use(cookieParser())

app.use('/', MainRouter)
const bootstrap = async () => {
  try {
    await dbconnect();

    app.listen(8080, () => {
      console.log('Server is listening on port 8080');
    });
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

bootstrap();