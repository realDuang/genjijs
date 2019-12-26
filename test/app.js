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
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(props => {
  async function getFileContent() {
    const result = await props.dispatch({
      type: unitTypes['numberUnit'].addAsync
    });
    console.log(result);
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
    </div>
  );
});
