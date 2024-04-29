#!/bin/bash

port="3000"

#hostname=$HOSTNAME
hostname="localhost"

openssl s_client -connect ${hostname}:$port
