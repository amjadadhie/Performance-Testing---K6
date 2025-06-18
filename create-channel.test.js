import http from 'k6/http';
import { check, sleep } from 'k6';

// K6 Cloud-compatible test stages
export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Warm up
    { duration: '1m', target: 50 },    // Moderate load
    { duration: '1m', target: 100 },   // Peak load
    { duration: '2m', target: 100 },   // Sustain high load
    { duration: '30s', target: 0 },    // Cool down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'],  // 95% of requests < 500ms
    'checks{type:create_success}': ['rate>0.95'],
    'http_req_failed': ['rate<0.05'],
  },
  ext: {
    loadimpact: {
      name: 'Create Channel Load Test',
    },
  },
};

export default function () {
  const jar = http.cookieJar();

  // 1. Login
  const loginRes = http.post('https://pttalk.id/api/login', JSON.stringify({
    username: 'tes',
    password: 'tes',
  }), {
    headers: { 'Content-Type': 'application/json' },
    jar,
  });

  check(loginRes, {
    'login status 200': (r) => r.status === 200,
  });

  // 2. Buat nama channel unik
  const channelName = `cloudtest-${__VU}-${__ITER}`;
  const createRes = http.post('https://pttalk.id/api/channel/create', JSON.stringify({
    name: channelName,
    type: 'public',
  }), {
    headers: { 'Content-Type': 'application/json' },
    jar,
  });

  check(createRes, {
    'create status 201': (r) => r.status === 201,
    'create_success': (r) => r.json().message === 'Channel created',
  }, { type: 'create_success' });

  sleep(1);
}
