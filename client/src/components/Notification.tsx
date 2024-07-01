import React, { useEffect } from 'react';

interface NotificationProps {
  type: 'success' | 'update' | 'delete';
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ type, message, onClose }) => {
  let bgColor = '';
  let textColor = '';

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  switch (type) {
    case 'success':
      bgColor = 'bg-green-100';
      textColor = 'text-green-700';
      break;
    case 'update':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-700';
      break;
    case 'delete':
      bgColor = 'bg-red-100';
      textColor = 'text-red-700';
      break;
    default:
      break;
  }

  return (
    <div className={`${bgColor} ${textColor} p-2 rounded-lg mb-2`}>
      {message}
    </div>
  );
};

export default Notification;
