'use strict';

import Review from './review.model';
import User from '../user/user.model';
var multiparty = require('multiparty');
var fs = require('fs');

export function index(req, res, next) {
  Review.find({})
    .populate('_creator')
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch(next);
}

//export function create(req, res, next) {
//  const review = req.body;
//  review._creator = req.user._id;
//
//  Review.create(review)
//    .then((doc) => {
//      res.status(201).json(doc);
//    })
//    .catch(next);
//}
export function create(req, res, next) {

  const review = req.body;

  var field = [];
  var tags = [];
  var field_idx = 0;
  var tags_idx = 0;


  var form = new multiparty.Form();
      // get field name & value
  var filename, existname;

  form.on('field',function(name,value){
       console.log('normal field / name = '+name+' , value = '+value);

       if(name.includes("field")){
          field[field_idx++] = value;
       }
       else if(name.includes("tags")){
          tags[tags_idx++] = value;
       }
       else{
         review[''+name+''] = value;
      }

  });

  // file upload handling
  form.on('part',function(part){
      console.log("req.part show------------------");
      console.log(part);

       var size;
       if (part.filename) {
             //existname = part.filename.split(".");
            // existname = Math.floor(Math.random()*Math.pow(10,16)) +"."+ existname[1];
             filename = part.filename;
             size = part.byteCount;
       }else{
             part.resume();
       }

       console.log("Write Streaming file :"+filename);
       var writeStream = fs.createWriteStream('./files/'+ filename);
       writeStream.filename = filename;
       part.pipe(writeStream);

       part.on('data',function(chunk){
             console.log(filename+' read '+chunk.length + 'bytes');
       });

       part.on('end',function(){
             console.log(filename+' Part read complete');
             writeStream.end();
       });
  });

  // all uploads are completed
  form.on('close',function(){
    //res.status(200).send('Upload complete');
    review.projFile = "./files/"+filename;
    review.filename = filename;
    review.existname = filename;
    review._creator = req.user._id;
    review.field = field;
    review.tags = tags;

    console.log("review show!!!!!!!1");
    console.log(review);

    Review.create(review)
      .then((doc) => {
        res.status(201).json(doc);
      })
      .catch(next);
  });

  // track progress
  form.on('progress',function(byteRead,byteExpected){

       console.log(' Reading total  '+byteRead+'/'+byteExpected);

  });

  form.parse(req);


}

export function mine(req, res, next) {
  Review.find({ _creator: req.user._id })
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch(next);
}
export function update(req, res, next) {
  Review.findById(req.params.myrvId)
    .then((review) => review.set(req.body).save())
    .then(() => res.status(201).json())
    .catch(next);
}

export function del(req, res, next){
  Review.findById(req.params.myrvId)
    .then((review) => review.set(req.body).remove())
    .then(() => res.status(201).json())
    .catch(next);

}

export function getTags(req, res, next) {
  const query = req.query.q;
  //Review.aggregate([{$match: { $text: { $search: query } }},
  Review.aggregate([
    {$project: {text: '$tags', _id: 0}},
    { $unwind : "$text"  },
    { $match : { text :{$regex: query}  }},
    { $group : { _id : '$text'} }
  ]
  )
    .then((docs) => {
      console.log(docs);
      res.status(200).json(docs);
    })
}

export function getUsers(req, res, next) {
  const query = req.query.q;
  console.log(query);
  User.aggregate([
    {$project: {text: '$email', _id: 0}},
    { $unwind : "$text"  },
    { $match : { text :{$regex: query}  }},
    { $group : { _id : '$text'} }
  ]
  )
    .then((docs) => {
      console.log(docs);
      res.status(200).json(docs);
    })
}


export function show(req, res, next) {
  Review.findById(req.params.pid)
    .populate('_creator')
    .then((doc) => {
      console.log('------------------show');
      res.status(200).json(doc);
    });
}
export function like(req, res, next) {
  Review.findByIdAndUpdate(req.params.pid, { $set: { like: req.body.like }}, function (err, tank) {
    if (err) return handleError(err);
    res.send(tank);
  });
}


