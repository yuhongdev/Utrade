FROM tomcat:9.0.76-jre8

ENV TZ=Asia/Kuala_Lumpur
ENV CATALINA_OPTS="-Xms512m -Xmx2048m"

# Remove default apps
RUN rm -rf /usr/local/tomcat/webapps/*

# Create symlink for legacy paths
RUN mkdir -p /usr/share/tomcat && ln -s /usr/local/tomcat/webapps /usr/share/tomcat/webapps

# Copy configurations
COPY docker/conf/ /usr/local/tomcat/conf/

# Copy libraries
COPY docker/lib/ /usr/local/tomcat/lib/

# Deploy applications
COPY docker/gcUTRADEPlus /usr/local/tomcat/webapps/gcUTRADEPlus
COPY PROD/gcUTRADE /usr/local/tomcat/webapps/gcUTRADE

EXPOSE 8080

CMD ["catalina.sh", "run"]