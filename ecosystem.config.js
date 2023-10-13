module.exports = {
  apps : [{
    name: "bd-server",
    script: 'index.js'
  }],
   
  // Deployment Configuration
  deploy : {
    production : {
       "user" : "abraaoan",
       "host" : ["159.203.173.16"],
       "ref"  : "origin/main",
       "repo" : "git@github.com:abraaoan/bemol-digital.git",
       "path" : "/var/www/api.abraaoan.com/public_html/bd",
       'post-setup': 'npm install',
       "post-deploy" : 'cd /var/www/api.abraaoan.com/public_html/bd/source/front-end; npm install; npm run build; \
                        cd /var/www/api.abraaoan.com/public_html/bd/source; npm install;\
                        NODE_ENV=production pm2 startOrRestart ecosystem.config.js --env production;',
    }
  }
};
