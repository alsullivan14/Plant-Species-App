const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SpeciesSchema = new Schema({
  genus: {
    type: Schema.Types.ObjectId,
    ref: 'genus'
  },
  star: { type: Boolean, default: false },
  scientificName: { type: String },
  images: { type: [String] },
  synonyms: { type: [String] },
  nativeRange: { type: [String] }, 
  
});

SpeciesSchema.statics.star = function(id) {
  const Species = mongoose.model('species');

  return Species.findById(id)
    .then(species => {
      if (species.star) {
        species.star = false;
      } else {
        species.star = true;
      }
      return species.save();
    });
};

mongoose.model('species', SpeciesSchema);