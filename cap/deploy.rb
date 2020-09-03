lock '>=3.7.0'

set :application, 'outdoors-sports-map'
set :repo_url, 'git@github.com:digiaonline/outdoors-sports-map.git'
set :deploy_to, '/home/outdoors-sports-map/outdoors-sports-map'
set :branch, ENV["REVISION"] || ENV["BRANCH"] || "master"
set :log_level, :info
set :keep_releases, 5

namespace :ui do

	desc "Install dependencies"
	task :install do
		on roles(:ui) do
			within release_path do
				execute :yarn, "install"
			end
		end
	end

	desc "Build client"
	task :build do
		on roles(:ui) do
			within release_path do
				execute :npm, "run build"
			end
		end
	end

end

namespace :deploy do

  after :updated, "ui:install"
	after :updated, "ui:build"

end
