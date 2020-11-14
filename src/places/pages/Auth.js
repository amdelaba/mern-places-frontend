import React from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button'
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH, VALIDATOR_EMAIL } from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook'

import './Auth.css';
import Card from '../../shared/components/UIElements/Card';

const Auth = props => {

  const [formState, inputHandler] = useForm({
    email: {
      value: '',
      isValid: false,
    },
    password: {
      value: '',
      isValid: false,
    }
  },
  false);

  const placeSubmitHandler = event => {
    event.preventDefault();
    console.log(formState.inputs)
  };

  return  (
    <Card className="authentication">
      <form className="place-form" onSubmit={placeSubmitHandler}>

        <Input 
          id="email"
          element="input" 
          type="email"
          label="Email"
          validators={[VALIDATOR_MINLENGTH(6), VALIDATOR_EMAIL()]}
          errorText="Please Enter a Valid Email. Minimum 6 characters"
          onInput={inputHandler}
          />
        <Input 
          id="password"
          element="input" 
          label="password"
          type="password"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please Enter a Valid Password. Minimum 5 characters"
          onInput={inputHandler}
          />

        <Button type="submit" disabled={!formState.isValid}>
          LOGIN
        </Button>
      </form>
    </Card>

  );

};

export default Auth;