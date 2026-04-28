import React from 'react';
import Button from '../Button';

function FeedingSpecies({ data, stintSpecies, setFeedingSpecies }) {
  return (
    <div className="plot">
      <p>Species: {data || 'Unspecified'}</p>
      <div className="plot-bt">
        {stintSpecies.map((sp, index) => (
          <Button key={index} handleData={setFeedingSpecies} value={sp} selected={sp === data} />
        ))}
        <Button handleData={setFeedingSpecies} value="" />
      </div>
    </div>
  );
}

export default FeedingSpecies;
