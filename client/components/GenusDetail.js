import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';


import genusQuery from '../queries/fetchGenus';
import SpeciesCreate from './SpeciesCreate';
import SpeciesList from './SpeciesList';

class GenusDetail extends Component {
    
    render() {
      let { genus } = this.props.data;
      if(!genus) {return null}
      return (
          <div>
            <Link to="/"> Back</Link>
            <h4>{genus.genusName}</h4>
            <SpeciesList species={genus.species}/> 
            <SpeciesCreate genusId={this.props.match.params.id} genusName={genus.genusName}/>
          </div>
      );
    }
}

export default graphql(genusQuery, {
    options: (props) => { return { variables: { id: props.match.params.id }}}
})(GenusDetail);