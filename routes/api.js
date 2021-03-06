'use strict';

var mongo = require('mongoskin')
  , BSON = mongo.BSONPure
  , collectionName = 'pages'
  , connectionString = 'mongodb://localhost:27017/nodelove'
  ;

/*
 * DB stuff
 */
if (process.env.MONGOHQ_URL) {
  connectionString = process.env.MONGOHQ_URL;
}

var db = mongo.db(connectionString + '?auto_reconnect', {
  safe: false
});

db.open(function(err, db) {
  if (!err) {
    console.log('Connected to \'nodelove\' database');
    db.collection(collectionName).find().toArray(function(err, items) {
      if (!items.length) {
        populateDB();
      }
    });
  }
});

exports.findByAttribute = function(req, res) {
  var id = req.params.id
    , lookup = {};

  try {
    lookup['_id'] = new BSON.ObjectID(id);
  } catch (err) {
    lookup['slug'] = id;
  }

  db.collection(collectionName).findOne(lookup, function(err, item) {
    checkDBValue(res, item, err);
  });
};

exports.findAll = function(req, res) {
  db.collection(collectionName).find().toArray(function(err, items) {
    checkDBValue(res, items, err);
  });
};

exports.findAllNavigation = function(req, res) {
  db.collection(collectionName).find({
    hidden: false
  }, {
    title: 1,
    slug: 1
  }).toArray(function(err, items) {
    checkDBValue(res, items, err);
  });
};

exports.layout = function(req, res) {
  res.render('layout', {
    title: 'Node.js, Express, Jade, Less, Skeleton, MongoDB boilerplate',
    slug: 'index'
  });
};

/**
 * Populate 'pages' collection with sample data. This will only be executed if the 'pages' collection does not exist
 */

function populateDB() {
  console.log('The \'pages\' collection doesn\'t exist. Creating it with sample data...');

  var pages = [{
    title: 'Node.js, Express, Jade, Less, Skeleton, MongoDB boilerplate',
    slug: 'index',
    top: '',
    bottom: '<div class="one-third column"><h2><i class="icon-fighter-jet"></i>Fast</h2><p>With Node Love, you can be up and running in minutes with a working, database-driven project that truly harnesses the power of Javascript on the server and in the browser. Your users won\'t know what hit them!</p></div><div class="one-third column"><h2><i class="icon-refresh"></i>Seamless</h2><p>With Node Love, the seperation between client-side and server-side is virtually eliminated. Jade templates and node modules can be used seamlessly on either side with a little help from <a href="https://github.com/substack/node-browserify" target="_blank">browserify</a> and <a href="https://github.com/HenrikJoreteg/templatizer" target="_blank">templatizer</a></p></div><div class="one-third column"><h2><i class="icon-mobile-phone"></i>Responsive</h2><p>Thanks to <a href="http://lesscss.org" target="_blank">Less</a> and <a href="http://getskeleton.com" target="_blank">Skeleton</a>, you can optomize each page for all your mobile users with ease.</p></div>',
    callout: 'A simple, lightning fast, powerful, responsive, database driven Node.js starter template.',
    showHero: true,
    hidden: true,
    sort: 1
  }, {
    title: 'Quick Start',
    slug: 'quick-start',
    top: '<div class="one-third column"><h2>Title A</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis.</p></div><div class="one-third column"><h2>Title B</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis.</p></div><div class="one-third column"><h2>Title C</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis.</p></div>',
    bottom: '<div class="four columns"><h2>Title D</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis.</p></div><div class="four columns"><h2>Title E</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis.</p></div><div class="four columns"><h2>Title F</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis.</p></div><div class="four columns"><h2>Title G</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis.</p></div>',
    callout: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim.',
    showHero: false,
    hidden: false,
    sort: 2
  }, {
    title: 'Documentation',
    slug: 'documentation',
    top: '<div class="one-third column"><h2>Title A</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis.</p></div><div class="one-third column"><h2>Title B</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis.</p></div><div class="one-third column"><h2>Title C</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis.</p></div>',
    bottom: '<div class="four columns"><h2>Title D</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis.</p></div><div class="four columns"><h2>Title E</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis.</p></div><div class="four columns"><h2>Title F</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis.</p></div><div class="four columns"><h2>Title G</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis.</p></div>',
    callout: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim.',
    showHero: false,
    hidden: false,
    sort: 3
  }, {
    title: 'Credits',
    slug: 'credits',
    top: '<div class="one-third column"><h2>Title A</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis.</p></div><div class="one-third column"><h2>Title B</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis.</p></div><div class="one-third column"><h2>Title C</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis.</p></div>',
    bottom: '<div class="four columns"><h2>Title D</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis.</p></div><div class="four columns"><h2>Title E</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis.</p></div><div class="four columns"><h2>Title F</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis.</p></div><div class="four columns"><h2>Title G</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis.</p></div>',
    callout: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim.',
    showHero: false,
    hidden: false,
    sort: 4
  }];

  db.collection(collectionName).insert(pages, {
    safe: true
  }, function(err, result) {
    if (err) {
      console.log('A DB error has occurred');
    } else {
      console.log('The DB had been populated!');
    }
  });
};

function checkDBValue(res, obj, err) {
  if (err) {
    res.send({
      error: 'A DB error has occurred'
    });
  }

  if (obj) {
    res.send(obj);
  } else {
    res.send(404);
  }
};
