// All things related to series handling
var $Series = {
	load_all: function() {
		// Retrieve all the time-series data from the server and put
		// their information up on the page
		$.ajax(data_uri + "series/",
			   { dataType: "json",
				 success: function(data, status, xhr) {
					 data.foreach(
						 function(elt, i, array) {
							 var new_line = $("#example-layout series-meta").clone();
							 new_line.data("series-data", elt);
							 new_line.setAttribute("id", "series-meta-" + elt.id);
							 new_line.has("name").innerHTML = elt.id;
							 new_line.has("epoch").innerHTML = elt.epoch;
							 $("#data-series-list").append(new_line);
						 });
				 },
				 error: function(xhr, status, err) {
					 $("#data-series-list").innerHTML = "<em>He's fallen in the water!</em>";
				 }
			   });
	}
};
