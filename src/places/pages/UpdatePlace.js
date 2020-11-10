import React from 'react';
import { useParams } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';

import './PlaceForm.css';

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'Famous Skyscraper 1',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484405,
      lng: -73.9878584
    },
    creator: 'u1'
  },
  {
    id: 'p2',
    title: 'Empire State Building 2',
    description: 'Famous Skyscraper 2',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484405,
      lng: -73.9878584
    },
    creator: 'u2'
  },

];

const UpdatePlace = props => {
  const placeId = useParams().placeId;

  const identifiedPlace  = DUMMY_PLACES.find(place => place.id === placeId);

  if (!identifiedPlace) {
    return (
      <div className="center">
        <h2>"Could not find such place!"</h2>
      </div>
    );
  }

  return (
    <form className="place-form">
      <Input 
        id="title" 
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please Enter Valid Title"
        onInput={()=> {}}
        value={identifiedPlace.title}
        valid={true} />
      <Input 
        id="description" 
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please Enter Valid Description"
        onInput={()=> {}}
        value={identifiedPlace.description}
        valid={true} />
      
      <Button type="submit" disabled={true}>
        UPDATE PLACE
      </Button>
    </form>
  )
};

export default UpdatePlace;