cd ..
wsl sudo sysctl -w vm.max_map_count=262144
docker start reviews-backend
exit
