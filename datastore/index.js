const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // we will need to add a callback function to getNextUniqueId below
  // this callback function will check for an error and take in an
  // id. it will create the filepath (using path.join on the exports.dataDir + `${}`) and then write to that filepath using fs.writeFile; we will be checking for an error and logging it if this is unsuccessful. if it is successfull we will run the callback with parameters in format (null(there is no error), data here)

  // will definitely use exports.dataDir as path
  counter.getNextUniqueId((err, id) => {
    var pathName = path.join(exports.dataDir,`${id}.txt`);

    fs.writeFile(pathName, text, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, {id: id, text: text});
      }
    })
  })



  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });
};

exports.readAll = (callback) => {
  // create a variable to store the data in
  // we will need to use fs.readdir here to read the whole directory. we will pass in parameters in format (error here, files here).
  // we will check if an error exists and log if it does
  // if there is no error then we run a forEach loop on the directory where it is iterating over each file and adding that file to our data array as an object with id and text properties
  // after the loop we will run our callback with parameters (null (there is no error), data array here)

  data = [];

  fs.readdir(exports.dataDir, (err, files) => {
    // run a loop to get the filename of each and add it to data
    if (err) {
      console.log('error in exports.readAll at fs.readdir');
      callback(err);
    } else {
    files.forEach((file) => {
      var id = file.slice(0, file.indexOf('.'));
      data.push({id: id, text: id});
    })
    callback(null, data);
    }
  })

};

exports.readOne = (id, callback) => {
  //we will use the fs.readFile function here to look for a specific path (using path.join again) if there is an error then we will run the callback with parameter (insert error here)
  // if it is successfull than we run the callback with parameters (null (there is no error), data here)
  var pathName = path.join(exports.dataDir, `${id}.txt`);

  fs.readFile(pathName, 'utf8', (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {id: id, text: data});
    }
  })

};

exports.update = (id, text, callback) => {
  // we will use fs.writefile to overwrite the previous id

  var pathName = path.join(exports.dataDir, `${id}.txt`);

  fs.readFile(pathName, (err) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(pathName, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, text);
        }
      })
    }
  })

};

exports.delete = (id, callback) => {
  // potentially can use fs.unlink here
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }

  var pathName = path.join(exports.dataDir, `${id}.txt`);

  fs.readFile(pathName, (err) => {
    if (err) {
      callback(err);
    } else {
      fs.unlink(pathName, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, id);
        }
      })
    }
  })

};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
