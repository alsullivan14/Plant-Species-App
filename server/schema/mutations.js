const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;
const mongoose = require('mongoose');
const Genus = mongoose.model('genus');
const Species = mongoose.model('species');
const GenusType = require('./genus_type');
const SpeciesType = require('./species_type');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addGenus: {
      type: GenusType,
      args: {
        genusName: { type: GraphQLString }
      },
      resolve(parentValue, { genusName }) { 
        return (new Genus({ genusName })).save();
      }
    },
    addSpeciesToGenus: {
      type: GenusType,
      args: {
        scientificName: { type: GraphQLString },
        genusId: { type: GraphQLID },
      },
      resolve(parentValue, { scientificName, genusId }) {
        return Genus.addSpecies(genusId, scientificName);
      }
    },
    starSpecies: {
      type: SpeciesType,
      args: { id: { type: GraphQLID } },
      resolve(parentValue, { id }) {
        return Species.star(id);
      }
    },
    
    deleteGenus: {
      type: GenusType,
      args: { id: { type: GraphQLID } },
       resolve(parentValue, { id }) {
        return Genus.deleteOne({ _id: id });
        
      }
    },
   }
});

module.exports = mutation;