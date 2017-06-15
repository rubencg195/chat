// Initializes the `gifs` service on path `/gifs`
const createService = require('feathers-nedb');
const createModel = require('../../models/gifs.model');
const hooks = require('./gifs.hooks');
const filters = require('./gifs.filters');
//
const multer = require('multer');
const multipartMiddleware = multer();
const dauria = require('dauria');
const feathers = require('feathers');


// feathers-blob service
const blobService = require('feathers-blob');
// Here we initialize a FileSystem storage,
// but you can use feathers-blob with any other
// storage service like AWS or Google Drive.
const fs = require('fs-blob-store');
const blobStorage = fs(__dirname + '/uploads');


module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'gifs',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/gifs', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('gifs');

  service.hooks(hooks);  

  //Upload Service with multipart support
app.use('/uploads',

    // multer parses the file named 'uri'.
    // Without extra params the data is
    // temporarely kept in memory
    multipartMiddleware.single('uri'),

    // another middleware, this time to
    // transfer the received file to feathers
    function(req,res,next){
        req.feathers.file = req.file;
        next();
    },
    blobService({Model: blobStorage})
);

// before-create Hook to get the file (if there is any)
// and turn it into a datauri,
// transparently getting feathers-blob
// to work with multipart file uploads
app.service('/uploads').before({
    create: [
        function(hook) {
            if (!hook.data.uri && hook.params.file){
                const file = hook.params.file;
                const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
                hook.data = {uri: uri};
            }
        }
    ]
});

  if (service.filter) {
    service.filter(filters);
  }
};
