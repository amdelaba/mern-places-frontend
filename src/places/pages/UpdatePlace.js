import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth.context';

import './PlaceForm.css';


const UpdatePlace = props => {
  
  const auth = useContext(AuthContext)
  const placeId = useParams().placeId;

  const [ loadedPlace, setLoadedPlace] = useState();
  const { isLoading, error, sendRequest, clearError} = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm({
    title: {
      value: '',
      isValid: false,
    },
    description: {
      value: '',
      isValid: false,
    }
  }, false);

  useEffect( () => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_API_URL}/places/${placeId}`);
        setLoadedPlace(responseData.place);
        console.log('identifiedPlace', responseData);
        setFormData({
          title: {
            value: responseData.place.title,
            isValid: true,
          },
          description: {
            value: responseData.place.title,
            isValid: true,
          }
        }, true);
      } catch(err) {
        console.log(err);
      }
    }
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  const history = useHistory();

  const placeUpdateSubmitHandler = async event => {
    event.preventDefault();
    console.log('update form inputs', formState.inputs);
    try {
      const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_API_URL}/places/${placeId}`, 
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + auth.token
        }
      );
      console.log(responseData);
      history.push(`/${auth.userId}/places`);
    } catch(err) {
      console.log(err); 
    }
  };


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      {isLoading &&
        <div className="center">
          <LoadingSpinner/>
        </div>
      }
      {!loadedPlace && !error &&
        <div className="center">
          <Card>
            <h2>"Could not find such place!"</h2>
          </Card>
        </div>
      }
      {!isLoading && loadedPlace && 
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input 
            id="title" 
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please Enter Valid Title"
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true} />
          <Input 
            id="description" 
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please Enter Valid Description"
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialValid={true} />
          <Button 
            type="submit" 
            disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      }

    </React.Fragment>
    )
};

export default UpdatePlace;