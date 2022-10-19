const mongoose = require('mongoose');
const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLString
} = graphql;
const Species = mongoose.model('species');

const SpeciesType = new GraphQLObjectType({
  name:  'SpeciesType',
  fields: () => ({
    id: { type: GraphQLID },
    star: { type: GraphQLBoolean },
    scientificName: { type: GraphQLString },
    images: { type:  new GraphQLList(GraphQLString) },
    synonyms: { type:  new GraphQLList(GraphQLString) },
    nativeRange: { type:  new GraphQLList(GraphQLString) },
    species: {
      type: require('./genus_type'),
      resolve(parentValue) {
        return Species.findById(parentValue).populate('species')
          .then(species => {
            console.log(species);
            return species.species;
          });
      }
    }
  })
});

module.exports = SpeciesType;