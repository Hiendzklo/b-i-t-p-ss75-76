import React from 'react';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, onConfirm, title, message }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 w-1/3">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        <div className="py-4">
          <p>{message}</p>
        </div>
        <div className="flex justify-end border-t pt-2">
          <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-4 rounded mr-2">
            Hủy
          </button>
          <button onClick={onConfirm} className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded">
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
