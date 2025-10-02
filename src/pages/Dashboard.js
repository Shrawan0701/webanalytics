import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import api from '../utils/api';
import MetricCard from '../components/MetricCard';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../utils/AuthContext';

export default function Dashboard() {
  const { currentUser } = useAuth();

  const [websites, setWebsites] = useState([]);
  const [analyticsOverview, setAnalyticsOverview] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch websites on mount
  useEffect(() => {
    async function loadWebsites() {
      try {
        const response = await api.get('/websites');
        setWebsites(response.data);
        if (response.data.length > 0) {
          setSelectedWebsiteId(response.data[0].websiteId);
        }
      } catch {
        setError('Failed to load websites');
      } finally {
        setLoading(false);
      }
    }
    loadWebsites();
  }, []);

  // Fetch analytics overview and chart data when selectedWebsiteId changes
  useEffect(() => {
    if (!selectedWebsiteId) return;
    async function loadAnalytics() {
      setError(null);
      try {
        const overviewResponse = await api.get(`/analytics/${selectedWebsiteId}/overview`);
        setAnalyticsOverview(overviewResponse.data);
        const chartResponse = await api.get(`/analytics/${selectedWebsiteId}/chart-data`);
        setChartData(chartResponse.data);
      } catch {
        setError('Failed to load analytics data');
      }
    }
    loadAnalytics();
  }, [selectedWebsiteId]);

  // Handle website selection click
  const handleWebsiteSelect = (websiteId) => {
    setSelectedWebsiteId(websiteId);
  }

  if (loading) return <Container className="p-5 text-center">Loading...</Container>;
  if (error) return <Container className="p-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="dashboard-container">
      <h1 className="page-title mb-4">Dashboard</h1>
      <p>Welcome, <strong>{currentUser?.username}</strong>! Select a website to view analytics.</p>

      <Row className="mb-4 gx-4 gy-3">
        <Col md={4}>
          <h4>Your Websites</h4>
          {websites.length === 0 && <p>No websites added yet.</p>}
          {websites.map(ws => (
            <Card
              key={ws.websiteId}
              onClick={() => handleWebsiteSelect(ws.websiteId)}
              className={`mb-2 cursor-pointer ${selectedWebsiteId === ws.websiteId ? 'border-primary' : ''}`}
              style={{ cursor: 'pointer' }}
            >
              <Card.Body>
                <Card.Title>{ws.name}</Card.Title>
                <Card.Subtitle className="text-muted">{ws.domain}</Card.Subtitle>
              </Card.Body>
            </Card>
          ))}
        </Col>

        <Col md={8}>
          {!analyticsOverview ? (
            <p>Select a website to see analytics.</p>
          ) : (
            <>
              <Row xs={1} md={2} className="g-3 mb-4">
                <Col>
                  <MetricCard
                    title="Page Views"
                    value={analyticsOverview.totalPageViews}
                    icon="bi bi-eye"
                    gradient
                  />
                </Col>
                <Col>
                  <MetricCard
                    title="Clicks"
                    value={analyticsOverview.totalClicks}
                    icon="bi bi-mouse-fill"
                    gradient
                  />
                </Col>
                <Col>
                  <MetricCard
                    title="Unique Visitors"
                    value={analyticsOverview.uniqueVisitors}
                    icon="bi bi-people-fill"
                    gradient
                  />
                </Col>
                <Col>
                  <MetricCard
                    title="Bounce Rate"
                    value={`${analyticsOverview.bounceRate}%`}
                    icon="bi bi-arrow-bar-left"
                    gradient
                  />
                </Col>
              </Row>

              <h5 className="mb-3">Page Views Over Time</h5>
              <Card className="p-3 mb-4">
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
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}
