import React from 'react';
import UsersList from '../components/UsersList';

const Users = () => {
  const USERS = [
    {id: 'u1', name: 'Andres', image: 'https://www.agora-gallery.com/advice/wp-content/uploads/2015/10/image-placeholder.png', places: 3}
  ];
  return (
    <UsersList items={USERS}/>
  );
};

export default Users;