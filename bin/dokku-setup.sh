#! /bin/bash

NAME=alan
APP=${NAME}; GIT_REMOTE=dokku

# Create app
dokku apps:create $APP
dokku domains:add $APP alan.care
dokku config:set $APP HOST_URL=alan.care

# Push certificate
#dokku certs:add $APP ~/cert/__champagne_ucsf_edu_cert.cer ~/cert/star.champagne.ucsf.edu.key

# Create db backend
dokku postgres:create ${NAME}_db
dokku postgres:link ${NAME}_db $APP

# Deploy app
git remote add $GIT_REMOTE dokku@alan.care:alan
git push $GIT_REMOTE master

# Re-deploy after rake task
dokku run $APP bundle exec rake db:migrate
# dokku ps:rebuild $APP # Doesn't work....
git push $GIT_REMOTE master

## Additional nice line:
# Reset passwords:
# User.all.map {|u| u.password=(0...8).map { (65 + rand(26)).chr }.join; u.save}
