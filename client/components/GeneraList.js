import React, {Component} from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { Link } from 'react-router-dom';


import query from '../queries/fetchGenera';

class GenusList extends Component {

    deleteGenus(id) {
        this.props.mutate({
            variables: { id },
            refetchQueries: [{ query }]
        }).then(() =>  this.props.data.refetch());
    }
    
    renderGenera() {
        const {genera} = this.props.data;
        return genera.map(({id, genusName}) => (
            <li key={id}  className="collection-item">
                    <Link to={`/genus/${id}`}> 
                        {genusName}
                    </Link>
                <i
                    className="material-icons"
                    onClick={() => this.deleteGenus(id)}
                >
                    delete
                </i>
            </li>
        ));
    }
    render() {
        const {loading} = this.props.data;
        if(loading) { return <div>Loading....</div> }
        return (
            <div>
                <h3 className="headline">Orchidaceae</h3>
                <ul className="collection">
                    {this.renderGenera()}
                </ul>
                                <Link to="/genus/new" className="btn-floating btn-large red right">
                    <i className="material-icons">add</i>
                </Link>
            </div>
        );
    }
}

const mutation = gql`
    mutation DeleteGenus($id: ID) {
        deleteGenus(id: $id) {
            id
        }
    }
`;
export default compose(
    graphql(mutation),
    graphql(query))(GenusList);