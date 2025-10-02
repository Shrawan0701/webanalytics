

(function() {
  // Extract website ID from the query parameter
  var params = new URLSearchParams(window.location.search);
  var websiteId = params.get('website');

  if (!websiteId) {
    console.warn('No website ID specified in tracking script query parameters.');
    return;
  }

  // Helper function to send event data to the backend
  function sendEvent(eventType, additionalData) {
    var eventPayload = Object.assign({
      websiteId: websiteId,
      eventType: eventType,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    }, additionalData || {});

    fetch('https://websiteanalytics.onrender.com/track/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventPayload)
    })
    .then(response => response.json())
    .then(data => {
      // Optional: log success to console for dev/debugging
      console.log('Event tracked:', data);
    })
    .catch(error => {
      console.error('Tracking error:', error);
    });
  }

  // Track page view immediately
  sendEvent('page_view');

  // Track all clicks on the page
  document.addEventListener('click', function(e) {
    var target = e.target;
    sendEvent('click', {
      element: target.tagName,
      id: target.id || null,
      classes: target.className || null
    });
  });

  // Track unique visitor (uses sessionStorage so only tracks once per session)
  var uniqueVisitorKey = 'uniqueVisitor_' + websiteId;
  if (!sessionStorage.getItem(uniqueVisitorKey)) {
    sendEvent('unique_visitor');
    sessionStorage.setItem(uniqueVisitorKey, 'true');
  }

  // Bounce rate tracking: if user leaves page within 5 seconds, count as bounce
  var startTime = Date.now();
  window.addEventListener('beforeunload', function() {
    var duration = Date.now() - startTime;
    if (duration < 5000) {
      sendEvent('bounce', {duration: duration});
    }
  });
})();
