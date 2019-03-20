#!/bin/bash

cd ~/Shared/AtomProjects/bluetooth-gui
yarn dev &
python3 python/run_capture.py &
wait -n
pkill -P $$
cd ~
