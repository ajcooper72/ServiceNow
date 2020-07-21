var ExportAttachmentToMID = Class.create();

ExportAttachmentToMID.prototype = {

	initialize: function() {
		// Set up the Packages references
		this.File = Packages.java.io.File;
		this.FileOutputStream = Packages.java.io.FileOutputStream;
		this.HttpClient = Packages.org.apache.commons.httpclient.HttpClient;
		this.UsernamePasswordCredentials = Packages.org.apache.commons.httpclient.UsernamePasswordCredentials;
		this.AuthScope = Packages.org.apache.commons.httpclient.auth.AuthScope;
		this.GetMethod = Packages.org.apache.commons.httpclient.methods.GetMethod;

		var mid_path = probe.getParameter("mid_path");

		//Set up the parameters
		this.http_domain_port = probe.getParameter("http_domain_port");
		this.http_protocol = probe.getParameter("http_protocol"); //http/https
		this.relative_url = probe.getParameter("relative_url");
		this.verbose = probe.getParameter("verbose");
		this.mid_path = probe.getParameter("mid_path");
		this.servlet_uri = probe.getParameter("servlet_uri");
		this.filename = mid_path + probe.getParameter("filename");

		this.rest_user = ms.getConfigParameter('mid.instance.username');
		this.rest_password = ms.getConfigParameter('mid.instance.password');
		
		// before we write the file, create the directory

		this.debug("Setting up folder: " + mid_path);
		var dir = new this.File(mid_path);
		dir.mkdirs();

	},

	execute: function() {
		try {
			var host = this.extractDomain(this.servlet_uri);
			var client = new this.HttpClient();
			var authScope = new this.AuthScope(host, this.http_domain_port, null);
			var credentials = new this.UsernamePasswordCredentials(this.rest_user, this.rest_password);

			client.getState().setCredentials(authScope, credentials);

			var url = this.servlet_uri + ":" + this.http_domain_port + "/" + this.relative_url;
			this.debug("Source URL: "+ url);

			var get_request = new this.GetMethod(url);
			get_request.setDoAuthentication(true);
			var status = client.executeMethod(get_request);
			this.debug("GET Status: " + status);

			if (status == "200") {
				//write the HTTP Response to a file
				this.debug("Attempted to save the file to filename: " + this.filename);
				var file = new this.File(this.filename);
				var input_stream = get_request.getResponseBodyAsStream();
				var output_stream = new this.FileOutputStream(file);
				var buf = Packages.java.lang.reflect.Array.newInstance(Packages.java.lang.Byte.TYPE, 1024);
				while ((len = input_stream.read(buf)) > 0) {
					//this.debug("Writing to the file…with buffer size of "+len);
					output_stream.write(buf, 0, len);
				}
				output_stream.close();
				input_stream.close();

				var result = "Created " + this.filename;
				this.debug(result);
				return result;
			} else {
				var response_result = "Invalid HTTP Response (" + status + ")";
				this.debug(response_result);
				return response_result;
			}
		} catch(e) {
			var exception_result = "Exception (" + e + ")";
			this.debug(exception_result);
			return response_result;
		}

	},

	extractDomain: function(url) {
		var domain;
		//find & remove protocol (http, ftp, etc.) and get domain
		if (url.indexOf("://") > -1) {
			domain = url.split('/')[2];
		} else {
			domain = url.split('/')[0];
		}

		//find & remove port number
		domain = domain.split(':')[0];
		this.debug("Domain: " + domain);
		return domain;
	},

	debug: function(m) {
		if (this.verbose == "true") {
			ms.log("[ExportAttachmentToMID] " + m);
		}
	},

	type: 'ExportAttachmentToMID'
};
