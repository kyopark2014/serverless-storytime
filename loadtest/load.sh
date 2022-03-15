#!/bin/bash

TPS=$1
URL=$2

LOG=./result.log

function exit_trap() {
	  echo -e "\nHTTP CODE"
	    cut -f1 ${LOG} | sort | uniq -c | sort -nr

	      echo "RESPONSE TIME"
	        cut -f2 ${LOG} | awk '{ sum += $1 } END { print sum / NR}'
		  exit 0
	  }

	  trap exit_trap INT

	  for((i=0;;i++))
	  do
		    echo -en "\r$i sec"
		      for _ in `seq 1 $TPS`
			        do
					    curl -i https://8bxfftack4.execute-api.ap-northeast-2.amazonaws.com/dev/upload -X POST --data-binary '@sample1.jpeg' -H 'Content-Type: image/jpeg' -H 'Content-Disposition: form-data; name="sample1"; filename="sample1.jpeg"' -H 'X-duplication-check-required: false' | awk 1  >> ${LOG} &
					      done
					        sleep 1
					done
