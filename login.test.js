import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // warm-up
    { duration: '1m', target: 50 },    // moderate load
    { duration: '1m', target: 100 },   // peak load
    { duration: '2m', target: 100 },   // sustained load
    { duration: '30s', target: 0 },    // ramp-down
  ],
  thresholds: {
    'checks{type:login_success}': ['rate>0.95'],
    'http_req_failed': ['rate<0.05'],
    'http_req_duration': ['p(95)<1000'], // 95% request harus < 1 detik
  },
  ext: {
    loadimpact: {
      name: 'Login Load Test',
    },
  },
};

export default function () {
  const payload = JSON.stringify({
    username: 'tes',
    password: 'tes',
  });

  const headers = { 'Content-Type': 'application/json' };

  const res = http.post('https://pttalk.id/api/login', payload, { headers });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'login success message': (r) => r.json().message === 'Login successful',
    'got sip config': (r) => r.json().sipConfig !== undefined,
  }, { type: 'login_success' });

  sleep(1);
}
