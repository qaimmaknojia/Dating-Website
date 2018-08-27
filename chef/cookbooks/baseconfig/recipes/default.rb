# Make sure the Apt package lists are up to date, so we're downloading versions that exist.
cookbook_file "apt-sources.list" do
  path "/etc/apt/sources.list"
end
execute 'apt_update' do
  command 'apt-get update'
end
#package python setuptools
execute 'apt-get-pillow-dependencies' do
  command 'apt-get -y install libtiff5-dev libjpeg8-dev zlib1g-dev libfreetype6-dev liblcms2-dev libwebp-dev tcl8.6-dev tk8.6-dev python-tk'
end

# Base configuration recipe in Chef.
package "wget"
package "ntp"
cookbook_file "ntp.conf" do
  path "/etc/ntp.conf"
end
execute 'ntp_restart' do
  command 'service ntp restart'
end

package "ack-grep"


#nginx
package "nginx"
cookbook_file "nginx-default" do
	path "/etc/nginx/sites-available/default"
end
service "nginx" do
	action :restart
end
# packages for postgres and python
package "postgresql"
package "postgresql-server-dev-all"
package "libpython-dev"
package 'python-pip'
execute 'pip install' do
  command 'pip install django psycopg2 uwsgi djangorestframework markdown django-filter pillow pytz'
end

#creating database
execute 'postgresql_user' do
	command 'echo "CREATE DATABASE mydb; CREATE USER vagrant; GRANT ALL PRIVILEGES ON DATABASE mydb TO vagrant;" | sudo -u postgres psql'
end
#migrate command
execute 'migrate' do
   user 'vagrant'
   cwd '/home/vagrant/project'
   command 'python ./manage.py migrate'
 end

#fixture to load surveys.json 
execute 'collectstatic' do
  user 'vagrant'
  cwd '/home/vagrant/project'
  command 'python ./manage.py loaddata Fixtures/surveys_users_answers.json'
end

#collecting static files
execute 'collectstatic' do
  user 'vagrant'
  cwd '/home/vagrant/project'
  command 'python ./manage.py collectstatic --noinput'
end


#uwsgi setup
execute 'sleep' do
	command 'sleep 10'
end
execute 'wsgi config' do
	command '/usr/local/bin/uwsgi --ini /home/vagrant/project/uwsgi.ini --daemonize /var/log/FinalProject.log'
end

