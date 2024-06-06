const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const moviePackageDefinition = protoLoader.loadSync(path.join(__dirname, 'proto/movie.proto'), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const movieProto = grpc.loadPackageDefinition(moviePackageDefinition).movie;
const movieService = new movieProto.MovieService('localhost:50052', grpc.credentials.createInsecure());

const authPackageDefinition = protoLoader.loadSync(path.join(__dirname, 'proto/auth.proto'), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const authProto = grpc.loadPackageDefinition(authPackageDefinition).auth;
const authService = new authProto.AuthService('localhost:50052', grpc.credentials.createInsecure());

module.exports = {
  authService,
  movieService,
  metadata: new grpc.Metadata()
};
