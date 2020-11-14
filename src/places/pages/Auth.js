import React, { useState } from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button'
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH, VALIDATOR_EMAIL } from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook'

import './Auth.css';
import Card from '../../shared/components/UIElements/Card';

const Auth = props => {

  const [isLoginMode, setIsLoginMode] = useState(true);

  const [formState, inputHandler, setFormData] = useForm({
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

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData({
        ...formState.inputs,
        name: undefined
      },formState.inputs.email.isValid && formState.inputs.password.isValid )
    } else {
      setFormData({
        ...formState.inputs,
        name: {
          value: '',
          isValid: false
        }
      }, false)
    }
    setIsLoginMode(prevMode => !prevMode)
  };

  const authSubmitHandler = event => {
    event.preventDefault();
    console.log(formState.inputs)
  };

  return  (
    <Card className="authentication">
      <form className="place-form" onSubmit={authSubmitHandler}>
        {
         !isLoginMode &&
          <Input 
            id="name"
            element="input" 
            type="text"
            label="Username"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please Enter a Name"
            onInput={inputHandler}
          />
        }
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
          {isLoginMode ? 'LOGIN' : 'SIGNUP'}
        </Button>
      </form>
      <Button inverse onClick={switchModeHandler}>
        SWITCH TO { isLoginMode ? 'SIGNUP' : 'LOGIN' }
      </Button>
    </Card>

  );

};

export default Auth;