import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';


import genusQuery from '../queries/fetchGenus';

class SpeciesCreate extends Component {
    constructor(props) {
        super(props);
        this.genus = this.props.genusName + " ";
        this.state = {
            scientificName: '', 
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let prefix = this.genus;
        let { scientificName } = this.state;
        let { genusId } = this.props;
        scientificName = prefix + scientificName.toLowerCase();
        this.props.mutate({
            variables: {
                scientificName, 
                genusId,
            }
        }).then(() => this.setState({scientificName: ''}));
    }
    
    render() {
        const { scientificName } = this.state;
        return (
            <form onSubmit={this.handleSubmit}>
                <label>Enter the name of species</label>
                <input 
                    value={scientificName}
                    onChange={evt => this.setState({scientificName: evt.target.value})}
                />
            </form>
        );
    }
}

const mutation = gql`
    mutation AddSpecies($scientificName: String, $genusId: ID) {
        addSpeciesToGenus(scientificName: $scientificName, genusId: $genusId) {
            id
            species {
                id
                scientificName
                star
                images
                synonyms,
                nativeRange
            }
        }
    }
`;

export default graphql(mutation)(SpeciesCreate);