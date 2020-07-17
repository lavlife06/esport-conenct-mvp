import {
  FETCHEVENTS_SUCCESS,
  FETCHEVENTS_FAIL,
  ADDEVENT_SUCCESS,
  ADDEVENT_FAIL,
  GETSEARCHEDEVENTS,
  CLEARSEARCHEDEVENTS,
} from './types';
import axios from 'axios';
import { ipAddress } from '../ipaddress';
import { setAlert } from './alert';
import { getCurrentProfile } from './profile';
import {loading} from './loading'

//  Fetch all events to show the users/players
export const fetchallEvents = () => async (dispatch) => {
  try {
    dispatch(loading(true))
    const res = await axios.get(`http://${ipAddress}:3000/api/event/allevents`);
    dispatch({
      type: FETCHEVENTS_SUCCESS,
      payload: res.data,
    });
    console.log(res.data)
    dispatch(loading(false))
  } catch (err) {
    console.log(`error from fetchallevents : ${err.message}`);
    dispatch(loading(false))
  }
};

// Add users Event
export const AddMyEvent = (eventdata) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify(eventdata);
  try {
    const res = await axios.post(
      `http://${ipAddress}:3000/api/event/addevent`,
      body,
      config
    );
    // console.log('signup res.data: ', res.data);
    dispatch({
      type: ADDEVENT_SUCCESS,
    });
  } catch (err) {
    const errors = err.response.data.errors;
    // this errors are the errors send form the backend

    if (errors) {
      errors.forEach((error) => {
        dispatch(setAlert(error.msg, 'danger'));
      });
    }
    console.log(`error from addmyevent : ${err.message}`);
  }
};

// Get all searched events
// will bring bunch of events searched in input
export const getEvents = (eventname) => async (dispatch) => {
  try {
    const res = await axios.get(
      `http://${ipAddress}:3000/api/event/searchedevents/${eventname}`
    );

    dispatch({
      type: GETSEARCHEDEVENTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: CLEARSEARCHEDEVENTS,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
