import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '30s',
  thresholds: {
    'checks{type:join_success}': ['rate>0.95'],
  },
};

export default function () {
  const jar = http.cookieJar();

  // STEP 1: Login
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

  // OPTIONAL: verify with /api/me to make sure session works
  const meRes = http.get('https://pttalk.id/api/me', { jar });
  check(meRes, {
    'authorized /api/me': (r) => r.status === 200,
  });

  // STEP 2: Join channel
  const joinRes = http.post('https://pttalk.id/api/channel/join', JSON.stringify({
    name: 'Keren Channel',
  }), {
    headers: { 'Content-Type': 'application/json' },
    jar,
  });

  check(joinRes, {
    'join status 200': (r) => r.status === 200,
    'join_success': (r) => r.json().message === 'Joined channel successfully',
  }, { type: 'join_success' });

  sleep(1);
}
