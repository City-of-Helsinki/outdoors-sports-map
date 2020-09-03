server 'ulkoliikunta.fi', user: 'outdoors-sports-map', roles: %w{ui}, name: "outdoors-sports-map-production"

set :ssh_options, {
  keys: %w(cap/keys/outdoors-sports-map),
  forward_agent: true,
  auth_methods: %w(publickey)
}
