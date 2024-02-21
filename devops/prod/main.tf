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
  image      = "ubuntu-22-04-x64"
  name       = "bondage-academy-dev-1"
  region     = "fra1"
  size       = "s-1vcpu-512mb-10gb"
  monitoring = true
  ssh_keys   = [
    data.digitalocean_ssh_key.OpenTofu.id
  ]

  connection {
    host    = self.ipv4_address
    user    = "root"
    type    = "ssh"
    agent   = true
    timeout = "2m"
  }
  
  provisioner "remote-exec" {
    script = "./init-script.sh"
  }
}

resource "digitalocean_domain" "bondage-academy-dev-1-domain" {
  name = "bondage-academy.com"
}

resource "digitalocean_record" "bondage-academy-dev-1-domain-record" {
  domain = digitalocean_domain.bondage-academy-dev-1-domain.id
  type   = "A"
  name   = "@"
  value  = digitalocean_droplet.bondage-academy-dev-1.ipv4_address
  ttl    = 300
}

resource "digitalocean_firewall" "bondage-academy-firewall" {
  name = "bondage-academy-firewall"

  droplet_ids = [digitalocean_droplet.bondage-academy-dev-1.id]

  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "icmp"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "icmp"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}