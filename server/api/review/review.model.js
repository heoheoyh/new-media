'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
import {Schema} from 'mongoose';

var ReviewSchema = new Schema({
  _creator : { type: Schema.Types.ObjectId, ref: 'User' },
  title    : String,
  field    : [],
  tags     : [],
  link     : String,
  projFile : String,
  filename : String,
  existname : String,
  content  : String,
  date     : { type: Date,  default: Date.now   },
  like     : Number
});

ReviewSchema.index( { tags: "text" } )

export default mongoose.model('Review', ReviewSchema);
