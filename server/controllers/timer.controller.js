import User from '../models/user';
import Timer from '../models/timer';

const ObjectId = require('mongoose').Types.ObjectId;

const create = (req, res) => {
  const userId = new ObjectId(req.user._id);
  const timeTrack = req.body.timeTrack;
  const distance = req.body.distance;

  if (!userId || !timeTrack || !distance) {
    res.status(405).json({ status: 'failed', message: 'Missing Parameter' });
  }

  const timerRecord = new Timer({ user: userId, timeTrack: timeTrack, distance: distance });
  timerRecord.save()
  .then(() => {
    res.json({ status: 'success' });
  })
  .catch((err) => {
    res.status(400).json({ status: 'failed', message: err });
  });
};

module.exports = {
  create,
};
