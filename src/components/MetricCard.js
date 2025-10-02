import React from 'react';
import { Card } from 'react-bootstrap';
import { formatNumber, formatPercentage } from '../utils/helpers';

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  gradient = false,
  className = '' 
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-success';
      case 'negative': return 'text-danger';
      default: return 'text-muted';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive': return 'bi-arrow-up';
      case 'negative': return 'bi-arrow-down';
      default: return 'bi-dash';
    }
  };

  const cardClassName = `analytics-card h-100 ${gradient ? 'card-gradient' : ''} ${className}`;
  const textColor = gradient ? 'text-white' : '';

  return (
    <Card className={cardClassName}>
      <Card.Body className="text-center">
        {icon && (
          <div className={`mb-3 ${textColor}`}>
            <i className={`${icon} fs-2`}></i>
          </div>
        )}

        <div className={`metric-value ${textColor}`}>
          {formatNumber(value)}
        </div>

        <div className={`metric-label ${textColor}`}>
          {title}
        </div>

        {change !== undefined && change !== null && (
          <div className={`metric-change ${gradient ? 'text-white-50' : getChangeColor()}`}>
            <i className={`bi ${getChangeIcon()} me-1`}></i>
            {formatPercentage(Math.abs(change))}
            <span className="ms-1 small">vs last period</span>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default MetricCard;
