import http from 'http';
import assert from 'assert';
import '../lib/index';
import db from '../lib/database';

const options = {
  hostname: '127.0.0.1',
  port: 5000,
  path: '/',
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
};

before((done) => {
  db.terms.remove({}, { multi: true }, () => {
    db.pi.remove({}, { multi: true }, () => {
      done();
    });
  });
});

describe('Simple Request Test', () => {
  it('Should return status code 200', (done) => {
    http.get({ ...options, path: '/terms', method: 'GET' }, (res) => {
      assert.equal(200, res.statusCode);
      done();
    });
  });
});

describe('Term and Pi Validation', () => {
  it('Term 0: Should return value 4', (done) => {
    http.get({ ...options, path: '/terms/0', method: 'GET' }, (res) => {
      res.on('data', (data) => {
        const result = JSON.parse(data);
        assert.equal(4, result.value);
        done();
      });
    });
  });

  it('Pi: Should return value 4', (done) => {
    http.get({ ...options, path: '/pi', method: 'GET' }, (res) => {
      res.on('data', (data) => {
        const result = JSON.parse(data);
        assert.equal(4, result.pi);
        done();
      });
    });
  });

  it('Term 1: Should return value (-4/3)', (done) => {
    http.get({ ...options, path: '/terms/1', method: 'GET' }, (res) => {
      res.on('data', (data) => {
        const result = JSON.parse(data);
        assert.equal((-4 / 3), result.value);
        done();
      });
    });
  });

  it('Pi: Should return value (4 + (-4 / 3))', (done) => {
    http.get({ ...options, path: '/pi', method: 'GET' }, (res) => {
      res.on('data', (data) => {
        const result = JSON.parse(data);
        assert.equal(4 + (-4 / 3), result.pi);
        done();
      });
    });
  });

  it('Term 10:Should return value (4/21)', (done) => {
    http.get({ ...options, path: '/terms/10', method: 'GET' }, (res) => {
      res.on('data', (data) => {
        const result = JSON.parse(data);
        assert.equal((4 / 21), result.value);
        done();
      });
    });
  });

  it('Pi: Should return value (4 + (-4 / 3) + (4 / 21))', (done) => {
    http.get({ ...options, path: '/pi', method: 'GET' }, (res) => {
      res.on('data', (data) => {
        const result = JSON.parse(data);
        assert.equal(4 + (-4 / 3) + (4 / 21), result.pi);
        done();
      });
    });
  });

  it('Term 25: Should return value (-4/51)', (done) => {
    http.get({ ...options, path: '/terms/25', method: 'GET' }, (res) => {
      res.on('data', (data) => {
        const result = JSON.parse(data);
        assert.equal((-4 / 51), result.value);
        done();
      });
    });
  });

  it('Pi: Should return value (4 + (-4 / 3) + (4 / 21) + (-4 / 51))', (done) => {
    http.get({ ...options, path: '/pi', method: 'GET' }, (res) => {
      res.on('data', (data) => {
        const result = JSON.parse(data);
        assert.equal(4 + (-4 / 3) + (4 / 21) + (-4 / 51), result.pi);
        done();
      });
    });
  });

  it('Concurrency: should only have 1 term', (done) => {
    for (let i = 0; i <= 10; i += 1) {
      http.get({ ...options, path: '/terms/50', method: 'GET' });
    }

    setTimeout(() => {
      http.get({ ...options, path: '/terms', method: 'GET' }, (res) => {
        res.on('data', (data) => {
          const result = JSON.parse(data);
          const terms = result.filter(term => (term.index === 50));
          assert.equal(1, terms.length);
          done();
        });
      });
    }, 500);
  });
});
