(function( $, undefined ){
	/*
	 *	
	 */
	$.Slider = function( options, element ) {
		this.$el = $( element );
		this._init( options );
	};
	
	$.Slider.defaults = {
		current: 0,
		bgIncrement: 50,
		autoplay: false,
		interval: 4000
	};
	
	$.Slider.prototype = {
		_init: function ( options ) {
			this.options = $.extend( true, {}, $.Slider.defaults, options );
			this.$slides = this.$el.children(".ex-slide");
			this.slidesCount = this.$slides.length;
			this.current = this.options.current;
			this.isOldBrowser = false;
			
			var regx = /MSIE (\d*)/ig;
			var m = regx.exec(navigator.appVersion);
			this.isOldBrowser = m != null && m[1] < 10;
			
			if ( this.current < 0 || this.current >= this.slidesCount ) {
				this.current = 0;
			}
			
			this.$slides.eq( this.current ).addClass( "ex-slide-current" );
			
			var $arrows = $( '<nav class="ex-arrows"></nav>' );
			$arrows.append( '<span class="ex-arrow-prev"></span>' );
			$arrows.append( '<span class="ex-arrow-next"></span>' );
			$arrows.appendTo( this.$el );
			
			var $nav = $( '<nav class="ex-dots"></nav>' );
			for( var i = 0; i < this.slidesCount; ++i ) {
				$nav.append( '<span></span>' );
			}
			$nav.appendTo( this.$el );
			
			this.$pages = this.$el.find( 'nav.ex-dots > span' );
			this.$navNext = this.$el.find( 'span.ex-arrow-next' );
			this.$navPrev = this.$el.find( 'span.ex-arrow-prev' );
			
			this.isAnimating = false;
			this.bgpositer = 0;
			
			this._updatePage();
			
			this._loadEvents();
			
			if ( this.options.autoplay ) {
				this._startSlideShow();
			}
		},
		_navigate: function ( page, dir ) {
			var $current = this.$slides.eq( this.current ), 
			    $next, 
				_self  = this;
			if ( this.current === page || this.isAnimating )
				return false;
			
			if ( this.isOldBrowser === false )
				this.isAnimating = true;
			
			var classTo, classFrom, d;
			if ( !dir ) {
				( page > this.current ) ? d = 'next' : d = 'prev';
			} else {
				d = dir;
			}
			
			if ( d === 'next' ) {
				classTo = 'ex-slide-toleft';
				classFrom = 'ex-slide-fromright';
				++this.bgpositer;
			} else {
				classTo = 'ex-slide-toright';
				classFrom = 'ex-slide-fromleft';
				--this.bgpositer;
			}
			this.$el.css( 'background-position', this.bgpositer * this.options.bgincrement + '% 0%' );
			
			this.current = page;
			
			$next = this.$slides.eq( this.current );
			
			var rmClasses = 'ex-slide-toleft ex-slide-toright ex-slide-fromleft ex-slide-fromright';
			$current.removeClass( rmClasses )
				.removeClass( 'ex-slide-current' )
				.addClass( classTo );
			$next.removeClass( rmClasses )
				.addClass( 'ex-slide-current' )
				.addClass( classFrom );
			
			this._updatePage();
		},
		_updatePage: function() {
			this.$pages.removeClass( 'ex-dots-current' );
			this.$pages.eq( this.current ).addClass( 'ex-dots-current' );
		},
		_startSlideShow: function() {
			var _self = this;
			this.slideshow = setTimeout(
				function() {
					var page = ( _self.current < _self.slidesCount - 1 ) ? _self.current + 1 : 0;
					_self._navigate( page, 'next' );
					
					if ( _self.options.autoplay ) {
						_self._startSlideShow();
					}
				},
				this.options.interval
			);
		},
		page: function( idx ) {
			if( idx >= this.slidesCount || idx < 0 ) {
				return false;
			}
			
			if( this.options.autoplay ) {
				clearTimeout( this.slideshow );
				this.options.autoplay	= false;
			}
			
			this._navigate( idx );
		},
		_loadEvents: function() {
			var _self = this;
			
			this.$pages.on( 'click.ex', function( event ) {
				_self.page( $(this).index() );
				return false;
			});
			
			this.$navNext.on( 'click.ex', function( event ) {
				if ( _self.options.autoplay ) {
					clearTimeout( _self.slideshow );
					_self.options.autoplay = false;
				}
				var page = ( _self.current < _self.slidesCount - 1 ) ? _self.current + 1 : 0;
				_self._navigate( page, 'next' );
				return false;
			});
			
			this.$navPrev.on( 'click.ex', function( event ) {
				if ( _self.options.autoplay ) {
					clearTimeout( _self.slideshow );
					_self.options.autoplay = false;
				}
				var page = ( _self.current > 0 ) ? _self.current - 1 : _self.slidesCount - 1;
				_self._navigate( page, 'prev' );
				return false;
			});
			
			this.$el.on( 'webkitTransitionEnd.cslider transitionend.cslider OTransitionEnd.cslider', function( event ) {
				if( event.target.id === _self.$el.attr( 'id' ) )
					_self.isAnimating	= false;
			});
			
			this.$el.on( 'webkitAnimationEnd.cslider animationend.cslider OAnimationEnd.cslider', function( event ) {
				if( event.originalEvent.animationName === 'toRightAni2' || event.originalEvent.animationName === 'toLeftAni2' ) {
					_self.isAnimating	= false;
				}	
			});
		}
	};
	
	$.fn.exslider = function( options ) {
		if ( typeof( options ) === 'string' ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			
			this.each( function() {
				var instance = $.data( this, 'exslider' );
				if ( !instance ) {
					console.error( "can't call methods on exslider to initialization: attempted to call method'" + options + "'" );
					return;
				}
				
				if ( !$.isFunction( instance[options] ) || options.charAt(0) === '_' ) {
					console.error( "no such method '" + options + "' for exslider instance" );
					return;
				}
				
				instance[options].apply( instance, args );
			});
		} else {
			var instance = $.data( this, 'exslider' );
			if ( !instance ) {
				$.data( this, 'exslider', new $.Slider( options, this ) );
			}
		}
		
		return this;
	};
})(jQuery);