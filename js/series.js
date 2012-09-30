// All things related to series handling
var $Series = new function() {
	// Private functions
	function lpad(str, ch, size) {
		// This is moderately insane for large values of size
		str = str + "";
		while(str.length < size)
			str = ch + str;
		return str;
	}

	function iso8601_date(when) {
		var rv = lpad(when.getFullYear(), "0", 4)
			+ "-" + lpad(when.getMonth()+1, "0", 2)
			+ "-" + lpad(when.getDate(), "0", 2)
			+ "T" + lpad(when.getHours(), "0", 2)
			+ ":" + lpad(when.getMinutes(), "0", 2)
			+ ":" + lpad(when.getSeconds(), "0", 2)
			+ "." + lpad(when.getMilliseconds(), "0", 3);
		var tz = -when.getTimezoneOffset();
		if(tz >= 0) rv += "%2b"; // "+" (which maps to a space in URL
								 // encoding, if used as a literal)
		else rv += "-";
		rv += lpad(Math.floor(Math.abs(tz) / 60), "0", 2);
		rv += lpad(Math.abs(tz) % 60, "0", 2);

		return rv;
	}

	function retrieve_thumbnail(ser, dom) {
		var now = new Date();
		var one_week = new Date(now - 7 * 24 * 60 * 60 * 1000);

		$.ajax(
			data_uri + "series/" + ser.id + "/data/?startDate=" + iso8601_date(one_week),
			{ dataType: "json",
			  success: function(data, status, xhr) {
				  var graph = dom.find(".thumbnail");
				  var data = [[0,0], [1, 2], [2, 1]]; // Data for a single series
				  var options = { };
				  var plot = $.plot(graph, [data]);
			  },
			  error: function(xhr, status, err) { dom.text("<em>Ouch!</em>"); }
			});
	}

	// Public functions
	return {
		load_all: function() {
			// Retrieve all the time-series data from the server and put
			// their information up on the page
			$.ajax(
				data_uri + "series/",
				{ dataType: "json",
				  success: function(data, status, xhr) {
					  $.each(
						  data,
						  function(i, ser) {
							  var new_line = $("#example-layout .series-meta").clone();
							  new_line.data("series-data", ser);
							  new_line.attr("id", "series-meta-" + ser.id);
							  new_line.find(".name").text(ser.name);
							  new_line.find(".epoch").text(ser.epoch);
							  new_line.find(".description").text(ser.description);
							  new_line.find(".unit-text").text(ser.units);

							  $("#data-series-list").append(new_line);
							  retrieve_thumbnail(ser, new_line);
						  });
				  },
				  error: function(xhr, status, err) {
					  $("#data-series-list").html("<em>He's fallen in the water!</em>");
				  }
				});
		}
	};
};
