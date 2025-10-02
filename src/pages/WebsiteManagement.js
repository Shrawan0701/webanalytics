import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Table, Alert, Modal } from 'react-bootstrap';
import api from '../utils/api';

export default function WebsiteManagement() {
  const [websites, setWebsites] = useState([]);
  const [formData, setFormData] = useState({ name: '', domain: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [websiteToDelete, setWebsiteToDelete] = useState(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState(null);

    // Existing useEffect, handlers...

    const handleShowCode = (websiteId) => {
      setSelectedWebsiteId(websiteId);
      setShowCodeModal(true);
    };

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    try {
      const res = await api.get('/websites');
      setWebsites(res.data);
    } catch {
      setError('Failed to fetch websites');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddWebsite = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const res = await api.post('/websites', formData);
      setWebsites(prev => [...prev, res.data]);
      setSuccess('Website added successfully');
      setFormData({ name: '', domain: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add website');
    }
  };

  const handleDeleteWebsite = async () => {
    if (!websiteToDelete) return;
    try {
      await api.delete(`/websites/${websiteToDelete}`);
      setWebsites(prev => prev.filter(w => w.websiteId !== websiteToDelete));
      setSuccess('Website deleted successfully');
      setShowDeleteModal(false);
      setWebsiteToDelete(null);
    } catch {
      setError('Failed to delete website');
    }
  };

  return (
    <Container className="dashboard-container">
      <h1 className="page-title">Manage Websites</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleAddWebsite} className="mb-4">
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Website Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter website name"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="domain">
          <Form.Label>Domain</Form.Label>
          <Form.Control
            type="url"
            name="domain"
            value={formData.domain}
            onChange={handleChange}
            placeholder="https://example.com"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="btn-custom btn-primary-custom">Add Website</Button>
      </Form>

      <h4>Existing Websites</h4>
      {!loading && websites.length === 0 && (<p>No websites added yet.</p>)}
      {loading && <p>Loading websites...</p>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Domain</th>
            <th>Actions</th>
          </tr>
        </thead>
       <tbody>
         {websites.map(website => (
           <tr key={website.websiteId}>
             <td>{website.name}</td>
             <td>{website.domain}</td>
             <td>
               <div className="action-btn-group">
                 <Button
                   className="btn-green-custom"
                   variant="info"
                   size="sm"
                   onClick={() => handleShowCode(website.websiteId)}
                 >
                   Show Code
                 </Button>

                 <Button
                   className="btn-red-custom"
                   variant="danger"
                   size="sm"
                   onClick={() => { setWebsiteToDelete(website.websiteId); setShowDeleteModal(true); }}
                 >
                   Delete
                 </Button>
               </div>
             </td>
           </tr>
         ))}
       </tbody>

      </Table>
      <Modal show={showCodeModal} onHide={() => setShowCodeModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tracking Snippet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Copy and paste this before <code>&lt;/body&gt;</code> in your website's <code>index.html</code>:</p>
          <pre>
      {`

      <script>
      (function() {
        var s = document.createElement("script");
        s.src = "https://websiteanalytics.vercel.app//tracking.js?website=${selectedWebsiteId}";
        s.async = true;
        document.body.appendChild(s);
      })();
      </script>
      `}
          </pre>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCodeModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this website?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteWebsite}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
