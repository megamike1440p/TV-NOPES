module.exports = {
    cookieSecret: 'cookie',
    mongo: {
      development: {
        connectionString: 'mongodb+srv://admin:admin@tvnopesdb.cxxsyyk.mongodb.net/?retryWrites=true&w=majority' // Defaults to localhost, change if using Mongodb Atlas
      },
      production: {
        connectionString: 'mongodb+srv://admin:admin@tvnopesdb.cxxsyyk.mongodb.net/?retryWrites=true&w=majority'
      },
    }
  };