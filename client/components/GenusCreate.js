import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';


import query from '../queries/fetchGenera';

class GenusCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genusName: '',
        };
    }
    
    handleSubmit = (e) => {
        e.preventDefault();
        let { genusName } = this.state;
        const { history } = this.props;
        genusName = genusName[0].toUpperCase() + genusName.slice(1).toLowerCase();
        this.props.mutate({
            variables: { genusName },
            refetchQueries: [{ query }]
        }).then(() =>  history.push('/'));
    }
    render() {
        return (
            <div>
                <Link to="/">Back</Link>
                <h3>Create a new Genus!</h3>
                <form onSubmit={this.handleSubmit}>
                <label>Genus Name:</label>
                    <input
                        label="Genus Name:"
                        onChange={e => this.setState({genusName: e.target.value})}
                        value={this.state.genusName}
                    />
                </form>
            </div>
        );
    }
}

const mutation = gql`
    mutation AddGenus($genusName: String){
        addGenus(genusName: $genusName) {
            id,
            genusName,
        }
    }
`;
export default graphql(mutation)(GenusCreate);