# Disable interactive mode for needrestart
# https://stackoverflow.com/questions/73397110/how-to-stop-ubuntu-pop-up-daemons-using-outdated-libraries-when-using-apt-to-i
sudo sed -i "s/#\$nrconf{restart} = 'i';/\$nrconf{restart} = 'a';/g" "/etc/needrestart/needrestart.conf"

# Install docker
sudo apt-get -y -o DPkg::Lock::Timeout=60 update
sudo apt-get -y -o DPkg::Lock::Timeout=60 install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get -y -o DPkg::Lock::Timeout=60 update
sudo apt-get -y -o DPkg::Lock::Timeout=60 install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
