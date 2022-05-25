import nc from 'next-connect';

import { onError, onNoMatch } from '../../../../db/onError';
import { getSingleRoom } from '../../../../controllers/roomControllers';

const handler = nc({ onError, onNoMatch });

handler.get(getSingleRoom);

export default handler;
