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

  console.log('props', props);

  useEffect(() => {
    getFileContent();
  }, []);

  return (
    <div onClick={props.add}>
      {props.number.desc}: {props.number.num}
    </div>
  );
});
