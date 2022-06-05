import { ThunkDispatch } from 'redux-thunk';
import axios from 'axios';

import { AuthAction, AuthActionType } from './types';
import { AuthState } from './models/AuthState';
import { IUserDto } from '../../../db/interfaces';
import { getError } from '../../../utils/getAxiosError';
import IRegisterUserRequest from '../../../controllers/interfaces/IRegisterUserRequest';

// Register user
export const registerUser =
  (userData: IRegisterUserRequest) =>
  async (dispatch: ThunkDispatch<AuthState, undefined, AuthAction>): Promise<AuthAction> => {
    try {
      dispatch({
        type: AuthActionType.AUTH_REQUEST,
      });

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post<IUserDto>('/api/auth/register', userData, config);

      return dispatch({
        type: AuthActionType.REGISTER_USER_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const err = getError(error);

      return dispatch({
        type: AuthActionType.REGISTER_USER_FAIL,
        payload: err,
      });
    }
  };