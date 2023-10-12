const config = {
  protocol: "http",
  host: process.env.NODE_ENV === 'development' ? "localhost" : "abraaoan.com",
  port:"8186",
}

export default {
  url: `${config.protocol}://${config.host}:${config.port}/api`
}
