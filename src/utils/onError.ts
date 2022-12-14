import { NextApiResponse } from 'next';

import db from '../db/db';
import { IErrorDto } from '../db/interfaces';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export async function onError(err: any, req: any, res: NextApiResponse<IErrorDto>, next: any): Promise<void> {
  await db.disconnect();
  /* eslint-disable no-console */
  console.log('onError->errormsg', err.message);
  console.log('onError->err.name', err.name);
  console.log('onError->err', err);
  console.log('onError->req.url', req.url);
  console.log('onError->req.method', req.method);
  console.log('onError->req.body', req.body);
  /* eslint-enable no-console */

  let status = 400;
  let errormsg = '';
  const errName = err.name;

  if (errName === 'CastError') {
    errormsg = `Resource not found. Invalid: ${err.path}`;
  } else if (errName === 'ValidationError') {
    const firstValidationError = err.errors[Object.keys(err.errors)[0]].message;
    errormsg = firstValidationError;
    if (errormsg.substring(0, 5) === 'Path ') {
      // e.g. "Path `comment` is required" => remove leading "Path " becomes "`comment` is required"
      errormsg = firstValidationError.substring(5);
    }
  } else if (errName === 'MongoServerError') {
    if (err.code === 11000) {
      const keyValue = err.keyValue; // e.g. { email: 'existingEmail@xxx.com' }
      const key = Object.keys(keyValue)[0];
      const keyCapitalize = key.charAt(0).toUpperCase() + key.slice(1);
      errormsg = keyCapitalize + ' is already in use!';
    }
  } else {
    errormsg = err.message;
    status = 500;
  }
  res.status(status).send({ errormsg, status });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function onNoMatch(req: any, res: NextApiResponse<IErrorDto>): void {
  const errormsg = `Method '${req.method}' Not Allowed`;

  /* eslint-disable no-console */
  console.log('onNoMatch->errormsg', errormsg);
  console.log('onNoMatch->req.url', req.url);
  console.log('onNoMatch->req.method', req.method);
  /* eslint-enable no-console */

  const status = 405;
  res.status(status).send({ errormsg, status });
}
