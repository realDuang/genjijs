import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { unitTypes } from './index.js';

const mapStateToProps = rootState => {
  return { ...rootState, rootState };
};
const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    add: () => {
      dispatch({
        type: unitTypes['numberUnit'].add,
        payload: {
          addNum: 1
        }
      });
    },
    addAsync: () => {
      dispatch({
        type: unitTypes['numberUnit'].addAsync,
        payload: {
          addNum: 10
        }
      });
    },
    saveAsync: () => {
      dispatch({
        type: unitTypes['numberUnit'].saveAsync
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(props => {
  useEffect(() => {
    props.saveAsync();
  }, []);

  return (
    <div>
      {props.number.saveAsyncLoading ? (
        <div>Loading...</div>
      ) : (
        <div onClick={props.saveAsync}>init num from mock (click me)</div>
      )}
      <div onClick={props.add}>action test (click me)</div>
      {props.number.addAsyncLoading ? (
        <div>Loading...</div>
      ) : (
        <div onClick={props.addAsync}>effect test (click me)</div>
      )}

      <div>current number is: {props.number.num}</div>
    </div>
  );
});
