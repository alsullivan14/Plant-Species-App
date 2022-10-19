const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GenusSchema = new Schema({
  genusName: { type: String },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  species: [{
    type: Schema.Types.ObjectId,
    ref: 'species'
  }]
});

GenusSchema.statics.addSpecies = function(id, scientificName) {
  const Species = mongoose.model('species');

  return this.findById(id)
    .then(genus => {
      const species = new Species({ scientificName, genus });
      genus.species.push(species);
      return Promise.all([species.save(), genus.save()])
        .then(([species, genus]) => genus);
    });
};

GenusSchema.statics.findSpecies = function(id) {
  return this.findById(id)
    .populate('species')
    .then(genus => genus.species);
};

mongoose.model('genus', GenusSchema);