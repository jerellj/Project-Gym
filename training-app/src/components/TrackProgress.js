import React, { useState } from 'react';
import UserList from './UserList';
import CurrentSession from './CurrentSession';
import ProgressTable from './ProgressTable';

const TrackProgress = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div>
      <UserList onSelectUser={setSelectedUser} />
      {selectedUser && (
        <div>
          <CurrentSession userId={selectedUser._id} />
          <ProgressTable userId={selectedUser._id} />
        </div>
      )}
    </div>
  );
};

export default TrackProgress;