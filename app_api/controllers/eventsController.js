'use strict';

const config = require('../../config');
const mongoose = require('mongoose');
const { User } = require('../models/model_user');
const { Event } = require('../models/model_tasting_event');
const { TastingNote } = require('../models/model_tasting_note');

mongoose.connect(config.DATABASE_URL);

// ************************************************************************* //
// TASTINGS EVENTS - BEGIN
// ************************************************************************* //
module.exports.getTastingEvents = (req, res) => {

  // passport placed "user" on the request in jwtStrategy.
  const userId = req.user._id;

  Event
    .find({ userId })
    .then((events) => { res.json(events).status(200); })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error', err: err });
    });

};

module.exports.getOneTastingEvent = (req, res) => {
  // Called when loading Edit Event Form loads.

  // NOTE: Don't need to find User using req.user._id b/c user
  //       was already verified by jwtStrategy.  The Event(s) can
  //       be found via the eventId.
  const eventId  = req.params.eventId;

  // make sure eventId is in url.
  if ( !req.params.eventId ) {
    const message = `Missing eventId in request params`;
    console.error(message);
    return res.status(400).send(message);
  }

  Event
    .findById(eventId)
    .then((event) => { res.json(event.serialize()).status(200); })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error', err: err });
    });
};

module.exports.postTastingEventData = (req, res) => {

  // passport placed "user" on the request in jwtStrategy.
  const userId = req.user._id;

  // make sure client didn't send unexpected fields in req.body.
  const requiredFields = ['eventName', 'eventHost'];
  for( let i=0; i< requiredFields.length; i++) {
    const field = requiredFields[i];

    if ( !(field in req.body) ) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  //  Each Event has a userId so that only a particular user will be able
  //  to see his/her Tasting Notes.
  User
    .findById({ "_id": userId })
    .then(user => {
      const _userId = user._id;

      Event
        .create({
          timestamp: new Date(),
          userId: _userId,
          eventName: req.body.eventName,
          eventHost: req.body.eventHost
        })
        .then(event => {
          res.status(201).json(event.serialize())
        })
        // event model error.
        .catch(err => {
          console.error(err);
          res.status(500).json({ message: 'Internal server error', err: err });
        });
    })
    // user model error.
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error', err: err });
    });
};

module.exports.putTastingEventData = (req, res) => {

  // NOTE: Don't need to find User using req.user._id b/c user
  //       was already verified by jwtStrategy.  The Event(s) can
  //       be found via the eventId.
  const eventId = req.params.eventId;
  const toUpdate = {};
  const updatableFields = ['eventName', 'eventHost'];

  updatableFields.forEach(field => {

    if (field in req.body) {
      toUpdate[field] = req.body[field];
    } else {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }

  });

  // make sure eventIdId is in url.
  if ( !req.params.eventId ) {
    const message = `Missing eventId in request params`;
    console.error(message);
    return res.status(400).send(message);
  }

  Event
    .findByIdAndUpdate(eventId, { $set: toUpdate })
    .then(event => res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' })
    });

  // Update all associated Tasting Notes.
  TastingNote
    .updateMany({eventId: eventId}, { $set: toUpdate })
    .then(tastingNotes => { res.status(204).end(); })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' })
    });
};

module.exports.deleteEvent = (req, res) => {

  // NOTE: Don't need to find User using req.user._id b/c user
  //       was already verified by jwtStrategy.  The Event(s) can
  //       be found via the eventId.
  const eventId = req.params.eventId;

  // make sure eventId is in url.
  if ( !req.params.eventId ) {
    const message = `Missing eventId in request params`;
    console.error(message);
    return res.status(400).send(message);
  }

  Event
    .findByIdAndRemove(eventId)
    .then(event => res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });

  TastingNote
    .remove({eventId: eventId})
    .then((tasting) => res.status(204).end() )
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
};
// ************************************************************************* //
// TASTINGS EVENTS - END
// ************************************************************************* //

