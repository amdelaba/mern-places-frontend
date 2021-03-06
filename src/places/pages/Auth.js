import React, { useState, useContext } from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button'
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH, VALIDATOR_EMAIL } from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook'
import { AuthContext } from '../../shared/context/auth.context';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

import './Auth.css';

const Auth = props => {

  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const {isLoading, error, sendRequest, clearError} = useHttpClient();

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
        name: undefined,
        image: undefined
      },formState.inputs.email.isValid && formState.inputs.password.isValid )
    } else {
      setFormData({
        ...formState.inputs,
        name: {
          value: '',
          isValid: false,
        },
        image: {
          value: null,
          isValid: false
        }
      }, false)
    }
    setIsLoginMode(prevMode => !prevMode)
  };

  const authSubmitHandler = async event => {
    event.preventDefault();
    console.log(formState.inputs)
    if(isLoginMode){
      // LOGIN
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_API_URL}/users/login`, 
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {
            'Content-Type': 'application/json'
          }
        );
        console.log('responseData', responseData)
        auth.login(responseData.userId, responseData.token);
      } catch(err) {
        console.log(err);
      }
    } else {
      //SIGNUP
      try {
        const formData = new FormData();
        formData.append('name', formState.inputs.name.value );
        formData.append('email', formState.inputs.email.value );
        formData.append('password', formState.inputs.password.value );
        formData.append('image', formState.inputs.image.value );

        // fetch() api sets headers automatically for FormData
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_API_URL}/users/signup`, 
          'POST',
          formData
        );
        console.log('responseData', responseData)
        auth.login(responseData.userId, responseData.token);
      } catch(err) {
        console.log(err); 
      }
    }
  };

  return  (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      <Card className="authentication">
       {isLoading && <LoadingSpinner/> }
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
          {!isLoginMode &&
            <ImageUpload 
              id='image' 
              center 
              onInput={inputHandler} 
              errorText= 'Please provide an image'
            />
          }
          <Input 
            id="email"
            element="input" 
            type="email"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please Enter a Valid Email. Minimum 6 characters"
            onInput={inputHandler}
            />
          <Input 
            id="password"
            element="input" 
            label="password"
            type="password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please Enter a Valid Password. Minimum 6 characters"
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
    </React.Fragment>

  );

};

export default Auth;