const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;
const SpeciesType = require('./species_type');
const Genus = mongoose.model('genus');

const GenusType = new GraphQLObjectType({
  name:  'GenusType',
  fields: () => ({
    id: { type: GraphQLID },
    genusName: { type: GraphQLString },
    species: {
      type: new GraphQLList(SpeciesType),
      resolve(parentValue) {
        return Genus.findSpecies(parentValue.id);
      }
    }
  })
});

module.exports = GenusType;