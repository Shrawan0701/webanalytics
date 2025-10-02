import React from 'react';
import { Button } from 'react-bootstrap';

const EmptyState = ({ 
  icon = 'bi-inbox', 
  title = 'No data available', 
  description = 'There is no data to display at the moment.',
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state-icon">
        <i className={`bi ${icon}`}></i>
      </div>

      <h3 className="empty-state-title">{title}</h3>

      <p className="empty-state-description">{description}</p>

      {actionText && onAction && (
        <Button 
          variant="primary" 
          className="btn-custom btn-primary-custom"
          onClick={onAction}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
