import React from 'react';
import { Link } from 'react-router';
import BudgetDetailsTable from './BudgetDetailsTable';
import BudgetDetailsTreemap from './BudgetDetailsTreemap';

const BudgetSummaryDetails = props => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        <h1>
          Proposed Budget 2017-18
          <div className="btn-group pull-right" style={{ marginLeft: '10px' }}>
            <Link to={{ pathname: '/topics/budget', query: { entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, hideNavbar: props.location.query.hideNavbar } }}>
              <button className="btn btn-primary" style={{ borderTopRightRadius: '0px', borderBottomRightRadius: '0px' }}>Summary</button>
            </Link>
            <Link to={{ pathname: '/topics/budget/details', query: { entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, mode: props.location.query.mode || 'expenditures', hideNavbar: props.location.query.hideNavbar } }}>
              <button className="btn btn-primary active" style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }}>Details</button>
            </Link>
          </div>
        </h1>
        <div className="pull-left">
          <a href="http://www.ashevillenc.gov/civicax/filebank/blobdload.aspx?blobid=27587" target="_blank">Full budget document</a>
        </div>
      </div>
    </div>
    <BudgetDetailsTreemap categoryType="department" {...props} />
    <hr style={{ marginTop: '20px' }}></hr>
    <BudgetDetailsTable {...props} />
  </div>
);

BudgetSummaryDetails.propTypes = {
  location: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default BudgetSummaryDetails;
