import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button'
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth.context';


import './PlaceForm.css';

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm({
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
      address: {
        value: '',
        isValid: false,
      }
  }, false);

  const history = useHistory();
  const placeSubmitHandler = async event => {
    event.preventDefault();
    console.log(formState.inputs);

    try {
      const responseData = await sendRequest(
        'http://localhost:5000/api/places',
        'POST', 
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address: formState.inputs.address.value,
          creator: auth.userId
        }),
        {
          'Content-Type': 'application/json'
        }
      );
      // Redirect user to home
      // push adds a page to the stack in order to let user go back
      history.push('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      {isLoading && <LoadingSpinner/> }
      <form className="place-form" onSubmit={placeSubmitHandler}>
        <Input
          id="title"
          element="input" 
          type="text" 
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please Enter a Valid Title"
          onInput={inputHandler}
           />
        <Input 
          id="description"
          element="textarea" 
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please Enter a Valid Description. Minimum 5 characters"
          onInput={inputHandler}
           />
        <Input 
          id="address"
          element="input" 
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please Enter a Valid Address."
          onInput={inputHandler}
           />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;