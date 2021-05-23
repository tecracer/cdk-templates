yum update 
yum install -y httpd
systemctl start httpd
systemctl enable httpd
echo "<h1>Styled Production Page</h1> <p> lorem ipos</p>" > /var/www/html/index.html