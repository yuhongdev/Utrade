FROM tomcat:9.0.76-jre8

ENV TZ=Asia/Kuala_Lumpur

# Remove default apps
RUN rm -rf /usr/local/tomcat/webapps/*

# Copy configurations
COPY conf/ /usr/local/tomcat/conf/

# Copy libraries
COPY lib/ /usr/local/tomcat/lib/

# Deploy applications
COPY gcUTRADEPlus/ /usr/local/tomcat/webapps/gcUTRADEPlus

EXPOSE 8080

CMD ["catalina.sh", "run"]