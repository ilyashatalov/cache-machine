# cache-machine
FC coding challenge

## Getting started 
### Docker environment, production mode
#### Requirements:
* docker engine (https://docs.docker.com/engine/install/)
* docker-compose (https://docs.docker.com/compose/install/)

1) Clone repo
    ```
    git clone https://github.com/ilyashatalov/cache-machine.git && cd cache-machine 
    ```
2) To start an application you need only to run docker-compose:
    ```bash
    docker-compose up -d mongo app
    ```

There are 3 containers (app, mongodb, mongo-express). The application will work on 3000 port that are binded to host 80 port. If you need to make some configuration of the app (TTL time, max cache items) you can change it in docker-compose.yml. Default variables are:
```yml
RANDOM_STRING_LENGTH=14
CACHE_MAX_COUNT=5
KEY_TTL=3600
LOG_LEVEL=info
```

1) Try to curl our application (there will be one test item):
    ```bash
    curl localhost/keys
    ```
    Expected output:
    ```json
    [{"_id":"63b59dd0cf59a59e34a4b0f1","__v":0,"key":"Test1","updatedAt":"2023-01-04T15:40:00.825Z","value":"Value1"}]
    ```
2) Add one entry nd get HTTP status code:
    ```bash
    curl -w "\n%{http_code}\n" -X POST localhost/keys -d '{"key": "Key 100", "value": "Value 100"}' -H 'Content-Type: application/json'
    ```
    Expected output:
    ```json
    {"key":"Key 100","value":"Value 100","_id":"63bf616fb19f977385f6febb","updatedAt":"2023-01-12T01:25:03.228Z","__v":0}%
    201
    ```
3) Get unexisting Entry and get HTTP status code:
    ```
    curl -w "\n%{http_code}\n" localhost/keys/TestUnexist
    ```
    Expected output:
    ```json
    {"key":"TestUnexist","value":"oHFKMWxf75f1ZK","_id":"63bf6249b19f977385f6fed1","updatedAt":"2023-01-12T01:28:41.404Z","__v":0}
    201
    ```
4) Run the same command to get the existing Entry and check HTTP status code:
    ```
    curl -w "\n%{http_code}\n" localhost/keys/TestUnexist
    ```
    Expected output
    ```json
    {"_id":"63bf6249b19f977385f6fed1","key":"TestUnexist","value":"oHFKMWxf75f1ZK","updatedAt":"2023-01-12T01:28:41.404Z","__v":0}
    200
    ```
5) Delete one Entry
   ```bash
   curl -X DELETE -w "\n%{http_code}\n" localhost/keys/TestUnexist
   ```
   Expected output
    ```json
    {"_id":"63bf6249b19f977385f6fed1","key":"TestUnexist","value":"oHFKMWxf75f1ZK","updatedAt":"2023-01-12T01:28:41.404Z","__v":0}
    200
    ```
6) Delete all keys:
    ```bash
    curl -X DELETE -w "\n%{http_code}\n" localhost/keys
    ```
   Expected output
    ```json
    {"acknowledged":true,"deletedCount":1}
    200
    ```

### Development mode
#### Requirements
1) nodeJS 19.3.0
2) MongoDB 6.0 or Docker and docker-compose from the previous section

You need to configure the application to use your Mongo DB installation or you can use docker-compose included in this project.
1) Install docker and docker-compose:
     * docker engine (https://docs.docker.com/engine/install/)
     * docker compose (https://docs.docker.com/compose/install/)
  
2) Clone repo
    ```
    git clone https://github.com/ilyashatalov/cache-machine.git && cd cache-machine 
    ```
3) And start mongo and mongo express:
    ```bash
    docker-compose up -d mongo mongo-express
    ```
It will start MongoDB 6.0 on your machine and map 27017 port (default for MongoDB) from the container to your host and mongo express on port 8081


* Or use MongoDB installation guide: https://www.mongodb.com/docs/manual/installation/


1) Clone repo (if you skip it above)
    ```
    git clone https://github.com/ilyashatalov/cache-machine.git && cd cache-machine 
    ```
2) Locate to NodeJS APP
    ```bash
    cd cache-machine-server
    ```
3) Edit DATABASE_URL parameter of env file in root of the project  (and other if you need)
   If you use docker-compose from this project you can use a string like:
   ```
   DATABASE_URL = mongodb://fashiontest:Omio0raiOmio0rai@127.0.0.1/fcdb?authSource=admin
   ```
4) Rename it to .env
    ```bash
    mv env .env
    ```
5) Install all dependencies
   ```
   npm install
   ```
6) Run application
   ```bash
   npm run dev 
   ```
7) Test application with curls from the previous section with port `APP_PORT`
8) Or run tests
   1) Edit file package.json test line with your DB credentials (notice that it's better to use another mongo database here like in the example)
   ```bash
   vim package.json
   ```
   2) Run tests
    ```bash
    npm run test
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