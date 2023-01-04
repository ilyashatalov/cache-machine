# cache-machine
FC coding challenge

## Getting started (Docker environment)
### Requirements:
* docker engine (https://docs.docker.com/engine/install/)
* docker-compose (https://docs.docker.com/compose/install/)

To start application you need to run docker-compose in root application folder (outside of src):
```bash
docker-compose up -d
```
There are 3 containers (application, mongodb, mongo-express). Application will work on 3000 port that binded to host 80 port.
Try to curl our application (there will be one test item):
```bash
curl localhost/keys
```
Expected output:
```json
[{"_id":"63b59dd0cf59a59e34a4b0f1","__v":0,"key":"Test1","updatedAt":"2023-01-04T15:40:00.825Z","value":"Value1"}]
```
Add one entry:
```bash
curl -v -X POST localhost/keys -d '{"key": "Key 100", "value": "Value 100"}' -H 'Content-Type: application/json'
```
Expected output:
```json
{"key":"Key 100","value":"Value 100"}
```
Run tests:
```bash
docker exec -it cache-machine-fc-app-1 npm run test
```
Sample output:
```

> cache-machine@0.0.1 test
> cross-env DATABASE_URL=mongodb://fashiontest:Omio0raiOmio0rai@mongo/fcdb-test?authSource=admin LOG_LEVEL=debug NODE_ENV=test jest --runInBand --detectOpenHandles --forceExit --testTimeout=5000

{"level":"info","message":"Cache miss"}
{"level":"info","message":"Cache hit"}
{"level":"info","message":"Cache miss"}
 PASS  tests/api.test.js
  POST /keys
    ✓ should add some data to app (121 ms)
  GET /keys/<Entry.key>
    ✓ should create and return one entry (56 ms)
    ✓ will create new key with 201 (38 ms)
  GET /keys
    ✓ should return all entries (45 ms)
  DELETE /keys/<Entry.key>
    ✓ should delete one entry (41 ms)
  DELETE /keys
    ✓ should delete all entries (37 ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        0.948 s
Ran all test suites.
```

## Without docker 
All source code is available in src folder.
### Requirements
1) nodeJS 19.0.3
2) MongoDB 6.0

You need to configure application to use your Mongo DB installation.
1) Edit env file parameter DATABASE_URL (and other if you need)
2) Rename it to .env
    ```bash
    mv env .env
    ```
3) Run application
   ```bash
   npm start
   ```
4) Test application with curls from previous section but port 3000
5) Or run tests
   1) Edit file package.json test line with your DB (notice that it's better to use another mongo database here like in example)
   ```bash
   vim package.json
   ```
   2) Run tests
    ```bash
    npm run test
    ```