import React from 'react';
import { connect } from 'react-redux';
import { Link, hashHistory } from 'react-router';
import Treemap from '../../../components/Treemap';
// import { updateNodePath } from '../../../containers/budgetActions';
const browser = require('detect-browser');

const getButtonClass = (categoryType, buttonName) => {
  if (
    (categoryType === 'use' && buttonName === 'use') ||
    (categoryType === 'department' && buttonName === 'department')) {
    return 'btn btn-primary btn-xs active';
  }
  return 'btn btn-primary btn-xs';
};

const goDeeper = (props) => {
  let curPath = props.path;
  if (props.path.split('-').length > 4) {
    curPath = props.path.split('-').slice(0, 4).join('-');
  }
  let newURL = [props.location.pathname, '?',
    Object.entries(props.location.query).map(([key, value]) => {
      if (key !== 'nodePath') {
        return [key, '=', value, '&'].join('');
      }
      return '';
    }).join('')].join('');
  newURL = [newURL, 'nodePath=', curPath].join('');
  props.history.push(newURL);
};

const goUp = (props, numLevels) => {
  const curPath = props.location.query.nodePath || 'root';
  let newURL = [props.location.pathname, '?',
    Object.entries(props.location.query).map(([key, value]) => {
      if (key !== 'nodePath') {
        return [key, '=', value, '&'].join('');
      }
      return '';
    }).join('')].join('');
  if (curPath === 'root') {
    newURL = [newURL, 'nodePath=root'].join('');
  } else {
    let curNodePathInfo = curPath.split('-');
    let stepsUp = numLevels;
    if (numLevels === undefined) {
      stepsUp = 1;
    }
    curNodePathInfo = curNodePathInfo.slice(0, curNodePathInfo.length - stepsUp).join('-');
    newURL = [newURL, 'nodePath=', curNodePathInfo].join('');
  }
  hashHistory.push(newURL);
};

const findTop = (data, path) => {
  const nodes = path.split('-');
  if (nodes.length === 1) {
    return data.children;
  }
  let curNode = data;
  let prevNode = null;
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = 0; j < curNode.children.length; j += 1) {
      if (curNode.children[j].key === nodes[i]) {
        prevNode = curNode;
        curNode = curNode.children[j];
        break;
      }
    }
  }
  return ((curNode.children === undefined || curNode.children.length === 0) ? prevNode.children : curNode.children);
};

const renderBreadcrumb = (tree, props) => {
  const path = props.location.query.nodePath || 'root';
  const nodes = path.split('-');
  if (nodes.length === 1) {
    return (<div className="pull-left treeMapBreadcrumb"><span>Top</span></div>);
  }
  let curNode = tree;
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = 0; j < curNode.children.length; j += 1) {
      if (curNode.children[j].key === nodes[i]) {
        curNode = curNode.children[j];
        break;
      }
    }
  }
  const levels = curNode.breadcrumbPath.slice(5).split('>');
  return (
    <div className="pull-left treeMapBreadcrumb">
      <span className="treeMapBreadcrumbLink" onClick={props.jumpUp ? () => props.jumpUp(props, levels.length) : null}>Top</span><span> &gt; </span>
      {levels.map((level, index) => {
        return (
          <div style={{ display: 'inline-block' }}>
            <span className={index < levels.length - 1 ? 'treeMapBreadcrumbLink' : ''} key={['breadcrumbLevel', index].join('_')} onClick={props.jumpUp ? () => props.jumpUp(props, levels.length - index - 1) : null}>{level}</span>
            {index < levels.length - 1 && <span> &gt;&nbsp;</span>}
          </div>
        );
      })}
    </div>
  );
};

const BudgetDetailsTreemap = (props) => {
  const myTree = props.location.query.mode === 'expenditures' || props.location.query.mode === undefined ? props.expenseTree : props.revenueTree;

  return (
    <div>
      <div className="row">
        <div className="col-sm-12">
          <h3>
            Treemap of {props.location.query.mode || 'expenditures'}
          </h3>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <div style={{ marginBottom: '15px' }}>
            In the treemap visualization below, the area of each rectangle is proportional to the amount of money represented for that category, whereas the color shows the change from last year. White represents no change, deeper blue represents increased spending/decreased revenue, and deeper orange represents increased revenue/decreased spending. Click a rectangle to see detailed breakdown for that category or mouse over it to see the total amount and label.
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <div className="btn-group pull-left" style={{ marginRight: '3px', marginBottom: '3px' }}>
            <button className="btn btn-primary btn-xs" onClick={props.jumpUp ? () => props.jumpUp(props) : null} disabled={props.location.query.nodePath === 'root' || props.location.query.nodePath === undefined}><i className="fa fa-arrow-up"></i></button>
          </div>
          {renderBreadcrumb(myTree, props)}
          <div className="btn-group pull-left" style={{ display: 'none' }} >
            <button className={getButtonClass(props.categoryType, 'use')}>Use</button>
            <button className={getButtonClass(props.categoryType, 'department')}>Departments</button>
          </div>
          <div className="btn-group pull-right" style={{ marginLeft: '10px' }}>
            <Link to={{ pathname: props.location.pathname, query: { entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, mode: 'expenditures', hideNavbar: props.location.query.hideNavbar } }}>
              <button className={props.location.query.mode !== 'revenue' ? 'btn btn-primary btn-xs active' : 'btn btn-primary btn-xs'} style={{ borderTopRightRadius: '0px', borderBottomRightRadius: '0px' }}>Expenditures</button>
            </Link>
            <Link to={{ pathname: props.location.pathname, query: { entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, mode: 'revenue', hideNavbar: props.location.query.hideNavbar } }}>
              <button className={props.location.query.mode === 'revenue' ? 'btn btn-primary btn-xs active' : 'btn btn-primary btn-xs'} style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }}>Revenue</button>
            </Link>
          </div>
          {browser.name === 'ie' && <div className="col-sm-12 alert-danger">Internet Explorer does not support the TREE MAP visualization. Please explore the budget details via the Details Table, or view this page in Chrome or Firefox.</div>}
          {browser.name !== 'ie' &&
            <Treemap data={findTop(myTree, props.location.query.nodePath || 'root')} diveDeeper={props.diveDeeper} differenceColors history={hashHistory} location={props.location} />
          }
        </div>
      </div>
    </div>
  );
};

BudgetDetailsTreemap.propTypes = {
  categoryType: React.PropTypes.string,
  expenseTree: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
  revenueTree: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
  location: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
  diveDeeper: React.PropTypes.func,
  jumpUp: React.PropTypes.func,
  // expensePath: React.PropTypes.string,
  // revenuePath: React.PropTypes.string,
};

BudgetDetailsTreemap.defaultProps = {
  categoryType: 'department',
  expenseTree: { amount: 0, size: 0, name: 'no data', children: [] },
  revenueTree: { amount: 0, size: 0, name: 'no data', children: [] },
  diveDeeper: goDeeper,
  jumpUp: goUp,
  // expensePath: 'root',
  // revenuePath: 'root',
};

const mapStateToProps = state => (
  {
    expenseTree: state.budget.expenseTreeForTreemap,
    revenueTree: state.budget.revenueTreeForTreemap,
    // expensePath: state.budget.expensePath,
    // revenuePath: state.budget.revenuePath,
  }
);

// const mapDispatchToProps = dispatch => (
//   {
//     diveDeeper: rectangle => (
//       dispatch(updateNodePath(rectangle))
//     ),
//   }
// );


export default connect(mapStateToProps)(BudgetDetailsTreemap);

