define({

	define : {
		allow   : "*",
		require : [
			"morph",
			"transistor",
			"event_master",
			"transit"
		],
	},

	make : function ( define ) {

		var event_circle, dropdown_body, option_name

		define.with.option.default_value = define.with.option.default_value || define.with.option.choice[0]
		dropdown_body                    = this.library.transistor.make(this.define_body({
			name   : "main",
			option : {
				default_value : define.with.option.default_value,
				choice        : define.with.option.choice,
				mark          : define.with.option.mark
			},
			class_name    : define.class_name
		}))

		event_circle                     = this.library.event_master.make({
			events : this.define_event({
				body : dropdown_body,
				with : define.with
			}),
			state  : this.define_state( define )
		})
		event_circle.add_listener(
			this.define_listener( define )
		)

		if ( define.with.option.choice.constructor === Object ) { 

			this.library.transit.to({
				url  : define.with.option.choice.url,
				do   : define.with.option.choice.do,
				flat : define.with.option.choice.flat,
				with : define.with.option.choice.with,
				when : {
					finished : function ( result ) {
						var choice
						choice = define.with.option.choice.when.finished.call( {}, result )
						event_circle.stage_event({
							called : "choice change",
							as     : function ( state ) {
								return { 
									state : {
										original_value : state.original_value,
										value          : state.value,
										choice         : choice
									},
									event : { 
										target : dropdown_body.body
									}
								}
							}
						})
					}
				}
			})
		}

		return this.define_interface({
			body         : dropdown_body,
			event_master : event_circle
		})
	},

	define_interface : function ( define ) { 
		return {
			body      : define.body.body,
			append    : define.body.append,
			get_state : function () { 
				return define.event_master.get_state()
			},
			reset     : function () {
				define.event_master.stage_event({
					called : "reset",
					as     : function ( state ) { 
						return { 
							event : { 
								target : define.body.body
							},
							state : state
						}
					}
				})
			},
		}
	},

	define_state : function ( define ) {
		var default_value = define.with.option.value || define.with.option.choice[0] || false
		return {
			original_value : default_value,
			value          : default_value,
			choice         : []
		}
	},

	define_event : function ( define ) {
		return [
			{
				called : "reset"
			},
			{ 
				called : "choice change"
			},
			{
				called       : "toggle dropdown",
				that_happens : [
					{
						on : define.body.body,
						is : [ "click" ]
					}
				],
				only_if      : function ( heard ) {
					return ( 
						heard.event.target.hasAttribute("data-dropdown") ||
						heard.event.target.parentElement.hasAttribute("data-dropdown")
					)
				}
			},
			{
				called       : "option select",
				that_happens : [
					{
						on : define.body.body,
						is : [ "click" ]
					}
				],
				only_if : function ( heard ) {
					return ( heard.event.target.getAttribute("data-dropdown-value") )
				}
			}
		]
	},

	define_listener : function ( define ) {

		var self = this
		return [
			{ 
				for       : "choice change",
				that_does : function ( heard ) {
					
					var text_container, content, body

					body              = heard.event.target
					text_container    = heard.event.target.firstChild.firstChild
					content           = self.library.transistor.make({
						"display" : "none",
						"class"   : define.class_name.option_wrap,
						"child"   : self.library.morph.index_loop({
							subject : heard.state.choice,
							else_do : function ( loop ) {
								return loop.into.concat( self.define_option({
									class_name : define.class_name,
									option     : loop.indexed
								}) )
							}
						})
					})
					text_container.textContent = heard.state.default_value || heard.state.choice[0]
					body.removeChild( body.children[1] )
					content.append( body )

					return heard
				}
			},
			{ 
				for       : "reset",
				that_does : function ( heard ) {

					var wrap_node, text_node, option_wrap_node, head_node, mark_node

					wrap_node                      = heard.event.target
					head_node                      = heard.event.target.firstChild
					text_node                      = head_node.firstChild
					option_wrap_node               = heard.event.target.lastChild
					mark_node                      = head_node.lastChild
					option_wrap_node.style.display = "none"
					text_node.textContent          = heard.state.original_value
					heard.state.value              = heard.state.original_value
					mark_node.textContent          = head_node.getAttribute("data-mark-closed")
					return heard
				}
			},
			{
				for       : "toggle dropdown",
				that_does : function ( heard ) {
					var dropdown_body
					dropdown_body  = ( 
						heard.event.target.getAttribute("data-dropdown") ? 
							heard.event.target : 
							heard.event.target.parentElement 
					)
					
					if ( dropdown_body.nextSibling.style.display === "none" ) { 
						dropdown_body.nextSibling.style.display = "block"
						dropdown_body.lastChild.textContent     = dropdown_body.getAttribute("data-mark-open")
					} else { 
						dropdown_body.nextSibling.style.display = "none"
						dropdown_body.lastChild.textContent     = dropdown_body.getAttribute("data-mark-closed")
					}

					return heard
				}
			},
			{
				for       : "option select",
				that_does : function ( heard ) {
					var wrap, name, value, text, notation, option, option_state
					option               = heard.event.target
					wrap                 = option.parentElement
					text                 = wrap.previousSibling.firstChild
					notation             = wrap.previousSibling.lastChild
					name                 = option.getAttribute("data-dropdown-name")
					value                = option.getAttribute("data-dropdown-value")
					option_state         = heard.state
					wrap.style.display   = "none"
					notation.textContent = wrap.previousSibling.getAttribute("data-mark-closed")
					text.textContent     = option.getAttribute("data-dropdown-text")
					option_state.value   = value
					return heard
				},
			}
		]
	},

	define_body : function ( define ) {

		var self, dropdown_content, selected_text

		self = this

		if ( define.option.choice.constructor === Object ) {
			selected_text    = "Loading..."
			dropdown_content = this.define_loading_option({ 
				class_name : define.class_name
			})
		}

		if ( define.option.choice.constructor === Array ) {
			selected_text    = define.option.value || define.option.choice[0]
			dropdown_content = this.library.morphism.index_loop({
				array   : define.option.choice,
				else_do : function ( loop ) {
					return loop.into.concat(self.define_option({
						class_name : define.class_name,
						name       : define.name,
						option     : loop.indexed
					}))
				}
			})
		}

		return { 
			"class" : define.class_name.main,
			"child" : [
				{
					"class"            : define.class_name.option_selected_wrap,
					"data-dropdown"    : "true",
					"data-mark-closed" : define.option.mark.closed,
					"data-mark-open"   : define.option.mark.open,
					"child"            : [
						{
							"class" : define.class_name.option_selected,
							"text"  : selected_text
						},
						{
							"class" : define.class_name.option_selector,
							"text"  : define.option.mark.closed
						},
					]
				},
				{
					"display" : "none",
					"class"   : define.class_name.option_wrap,
					"child"   : dropdown_content
				}
			]
		}
	},

	define_loading_option : function ( define ) { 
		return []
	},

	define_option : function ( define ) {

		var definition
		definition = {
			"class"               : define.class_name.option,
			"data-dropdown-name"  : define.name,
		}

		if ( define.option.value && define.option.text ) { 
			definition["data-dropdown-value"] = define.option.value,
			definition["data-dropdown-text"]  = define.option.text,
			definition["text"]                = define.option.text
		} else { 
			definition["data-dropdown-value"] = define.option,
			definition["data-dropdown-text"]  = define.option,
			definition["text"]                = define.option
		}

		return definition
	}
	
})

// could create a context finder that is fed a definiton and then finds what he needs based upon it
// accepts definition, 
// node that is meant to represent it, 
// what he needs to find, 
// returns the node needing to be found

// should also have a more concrete way of assigning events to certain thigns so that there are no conflicts
// in the case of using only if checkers. 
// perhaps a context assigner as opossed to the finder. 

// I think that the transistor.get method fixed this i forger these things 
// no could do something far funker by adding a method to the transistor as such
// transistor.find_by_path("3child:1child") or transistor.find_by_path("4Ancestor") funkey i know