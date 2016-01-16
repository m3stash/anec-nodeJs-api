var mongoose = require('mongoose');

var ModulesByDistrictSchema = new mongoose.Schema({
  country : [{
    //name: String,
    id: Number,
    district : [{
      //name: String,
      id: Number,
      modules: [{
        //name: String,
        id: String,
        types: [{
          provider: String,
          listTypes: [{
            //name: String,
            id: String
          }]
        }]
      }]
    }]
  }]
});

module.exports = mongoose.model('ModulesByDistrict', ModulesByDistrictSchema, 'modulesByDistrict');
