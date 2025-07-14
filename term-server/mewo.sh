#!/bin/bash

frames=(⠋ ⠙ ⠹ ⠸ ⠼ ⠴ ⠦ ⠧ ⠇ ⠏)
trap "clear; echo -e '\nbye then'; exit" SIGINT

i=0
while true; do
  frame="${frames[i % ${#frames[@]}]}"
  echo -ne "\r$frame 'ᵘˢᵉ ˢˡᵃˢʰ' "
  sleep 0.1
  ((i++))

  read -rsn1 -t 0.001 key
  if [[ $key == "/" ]]; then
    break
  fi
done

clear
echo -e "...\n"
sleep 0.5
node server.js