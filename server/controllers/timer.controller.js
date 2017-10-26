import User from '../models/user'; //eslint-disable-line
import Timer from '../models/timer';

const ObjectId = require('mongoose').Types.ObjectId;

const create = (req, res) => {
  const userId = new ObjectId(req.user._id);
  const timeTrack = req.body.timeTrack;
  const distance = req.body.distance;

  if (!userId || !timeTrack || !distance) {
    res.status(405).json({ status: 'failed', message: 'Missing Parameter' });
  }

  const timerRecord = new Timer({ user: userId, timeTrack, distance });
  timerRecord.save()
  .then(() => {
    res.json({ status: 'success' });
  })
  .catch((err) => {
    res.status(400).json({ status: 'failed', message: err });
  });
};

const getRecordAll = (req, res) => {
  return Timer.find()
  .then((timers) => {
    if (timers.length === 0) {
      throw new Error('Not find timer record');
    }
    res.json(timers);
  })
  .catch((err) => {
    res.status(404).send(err);
  });
};

const editTimer = (req, res) => {
  const timerId = new ObjectId(req.params.id);
  const timeTrack = req.body.timeTrack;
  const distance = req.body.distance;
  return Timer.findOne({ _id: timerId })
  .then((timer) => {
    if (!timer) res.status(405).send('Not find record');
    timer.update({ $set: { timeTrack, distance } })
    .then(() => {
      res.json({ status: 'success' });
    });
  })
  .catch((err) => {
    res.status(400).send(err);
  });
};

const deleteRecord = (req, res) => {
  const timerId = new ObjectId(req.params.id);
  if (!timerId) res.status(405).send('Not find timer');
  return Timer.remove({ _id: timerId })
  .then(() => {
    res.json({ status: 'success' });
  })
  .catch((err) => {
    res.status(400).send(err);
  });
};

module.exports = {
  create,
  getRecordAll,
  editTimer,
  deleteRecord,
};
