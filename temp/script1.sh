PORT_1=$(echo $(echo $(sudo netstat -tulpn | grep '3000') | cut -d "/" -f 1) | cut -d " " -f 7)
echo ${PORT_1}
if [$PORT_1 -ne '']
then
sudo kill -9 ${PORT_1}
fi


PORT_2=$(echo $(echo $(sudo netstat -tulpn | grep '3001') | cut -d "/" -f 1) | cut -d " " -f 7)
echo ${PORT_2}
if [$PORT_2 -ne '']
then
sudo kill -9 ${PORT_2}
fi

# node index.js & node index2.js & node test.js