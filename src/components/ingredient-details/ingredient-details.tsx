import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import {
  addIngredient,
  setBun
} from '../../services/slices/constructorIngredientSlice';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ingredients = useSelector(selectIngredients);
  const ingredientData = ingredients.find(
    (ingredient) => id === ingredient._id
  );
  const handleAdd = () => {
    if (!ingredientData) return;
    if (ingredientData.type === 'bun') {
      dispatch(setBun(ingredientData));
      navigate(-1);
    } else dispatch(addIngredient(ingredientData));
  };
  if (!ingredientData) {
    return <Preloader />;
  }

  return (
    <IngredientDetailsUI
      handleAdd={handleAdd}
      ingredientData={ingredientData}
    />
  );
};
