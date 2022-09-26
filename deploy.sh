 #!/bin/bash

 ACTION='\033[1;90m'
 FINISHED='\033[1;96m'
 READY='\033[1;92m'
 NOCOLOR='\033[0m' # No Color
 ERROR='\033[0;31m'

deploy_chatup () {
   /usr/bin/killall screen
   /usr/bin/screen -d -m -S chatup /usr/bin/bash -c "cd /home/oheim/Desktop/chatup && /usr/bin/git pull && /usr/local/bin/yarn migrate-prod && /usr/local/bin/yarn deploy"
   /usr/bin/echo "--- DEPLOYED AT $(/usr/bin/date) ---" >> /home/oheim/Desktop/chatup/server/src/logging/logs.log
}

 echo
 echo -e ${ACTION}Checking Git repo
 echo -e =======================${NOCOLOR}
 BRANCH=$(/usr/bin/git rev-parse --abbrev-ref HEAD)
 if [ "$BRANCH" != "main" ]
 then
   echo -e ${ERROR}Not on main. Aborting. ${NOCOLOR}
   echo
   exit 0
 fi

git fetch
 HEADHASH=$(/usr/bin/git rev-parse HEAD)
 UPSTREAMHASH=$(/usr/bin/git rev-parse main@{upstream})

 if [ "$HEADHASH" != "$UPSTREAMHASH" ]
 then
   echo -e ${ERROR}Not up to date with origin.${NOCOLOR}
   echo
   deploy_chatup
   exit 0
 else
   if ! screen -list | grep -q "chatup"; then
     echo -e ${ERROR}Chatup down, reploying...${NOCOLOR}
     echo
     deploy_chatup
   fi
   echo -e ${FINISHED}Current branch is up to date with origin/master.${NOCOLOR}
 fi