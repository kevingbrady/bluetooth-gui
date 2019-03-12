#!/bin/bash

source activate bluetooth

cd ~/Shared/AtomProjects/bluetooth-gui
yarn dev &
python3 ~/Shared/AtomProjects/bluetooth-gui/python/run_capture.py &
wait -n
pkill -P $$
cd ~
