import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {decodeEntity} from 'html-entities';


import json_img_data from '../../public/images/json_data.json';

class SpeciesList extends Component {
    
    toggleStar(star) {
      if (star) {
        return decodeEntity('&#9733;');	
      } else {
        return decodeEntity('&#9734;');
      }
    }
    
    onStar(id, star) {
        this.props.mutate({
            variables: {id},
            optimisticResponse: {
                __typename: 'mutation',
                starSpecies: {
                    __typename: 'SpeciesType',
                    id,
                    star: star
                }
            }
        });
    }
    
    renderImages(name) {
      let speciesLinks = json_img_data[name];
      return speciesLinks.map((link, index) => <li key={index}><a href={link}>&#128174; Image {index + 1}</a></li>);
    }
    
    renderListItems(list) {
      if (list) {
        return list.map((item, index) => {
          return <li key={index}>{item}</li>;
        });
      } 
    }
    
    renderSpecies() {
        let {species} =  this.props;
        return species.map(({id, scientificName, star, images, synonyms, nativeRange}, index) => (
            <div className="species-card" key={index}>
              <li key={id}  value={scientificName}>
                 <div id="bold-scientific-name" className="headline">{scientificName}</div>
                 <div className="align">
                   <div className="title-div">Images:</div>
                   <ul id="image-display">{this.renderImages(scientificName)}</ul>
                 </div>
                 <div className="align"><div className="title-div">Synonyms:</div><ul>{this.renderListItems(synonyms)}</ul></div>
                 <div className="align"><div className="title-div">Native Range:</div><ul>{this.renderListItems(nativeRange)}</ul></div>
                 <div className="vote-box"> 
                   <i id="star" onClick={() => this.onStar(id, star)}>{this.toggleStar(star)}</i>
                 </div>
              </li>
            </div>
        ));
    }
    
    render() {
        return (
            <ul className="wrapper">
                {this.renderSpecies()}
            </ul>
        );
    }
}

const mutation = gql`
    mutation StarSpecies($id: ID) {
        starSpecies(id: $id) {
        id
        star
        }
    }
`;
export default graphql(mutation)(SpeciesList);