import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 75 },
    { duration: '1m', target: 100 },
    { duration: '1m', target: 150 },
    { duration: '1m', target: 200 },
    { duration: '1m', target: 225 },
    { duration: '1m', target: 250 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    'checks{type:available_success}': ['rate>0.95'],
    'http_req_failed': ['rate<0.05'],
  },
  ext: {
    loadimpact: {
      name: 'Get Available Channels Load Test',
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

  // 2. Fetch available channel
  const res = http.get('https://pttalk.id/api/channel/available', {
    headers: { 'Content-Type': 'application/json' },
    jar,
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response is array': (r) => {
      try {
        const data = r.json();
        return Array.isArray(data);
      } catch (_) {
        return false;
      }
    },
  }, { type: 'available_success' });

  sleep(1);
}
