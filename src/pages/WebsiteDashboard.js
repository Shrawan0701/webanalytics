import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Alert, Table } from 'react-bootstrap';
import api from '../utils/api';
import MetricCard from '../components/MetricCard';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function WebsiteDashboard() {
  const { websiteId } = useParams();

  const [overview, setOverview] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOverview() {
      setLoading(true);
      setError(null);
      try {
        const overviewRes = await api.get(`/analytics/${websiteId}/overview`);
        setOverview(overviewRes.data);

        const chartRes = await api.get(`/analytics/${websiteId}/chart-data`);
        setChartData(chartRes.data);
      } catch (err) {
        setError('Failed to load analytics overview');
      } finally {
        setLoading(false);
      }
    }

    fetchOverview();
  }, [websiteId]);

  useEffect(() => {
    async function fetchEvents() {
      setLoadingEvents(true);
      setError(null);
      try {
        const eventsRes = await api.get(`/analytics/${websiteId}/events`, {
          params: { page, size },
        });
        setEvents(eventsRes.data.content);
        setTotalPages(eventsRes.data.totalPages);
      } catch (err) {
        setError('Failed to load events');
      } finally {
        setLoadingEvents(false);
      }
    }

    fetchEvents();
  }, [websiteId, page, size]);

  if (loading) return <Container className="p-5 text-center">Loading analytics...</Container>;
  if (error) return <Container className="p-5"><Alert variant="danger">{error}</Alert></Container>;

  const handlePageChange = (newPage) => {
    if(newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <Container className="dashboard-container">
      <h1 className="page-title mb-4">Website Analytics</h1>

      {overview && (
        <Row xs={1} md={4} className="g-3 mb-4">
          <Col>
            <MetricCard title="Page Views" value={overview.totalPageViews} icon="bi bi-eye" gradient />
          </Col>
          <Col>
            <MetricCard title="Clicks" value={overview.totalClicks} icon="bi bi-mouse-fill" gradient />
          </Col>
          <Col>
            <MetricCard title="Unique Visitors" value={overview.uniqueVisitors} icon="bi bi-people-fill" gradient />
          </Col>
          <Col>
            <MetricCard title="Bounce Rate" value={`${overview.bounceRate}%`} icon="bi bi-arrow-bar-left" gradient />
          </Col>
        </Row>
      )}

      <Card className="p-3 mb-4">
        <h5>Page Views Over Time</h5>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <Line type="monotone" dataKey="count" stroke="#667eea" strokeWidth={3} />
            <CartesianGrid stroke="#e0e0e0" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <h5>Recent Events</h5>
      {loadingEvents
        ? <p>Loading events...</p>
        : events.length === 0
          ? <p>No recent events logged.</p>
          : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Event Type</th>
                  <th>Page URL</th>
                  <th>Event Name</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event.id}>
                    <td>{new Date(event.createdAt).toLocaleString()}</td>
                    <td>{event.eventType}</td>
                    <td>{event.pageUrl || '-'}</td>
                    <td>{event.eventName || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )
      }

      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-outline-primary" disabled={page <= 0} onClick={() => handlePageChange(page - 1)}>Previous</button>
        <span>Page {page + 1} of {totalPages}</span>
        <button className="btn btn-outline-primary" disabled={page >= totalPages - 1} onClick={() => handlePageChange(page + 1)}>Next</button>
      </div>
    </Container>
  );
}
