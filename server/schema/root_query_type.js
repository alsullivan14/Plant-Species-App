const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull } = graphql;
const GenusType = require('./genus_type');
const SpeciesType = require('./species_type');
const Species = mongoose.model('species');
const Genus = mongoose.model('genus');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    genera: {
      type: new GraphQLList(GenusType),
      resolve() {
        return Genus.find({});
      }
    },
    genus: {
      type: GenusType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Genus.findById(id);
      }
    },
    species: {
      type: SpeciesType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Species.findById(id);
      }
    }
    
  })
});

module.exports = RootQuery;