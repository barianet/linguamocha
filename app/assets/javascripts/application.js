// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require timepicker
//= require jquery_ujs
//= require jquery-custom	
//= require jquery_nested_form
//= require table


$(function() {

    
	$(document).on("focus","input#my_skill_tag", function() {
		$.ajax({
		    url: "/allskills",
	        dataType:'json',
	 		type: 'GET',
		    success: function(data){
				$("input#my_skill_tag").autocomplete({
					minLength: 2,
					source: function( request, response ) {
					    	var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
			            	response( $.grep( data, function( item ){
			                	return matcher.test( item );
			            	}) );
			        	}	
			    });
		    },
		    error: function(){
		        alert('error');
		    }
		});
	});
	
	$(document).on("focus","#interest_tag", function() {
		$.ajax({
		    url: "/allskills",
	        dataType:'json',
	 		type: 'GET',
		    success: function(data){
				$("#interest_tag").autocomplete({
					minLength: 2,
					source: function( request, response ) {
					    	var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
			            	response( $.grep( data, function( item ){
			                	return matcher.test( item );
			            	}) );
			        	}	
			    });
		    },
		    error: function(){
		        alert('error');
		    }
		});
	});
	
	
	var googleMapsCallback; // Required for Google Maps API to call back when it thinks it is done (vs. when jQuery finishes loading the script file).
	(function ($) {
	    var googleMapsLoaded = $.Deferred();
	    googleMapsCallback = function () {
	        googleMapsLoaded.resolve();
	    };
	    $.extend({
	        loadGoogleMaps: function () {
	            $.ajax({
	                url: "https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyAZO08sPxtMwOgkgrAVYdYbPqIm0FxQUwk&sensor=false",
	                dataType: "script"
	            }).fail(googleMapsLoaded.reject);
	            return googleMapsLoaded.promise();
	        }
	    });
	}(jQuery));
		
	
	$("a.find").on("click", function() {
		
		$.loadGoogleMaps().done(function () {
	        var geocoder = new google.maps.GeoCoder();

			geocoder.getLatLng({address: $("input#find").val()},
			    function(results_array, status) {
					alert(results_array);
				}
			);
		});

			var loc = [];
			var names = [];
			var ratings = [];
			var urls = [];
			var cities = [];

			$.ajax({
			    url: "/nearby",
		        dataType:'json',
				data: {'current_location': $("input#find").val()},
		 		type: 'GET',
			    success: function(data){
					$.each(data, function(key, value) {
						loc.push(value.address);
						names.push(value.name);
						cities.push(value.city + ", " + value.state + ", " + value.postal_code);
		        	});
	
					$('div.locations').html('');
					$.each(loc,function(i,o){
						// var c = String.fromCharCode(i + 65);
						// $('<p>' + c + '</p>').appendTo('div.locations');
						$('<input type="radio" name=location class="restaurant" value="' + o + "," + names[i] + '">' + names[i] +": " + '<br />').appendTo('div.locations');
						$('<p class="restaurant_address">' + o + '</p>').appendTo('div.locations');
						// $('<p class="rating">' + ratings[i] + ' reviews</p><br />').appendTo('div.locations');
					});
			    },
			    error: function(){
			        alert('error');
			    }
			});
		
					
					// $.loadGoogleMaps().done(function () {
						$.ajax({
					    url: "/mycoordinates",
				        dataType:'json',
						data: {'current_location': $("input#find").val()},
				 		type: 'GET',
					    success: function(data){
							var latitude = data.latitude;
							var longitude = data.longitude;
							var mapOptions = {
							    zoom: 13,
							    center: new google.maps.LatLng(latitude, longitude),
							    mapTypeId: google.maps.MapTypeId.ROADMAP
							}
							var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
						
							var doc = document.getElementById("map_canvas");
							doc.style.height = "300px";
							doc.style.width = "300px";
						
							var image = "<%= asset_path 'redmarker.png' %>";
						
						
							// var marker = new MarkerWithLabel({
							// 				   position: new google.maps.LatLng(latitude, longitude),
							// 				   map: map,
							// 				   icon: image,
							// 				   labelContent: "A",
							// 				   labelAnchor: new google.maps.Point(3, 30),
							// 				   labelClass: "labels", // the CSS class for the label
							// 				   labelInBackground: false
							// 				 });
						
							// marker.setMap(map);
						
							// var myLatlng = new google.maps.LatLng(latitude,longitude);
							// 
							// var marker = new google.maps.Marker({
							//     position: myLatlng
							// });
						
							// var label = new Label({
							//     map: map
							// 			    });
							// 
							// marker.setMap(map);
							// 
							// label.set('zIndex', 1234);
							// 	            label.bindTo('position', marker, 'position');
							// 	            label.set('text', "A");
					    },
					    error: function(){
					        alert('fail');
					    }
					});
				// });
		
	});
	
	
	$("input#deadline_date").datepicker({ minDate: +0 });
	$('input#request_start_time').timepicker({ 'step': 15 });
	$('input#request_end_time').timepicker({ 'step': 15 });

	$(function() {
	    $("#tabs").tabs();
	  });
	
	$(".fields").hover(
		function(){
			$('td.' + this.id).show();
		},
		function(){
			$('td.' + this.id).hide();
		}
	);

	$("a#skills").on("click", function() {
		$("form#new_my_skill").toggle("slow");
	});

	$("a#interests").on("click", function() {
		$("form#new_interest").toggle("slow");
	});

	// $('input#date_of_meeting').on("click", function(){
	// 	var days = $('td.day');
	// 	var length = days.length
	// 	var start_date = days[0].id;
	// 	var end_date = days[length-1].id;
	// 	$('input#date_of_meeting').datepicker({minDate: start_date, maxDate: end_date});
	// });

	// $('input#request_start_time').on("click", function(){
		
	// 	console.log()
	// });

		
});




