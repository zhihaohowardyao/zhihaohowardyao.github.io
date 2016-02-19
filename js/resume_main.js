(function() {
  var app = angular.module('Aboutme', []);
  
	app.controller('TabController', function(){
		this.tab = 1;

		this.setTab = function(newValue){
		  this.tab = newValue;
		};

		this.isSet = function(tabName){
		  return this.tab === tabName;
		};
	  });
 })();
 
 $(document).ready(function(){
      //$('body').append('<div id="toTop" class="btn btn-success" data-toggle="tooltip" title="Back to top" data-placement="left"><span class="glyphicon glyphicon-chevron-up"></span></div>');
    	$(window).scroll(function () {
			if ($(this).scrollTop() != 0) {
				$('#ToTop').fadeIn();
			} else {
				$('#ToTop').fadeOut();
			}
		}); 
    $('#ToTop').click(function(){
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });
});

 $(document).ready(function(){
   if($('#cpu-badge').is(":visible")){
    $('[data-toggle="tooltip"]').tooltip();   
  }
	$('#cpu-title').click(function(){
	  $('#cpu-body').toggle();
	});
	$('#cpu-badge').click(function(){
	  $('#cpu-panel').toggle();
	});

	$('#p-title').click(function(){
	  $('#p-body').toggle();
	});
	$('#p-badge').click(function(){
	  $('#p-panel').toggle();
	});

	$('#sf-title').click(function(){
	  $('#sf-body').toggle();
	});
	$('#sf-badge').click(function(){
	  $('#sf-panel').toggle();
	});

	$('#sm-title').click(function(){
	  $('#sm-body').toggle();
	});
	$('#sm-badge').click(function(){
	  $('#sm-panel').toggle();
	});
	
	$('#mk-title').click(function(){
	  $('#mk-body').toggle();
	});
	$('#mk-badge').click(function(){
	  $('#mk-panel').toggle();
	});
	
	$('#en-title').click(function(){
	  $('#en-body').toggle();
	});
	$('#en-badge').click(function(){
	  $('#en-panel').toggle();
	});
	
	$('#ummc-title').click(function(){
	  $('#ummc-body').toggle();
	});
	$('#ummc-badge').click(function(){
	  $('#ummc-panel').toggle();
	});
	
	$('#nt-title').click(function(){
	  $('#nt-body').toggle();
	});
	$('#nt-badge').click(function(){
	  $('#nt-panel').toggle();
	});
	
	$(function() {
    $('.nav-controller').on('click', function(event) {
        $('nav').toggleClass('focus');
    });
    $('.nav-controller').on('mouseover', function(event) {
        $('nav').addClass('focus');
    }).on('click', function(event) {
        $('nav').removeClass('focus');
    })
   })
   
   $('#readme').animate({fontSize: '+=5px'}, 1500).animate({fontSize: '-=4px'}, 1500);
   
   $(".nav-controller").click(function(){
	   $('#readme').hide();
   });
   
   $("#titleAll").click(function(){
	   $(".timeline-body").toggle();
   });
   
   $("#iconAll").click(function(){
	   $(".timeline-panel").toggle();
   });
});