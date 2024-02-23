yarn build
rsync -avr ./build/* root@rps.sh:/rps-frontend-build
