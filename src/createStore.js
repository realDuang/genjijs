const createStore = (reducer, initialState) => {
  let currentReducer = reducer;
  let currentState = initialState;
  let listener = () => {};

  return {
    getState() {
      return currentState;
    },
    dispatch(action) {
      let { type } = action;
      currentState = currentReducer(currentState, action);
      listener();
      return action;
    },
    subscribe(newListener) {
      listener = newListener;
    }
  };
};

export default createStore;
