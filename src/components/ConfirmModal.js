import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmModal = ({
  show,
  onHide,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="mb-0">{message}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button 
          variant="secondary" 
          className="btn-custom"
          onClick={onHide}
          disabled={loading}
        >
          {cancelText}
        </Button>

        <Button 
          variant={variant} 
          className="btn-custom"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading && (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Loading...
            </>
          )}
          {!loading && confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
