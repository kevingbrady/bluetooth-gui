#!/bin/bash

# Python installation
## Setup TShark
sudo apt install tshark
sudo adduser $USER wireshark

## Instal Python Dependencies
pip install -r ~/bluetooth-gui/python/requirements.txt

# Javascript Installation
## Install NodeJS
cd ~
curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh

## Install Yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update
sudo apt upgrade

#install .desktop file so application can be run from launcher
sudo desktop-file-install bluetooth-environment.desktop

#copy icon to /usr/share/pixmaps so it shows up in launcher
sudo cp app/pictures/bluetooth-custom-icon.png /usr/share/pixmaps

# Reboot so changes take effect
sudo reboot
