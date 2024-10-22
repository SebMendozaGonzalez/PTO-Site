import React from 'react';

function RequestView({ requestId }) {
  return (
    <div className='flexColStart paddings request-view'>
      The request_id is: {requestId || "No request selected"}
    </div>
  );
}

export default RequestView;
