 #!/bin/bash

 ACTION='\033[1;90m'
 FINISHED='\033[1;96m'
 READY='\033[1;92m'
 NOCOLOR='\033[0m' # No Color
 ERROR='\033[0;31m'

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
   /usr/bin/killall screen
   /usr/bin/git pull
   /usr/bin/screen -d -m /usr/bin/bash -c "sleep 4; cd /home/oheim/Desktop/chatup && /usr/bin/git pull && /usr/local/bin/yarn deploy; sleep 4"
   /usr/bin/echo "running" > /home/oheim/Desktop/run.txt
   exit 0
 else
   echo -e ${FINISHED}Current branch is up to date with origin/master.${NOCOLOR}
 fi