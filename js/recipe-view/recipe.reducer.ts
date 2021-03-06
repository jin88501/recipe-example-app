import { Reducer, Action } from "redux";
import { omit, set } from "lodash/fp";
import { Unit } from "../graph-queries/types";
import { CartStateItem } from "../checkout-view/checkout.reducer";

export const RECIPE_VIEW_SELECT_INGREDIENT = "RECIPE_VIEW_SELECT_INGREDIENT";
export const RECIPE_VIEW_CHANGE_CART_COUNT = "RECIPE_VIEW_CHANGE_CART_COUNT";
export const RECIPE_VIEW_CLEAR_DRAFT = "RECIPE_VIEW_CLEAR_DRAFT";

type RecipeViewActions =
  | {
      type: typeof RECIPE_VIEW_SELECT_INGREDIENT;
      payload: {
        index: number;
        name: string;
        value: number;
        unit: Unit;
      };
    }
  | {
      type: typeof RECIPE_VIEW_CHANGE_CART_COUNT;
      payload: {
        index: number;
        count: number;
      };
    }
  | {
      type: typeof RECIPE_VIEW_CLEAR_DRAFT;
    };

type RecipeViewState = {
  cartDraft: {
    [s: number]: CartStateItem;
  };
};
const defaultState = {
  cartDraft: {},
};

const reducer: Reducer<RecipeViewState, RecipeViewActions> = (
  state = defaultState,
  action
) => {
  switch (action.type) {
    case RECIPE_VIEW_SELECT_INGREDIENT:
      return {
        ...state,
        cartDraft: state.cartDraft[action.payload.index]
          ? omit(action.payload.index, state.cartDraft)
          : set(
              action.payload.index,
              {
                value: action.payload.value,
                unit: action.payload.unit,
                name: action.payload.name,
                count: 1,
              },
              state.cartDraft
            ),
      };
    case RECIPE_VIEW_CHANGE_CART_COUNT:
      return set(
        `cartDraft[${action.payload.index}].count`,
        action.payload.count,
        state
      );
    case RECIPE_VIEW_CLEAR_DRAFT:
      return {
        ...state,
        cartDraft: {},
      };
    default:
      return state;
  }
};

export const register = { RecipeView: reducer };
