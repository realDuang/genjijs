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
  async function getFileContent() {
    const result = await props.dispatch({
      type: unitTypes['numberUnit'].saveAsync
    });
    console.log(result);
    return result
  }

  useEffect(() => {
    getFileContent();
  }, []);

  return (
    <div>
      <div onClick={props.add}>action test:{props.number.num}(click me)</div>
      <div onClick={props.addAsync}>
        {props.number.addAsyncLoading && <span>Loading...</span>}
        effect test:{props.number.num}(click me)
      </div>
      <div onClick={() => {
        props.dispatch({
          type: unitTypes['numberUnit'].saveAsync
        })
      }}>save test(click me)</div>
    </div>
  );
});
