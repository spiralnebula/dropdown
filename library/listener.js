(function ( window, module ) {

	if ( window.define && window.define.amd ) {
		define(module)
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
						body = self.library.bodymap.make({
							body : heard.state.body.node,
							map  : heard.state.body.map
						})
						
						content = self.library.transistor.make({
							"display" : "none",
							"class"   : define.class_name.option_wrap,
							"child"   : self.library.morph.index_loop({
								subject : heard.state.choice,
								else_do : function ( loop ) {
									return loop.into.concat( self.library.body.define_option({
										class_name : define.class_name,
										option     : loop.indexed
									}) )
								}
							})
						})
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

						var body, dropdown_body
						body = self.library.bodymap.make({
							body : heard.state.body.node,
							map  : heard.state.body.map
						})
						
						if ( body.option_wrap.style.display === "none" ) { 
							body.option_wrap.style.display = "block"
							body.mark.textContent          = heard.state.mark.open
						} else { 
							body.option_wrap.style.display = "none"
							body.mark.textContent          = heard.state.mark.closed
						}

						return heard
					}
				},
				{
					for       : "option select",
					that_does : function ( heard ) {

						var body, name, value, option, option_state

						body = self.library.bodymap.make({
							body : heard.state.body.node,
							map  : heard.state.body.map
						})

						option_state                   = heard.state
						option                         = heard.event.target
						name                           = option.getAttribute("data-dropdown-name")
						value                          = option.getAttribute("data-dropdown-value")
						body.option_wrap.style.display = "none"
						body.mark.textContent          = heard.state.mark.closed
						body.text.textContent          = option.getAttribute("data-dropdown-text")
						option_state.value             = value

						return heard
					},
				}
			]
		},
	}
)