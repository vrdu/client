import { useReducer } from 'react';

// Define action types
const ADD_OR_UPDATE_FAMILY = 'ADD_OR_UPDATE_FAMILY';
const ADD_OR_UPDATE_LABEL = 'ADD_OR_UPDATE_LABEL';

// Reducer function to manage the state of label families
const labelFamiliesReducer = (state, action) => {
  switch (action.type) {
    case ADD_OR_UPDATE_FAMILY:
      const existingFamily = state.find(family => family.id === action.payload.id);
      if (existingFamily) {
        return state.map(family =>
          family.id === action.payload.id
            ? { ...family, labelFamilyName: action.payload.labelFamilyName, labelFamilyDescription: action.payload.labelFamilyDescription }
            : family
        );
      }
      console.log("chere"+ action.payload);
      return [...state, action.payload];

    case ADD_OR_UPDATE_LABEL:
      return state.map(family => {
        if (family.id === action.familyId) {
          const existingLabel = family.labels.find(label => label.id === action.payload.id);
          if (existingLabel) {
            return {
              ...family,
              labels: family.labels.map(label =>
                label.id === action.payload.id ? { ...label, ...action.payload } : label
              ),
            };
          }
          return { ...family, labels: [...family.labels, action.payload] };
        }
        return family;
      });

    default:
      return state;
  }
};

// Custom hook to manage label families and labels with reducer
export const useLabelFamiliesWithReducer = () => {
  const [labelFamilies, dispatch] = useReducer(labelFamiliesReducer, []);

  const addOrUpdateLabelFamily = (newLabelFamily) => {
    dispatch({ type: ADD_OR_UPDATE_FAMILY, payload: newLabelFamily });
  };

  const addOrUpdateLabel = (familyId, newLabel) => {
    dispatch({ type: ADD_OR_UPDATE_LABEL, familyId, payload: newLabel });
  };

  return {
    labelFamilies,
    addOrUpdateLabelFamily,
    addOrUpdateLabel,
  };
};
