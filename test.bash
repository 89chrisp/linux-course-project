#!/usr/bin/env bash

# Check to see if enviroment variables are defined and in that case use them
cond=$LINUX_PORT
if [[ $cond ]]; then
    port=$cond
else
    port=1337
fi

cond=$LINUX_SERVER
if [[ $cond ]]; then
    adr=$cond
else
    adr=127.0.0.1
fi

url=$adr:$port
# test cases
declare -a testRoutes=("$url/" "$url/room/list" "$url/room/view/id/J3135"
"$url/room/view/house/A-huset" "$url/room/search/grace" "$url/room/search/hopper"
"$url/room/search/grace%20hopper" "$url/room/search/monsunen" "$url/room/search/monsunenr"
"$url/room/search/rum?max=3" "$url/room/searchp/rum?max=3" "$url/room/search/56.183264?max=1"
"$url/room/searchp/56.183264?max=1" "$url/room/searchp/sälen" "$url/room/searchp/3D?max=5"
"$url/room/searchp/labb" "$url/room/searchp/Labb")

# function for verbose test
function vTest {
    for (( i = 0; i < ${#testRoutes[@]}; i++ )); do
        echo ${testRoutes[$i]}
        curl ${testRoutes[$i]}
    done

}

# function for non-verbose test
function Test {
    for (( i = 0; i < ${#testRoutes[@]}; i++ )); do
        echo ${testRoutes[$i]}
        curl -s -D - ${testRoutes[$i]} -o /dev/null
    done

}

# check input argument to se which test to run
if [[ "$1" == "--verbose" ]]; then
    vTest
else
    Test
fi
