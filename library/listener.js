(function ( window, module ) {

	if ( window.define && window.define.amd ) {
		window.define(module)
	} else { 

		var current_scripts, this_script, module_name

		current_scripts     = document.getElementsByTagName("script")
		this_script         = current_scripts[current_scripts.length-1]
		module_name         = this_script.getAttribute("data-module-name") || "listener"
		window[module_name] = module
	}
})( 
	window,
	{
		define : {
			allow   : "*",
			require : [
				"body",
				"morph",
				"bodymap",
				"transistor",
			],
		},

		define_listener : function ( define ) {

			var self = this
			
			return [
				{ 
					for       : "reset",
					that_does : function ( heard ) {

						var body
						body = self.library.bodymap.make({
							body : heard.state.body.node,
							map  : heard.state.body.map
						})

						body.option_wrap.style.display = "none"
						body.text.textContent          = heard.state.original_value
						body.mark.textContent          = heard.state.mark.closed
						heard.state.value              = heard.state.original_value
						return heard
					}
				},
				{ 
					for       : "choice change",
					that_does : function ( heard ) {
						
						var content, body
						body                    = self.library.bodymap.make({
							body : heard.state.body.node,
							map  : heard.state.body.map
						})

						content = self.library.transistor.make(
							self.library.body.define_option_box({
								class_name : define.class_name,
								with       : {
									option     : {
										choice : heard.state.choice,
										style  : heard.state.option_style
									}
								},
							})
						)

						heard.state.original_value = heard.state.choice[0]
						heard.state.value          = heard.state.choice[0]
						body.text.textContent      = heard.state.default_value || heard.state.choice[0]

						body.dropdown.removeChild( body.dropdown.children[1] )
						content.append( body.dropdown )
						
						return heard
					}
				},
				{
					for       : "toggle dropdown",
					that_does : function ( heard ) {

						var body
						body = self.library.bodymap.make({
							body : heard.state.body.node,
							map  : heard.state.body.map
						})

						self.open_or_close_option_box({
							body               : body,
							state              : heard.state,
							open               : ( body.option_wrap.style.display === "none" ),
							match_parent_width : ( body.option_wrap.style.position === "absolute" )
						})

						return heard
					}
				},
				{
					for       : "option select",
					that_does : function ( heard ) {

						var body

						body = self.library.bodymap.make({
							body : heard.state.body.node,
							map  : heard.state.body.map
						})

						self.open_or_close_option_box({
							body  : body,
							state : heard.state,
							open  : false
						})

						body.text.textContent = heard.event.target.getAttribute("data-dropdown-text")
						heard.state.value     = heard.event.target.getAttribute("data-dropdown-value")

						return heard
					},
				}
			]
		},

		open_or_close_option_box : function ( given ) {

			if ( given.open ) {

				given.body.mark.textContent = given.state.mark.open
				given.body.option_wrap.style.setProperty("display", "block")

			} else {

				given.body.mark.textContent = given.state.mark.closed
				given.body.option_wrap.style.setProperty("display", "none")
			}

			if ( given.match_parent_width ) {

				var head_style = window.getComputedStyle( given.body.head )

				given.body.option_wrap.style.setProperty("margin-top", head_style.height )
				given.body.option_wrap.style.setProperty("width", head_style.width )
			}
		}
	}
)