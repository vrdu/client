import { useReducer } from 'react';

// Define action types
const ADD_LABEL_FAMILY = 'ADD_LABEL_FAMILY';
const UPDATE_LABEL_FAMILY = 'UPDATE_LABEL_FAMILY';
const ADD_OR_UPDATE_LABEL = 'ADD_OR_UPDATE_LABEL';

// Reducer function to manage the state of label families
const labelFamiliesReducer = (state, action) => {
  switch (action.type) {
    case ADD_LABEL_FAMILY:
      const familyExists = state.some(family => family.id === action.payload.id);

      // If family exists, update it and set all others' register to false
      if (familyExists) {
        return state.map(family =>
          family.id === action.payload.id
            ? { 
                ...family, 
                labelFamilyName: action.payload.labelFamilyName, 
                labelFamilyDescription: action.payload.labelFamilyDescription, 
                register: true, // Set 'register' to true for the updated family
                inUse: false
              }
            : { 
                ...family, 
                register: false // Set 'register' to false for all other families
              }
        );
        
      }

      // If family doesn't exist, add it and set all others' register to false
      return [
        ...state.map(family => ({ ...family, register: false })), // Set 'register' to false for all existing families
        {
          ...action.payload, // Add the new family
          register: true // Set 'register' to true for the newly added family
        }
      ];

    case UPDATE_LABEL_FAMILY:
      const existingFamily = state.some(family => family.id === action.payload.id);

      // If family exists, update it and set all others' register to false
      if (existingFamily) {
        return state.map(family =>
          family.id === action.payload.id
            ? { 
                ...family, 
                labelFamilyName: action.payload.labelFamilyName, 
                labelFamilyDescription: action.payload.labelFamilyDescription, 
                register: false // Set 'register' to true for the updated family
              }
            : { 
                ...family, 
                register: false // Set 'register' to false for all other families
              }
        );
      }

      // If family doesn't exist, add it and set all others' register to false
      return [
        ...state.map(family => ({ ...family, register: false })), // Set 'register' to false for all existing families
        {
          ...action.payload, // Add the new family
          register: false // Set 'register' to true for the newly added family
        }
      ];

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

  // Add label family and return a promise
  const addLabelFamily = (newLabelFamily) => {
    return new Promise((resolve, reject) => {
      try {
        dispatch({ type: ADD_LABEL_FAMILY, payload: newLabelFamily });
        resolve();  // Resolve the promise after dispatch is done
      } catch (error) {
        reject(error);  // Reject the promise in case of error
      }
    });
  };

  // Update label family and return a promise
  const updateLabelFamily = (newLabelFamily) => {
    return new Promise((resolve, reject) => {
      try {
        dispatch({ type: UPDATE_LABEL_FAMILY, payload: newLabelFamily });
        resolve();  // Resolve the promise after dispatch is done
      } catch (error) {
        reject(error);  // Reject the promise in case of error
      }
    });
  };

  // Add or update a label inside a label family
  const addOrUpdateLabel = (familyId, newLabel) => {
    return new Promise((resolve, reject) => {
      try {
        dispatch({ type: ADD_OR_UPDATE_LABEL, familyId, payload: newLabel });
        resolve();  // Resolve after the label is added or updated
      } catch (error) {
        reject(error);  // Reject in case of error
      }
    });
  };

  return {
    labelFamilies,
    addLabelFamily,
    updateLabelFamily,
    addOrUpdateLabel,
  };
};
