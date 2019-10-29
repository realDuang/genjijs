const combineReducer = reducers => (unit = {}, action) => {
  let { type } = action;
  let unitKey = type.split("/")[0];
  let reducer = type.split("/")[1];

  reducers.forEach(curReducer => {
    if (curReducer.name === reducer) {
      unit[unitKey] = curReducer(unit[unitKey], action);
    }
  });

  return unit;
};

export default combineReducer;
