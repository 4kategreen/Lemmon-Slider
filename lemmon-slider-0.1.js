/*
 * Lemmon Slider - jQuery Plugin
 * Simple and lightweight slider/carousel supporting variable elements/images widths.
 *
 * Examples and documentation at: http://jquery.lemmonjuice.com/plugins/slider
 *
 * Copyright (c) 2011 Jakub Pelák <jpelak@gmail.com>
 *
 * Version: 0.1 (5/8/2011)
 * Requires: jQuery v1.4+
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
(function( $ ){

	var _css = {};

	var methods = {
		//
		// Initialzie plugin
		//
		init : function( options ){
			
			var options = $.extend( {}, $.fn.lemmonSlider.defaults, options );
			
			return this.each(function(){
				
				var $slider = $( this );
				var $sliderContainer = $slider.find( options.slider );
				var $sliderControls = $slider.next().filter( '.controls' );
				var $items = $sliderContainer.find( '> *' );
				var originalWidth = 1;
				$slider.options = options;
				$items.each(function(){ originalWidth += $( this ).outerWidth( true ) });
				$sliderContainer.width( originalWidth );
				
				// slide to last item
				if ( options.slideToLast ) $sliderContainer.css( 'padding-right', $slider.width() );
				
				$slider.bind( 'nextSlide', function( e, t ){
					
					var scroll = $slider.scrollLeft();
					var x = 0;
					var slide = 0;
					
					$items.each(function( i ){
						if ( x == 0 && $( this ).position().left > 1 ){
							x = $( this ).position().left;
							slide = i;
						}
					});
					
					if ( x > 0 && $sliderContainer.outerWidth() - scroll - $slider.width() > 0 ){
						slideTo( e, $slider, scroll+x, slide, 'fast' )
					} else if ( options.loop ){
						// return to first
						slideTo( e, $slider, 0, 0, 'slow' );
					}
					
				});
				$slider.bind( 'prevSlide', function( e, t ){
					
					var scroll = $slider.scrollLeft();
					var x = 0;
					var slide = 0;
					
					$items.each(function( i ){
						if ( $( this ).position().left < 0 ){
							x = $( this ).position().left;
							slide = i;
						}
					});
					
					if ( x ){
						slideTo( e, $slider, scroll+x, slide, 'fast' )
					} else if ( options.loop ){
						// return to last
						var a = $sliderContainer.outerWidth() - $slider.width();
						var b = $items.filter( ':last' ).position().left;
						slide = $items.size() - 1;
						if ( a > b ){
							//$slider.animate({ 'scrollLeft' : b }, 'slow' );
							slideTo( e, $slider, b, slide, 'fast' );
						} else {
							//$slider.animate({ 'scrollLeft' : a }, 'slow' );
							slideTo( e, $slider, a, slide, 'fast' );
						}
					}

				});
				$slider.bind( 'nextPage', function(){
				
					var scroll = $slider.scrollLeft();
					var w = $slider.width();
					var x = 0;
					
					$items.each(function( i ){
						if ( $( this ).position().left < w ) x = $( this ).position().left;
					});
					
					if ( x > 0 && scroll + w < originalWidth ){
						$slider.animate({ 'scrollLeft' : scroll + x }, 'slow' );
					} else if ( options.loop ){
						// return to first
						$slider.animate({ 'scrollLeft' : 0 }, 'slow' );
					}
					
				});
				$slider.bind( 'prevPage', function(){
				
					var scroll = $slider.scrollLeft();
					var w = $slider.width();
					var x = 0;
					
					$items.each(function( i ){
						if ( $( this ).position().left < 1 - w ) x = $( this ).next().position().left;
					});
					
					if ( scroll ){
						if ( x == 0 ){
							$slider.animate({ 'scrollLeft' : 0 }, 'slow' );
						} else {
							$slider.animate({ 'scrollLeft' : scroll + x }, 'slow' );
						}
					} else if ( options.loop ) {
						// return to last
						var a = $sliderContainer.outerWidth() - $slider.width();
						var b = $items.filter( ':last' ).position().left;
						if ( a > b ){
							$slider.animate({ 'scrollLeft' : b }, 'slow' );
						} else {
							$slider.animate({ 'scrollLeft' : a }, 'slow' );
						}
					}
					
				});
				$slider.bind( 'slideTo', function( e, i, t ){
				
					slideTo(
						e, $slider,
						$slider.scrollLeft() + $items.filter( ':eq(' + i +')' ).position().left,
						i, t );
					
				});

				$sliderControls.find( '.next-slide' ).click(function(){
					$slider.trigger( 'nextSlide' );
					return false;
				});
				$sliderControls.find( '.prev-slide' ).click(function(){
					$slider.trigger( 'prevSlide' );
					return false;
				});
				$sliderControls.find( '.next-page' ).click(function(){
					$slider.trigger( 'nextPage' );
					return false;
				});
				$sliderControls.find( '.prev-page' ).click(function(){
					$slider.trigger( 'prevPage' );
					return false;
				});

				if ( typeof $slider.options.create == 'function' ) $slider.options.create();
				
			});
			
		},
		//
		//
		//
	}
	//
	// Private functions
	//
	function slideTo( e, $slider, x, i, t ){
		
		if ( typeof t == 'undefined' ) {
			var time = 'fast';
			$slider.animate({ 'scrollLeft' : x }, time );
		} else if ( t ){
			var time = t;
			$slider.animate({ 'scrollLeft' : x }, time );
		} else {
			var time = 0;
			$slider.scrollLeft( x );
		}
		
		if ( typeof $slider.options.slide == 'function' ) $slider.options.slide( e, i, time );
		
	}
	//
	// Debug
	//
	function debug( text ){
		$( '#debug span' ).text( text );
	}
	//
	//
	//
	$.fn.lemmonSlider = function( method ){  

		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || !method ){
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.lemmonSlider' );
		}

	};
	//
	//
	//
	$.fn.lemmonSlider.defaults = {
		
		'items'        : '> *',
		'loop'         : true,
		'slideToLast' : false,
		'slider'       : '> *:first'
		
	}

})( jQuery );
