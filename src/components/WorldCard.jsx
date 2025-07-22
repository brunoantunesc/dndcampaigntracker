// src/components/WorldCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {CommonButton} from './Buttons.tsx';

const WorldCard = ({ world }) => {
  const navigate = useNavigate();

  return (
    <div className="border p-4 rounded shadow-md bg-white hover:shadow-lg transition">
      <h2 className="text-xl font-semibold mb-2">{world.name}</h2>
      <p className="text-sm text-gray-600 mb-4">{world.description || 'No description'}</p>
      <CommonButton onClick={() => navigate(`/worlds/${world._id}`)} variant="secondary">
        View World
      </CommonButton>
    </div>
  );
};

WorldCard.propTypes = {
  world: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
};

export default WorldCard;
