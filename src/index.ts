import express from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import { Worker } from 'worker_threads';
import router from './router';
import { firebaseConfig } from './database';

const port = 3000;
export const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(router);

const worker = new Worker('./worker.js', {
    workerData: { firebaseConfig },
});

worker.on('message', (value) => {
    console.log(value);
});

app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});

