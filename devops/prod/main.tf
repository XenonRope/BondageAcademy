terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

# Set the variable value in *.tfvars file
# or using -var="do_token=..." CLI option
variable "do_token" {
  sensitive = true
}

provider "digitalocean" {
  token = var.do_token
}

data "digitalocean_ssh_key" "OpenTofu" {
  name = "OpenTofu"
}

resource "digitalocean_droplet" "bondage-academy-dev-1" {
  image = "ubuntu-22-04-x64"
  name = "bondage-academy-dev-1"
  region = "fra1"
  size = "s-1vcpu-2gb"
  monitoring = true
  ssh_keys = [
    data.digitalocean_ssh_key.OpenTofu.id
  ]

  connection {
    host = self.ipv4_address
    user = "root"
    type = "ssh"
    agent = true
    timeout = "2m"
  }
  
  provisioner "remote-exec" {
    script = "./init-script.sh"
  }
}