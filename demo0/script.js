defaults = {
    'position': "right",        // right | inside | overlay
    'text': "",                 // Text to display next to the loader
    'class': "icon-refresh",    // loader CSS class
    'tpl': '<span class="isloading-wrapper %wrapper%">%text%<i class="%class% icon-spin"></i></span>',
    'disableSource': true,      // true | false
    'disableOthers': []
};
String.prototype.format = function () {
        var args = [].slice.call(arguments);
        return this.replace(/(\{\d+\})/g, function (a){
            return args[+(a.substr(1,a.length-2))||0];
        });
};
$(document).ready(function(){
	var targetURL = "https://jongchan.xyz:5001"
	var resp = null;
	$("#processButton").click(function(){
		var uploadURL = '{0}/processImage'.format(targetURL);
		var json_data = {ImageURL:$("#uploadedImage").attr('src')};
		$.ajax({
            url: uploadURL,
            dataType: "json",
			contentType:"application/json",
            data: JSON.stringify(json_data),
            type: 'POST',
			timeout: 20000,
			beforeSend: function(){
				$("#processButton").isLoading();
			},
			complete: function(){
				$("#processButton").isLoading("hide");
			},
            success: function(result){
				$("#resultImage").attr("src", "{0}{1}".format(targetURL, result.url));
				$("#resultImage").css("visibility","visible");
            },
			error: function(result){
				$("#resultImage").css("visibility","hidden");
			}
        });
	});
	$("#uploadButton").click(function(){
		//alert("uploadButton clicked.");
		var form = $('form')[0];
		var formData = new FormData();
		formData.append("file", $("input[name=uploadfile]")[0].files[0]);
		var uploadURL = '{0}/uploadfile'.format(targetURL);
		$.ajax({
                url: uploadURL,
                processData: false,
                contentType: false,
                data: formData,
                type: 'POST',
				timeout: 5000,
				beforeSend: function(){
					$("#uploadButton").isLoading();
				},
				complete: function(){
					$("#uploadButton").isLoading("hide");
				},
                success: function(result){
                    //alert("업로드 성공!!");
					$("#uploadedImage").attr("src", "{0}{1}".format(targetURL, result.url));
					resp = true;
                }
            });
	});
});
