import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class SearchResults extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    if (this.props.data) {
      return (
        <div>
          <p>Results:</p>
          <p>{JSON.stringify(this.props.data.search)}</p>
        </div>
      );
    }
    return (
      <div>
        <h2>NOTHING YET!</h2>
        <p>{JSON.stringify(this.props)}</p>
      </div>
    );
  }
}

SearchResults.propTypes = {
  data: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

// const sampleCivicAddressId = '230095';

const myQuery = gql`
  query Search($searchString: String!, $searchContexts:[String!]){
    search (searchString: $searchString, searchContexts: $searchContexts) {
      type
      results {
        score
        type
        ... on AddressResult {
          id
          civic_address_id
          full_address
          pin
          owner
          is_in_city
        }
        ... on SillyResult {
          id
          text
        }
      }
    }
  }
`;

export default graphql(myQuery, {
  options(props) {
    return {
      variables: {
        searchString: props.searchString,
        searchContexts: props.searchContexts,
      },
    };
  },
})(SearchResults);