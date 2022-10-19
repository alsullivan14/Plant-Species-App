import gql from 'graphql-tag';

export default gql`
    query GenusQuery($id: ID!) {
        genus(id: $id) {
            id,
            genusName
            species {
                id
                scientificName
                star
                images
                synonyms
                nativeRange
            }
        }
    }
`;