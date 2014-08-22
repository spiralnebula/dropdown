define({

	define : {
		allow   : "*",
		require : [
			"morphism",
			"transistor",
			"event_master",
		],
	},

	make : function ( define ) {
		var event_circle, body, option_name,
		default_value = define.option.default_value || define.option.choice[0]
		body          = this.library.transistor.make(this.define_body({
			name   : "main",
			option : {
				default_value : default_value,
				choice        : define.option.choice,
				mark          : define.option.mark
			},
			class_name    : define.class_name
		}))
		event_circle = this.library.event_master.make({
			events : this.define_event({
				body : body.body
			}),
			state  : {
				option : {
					"main" : default_value
				}
			},
		})
		event_circle.add_listener(this.define_listener({
			default_value : default_value,
			choice        : define.option.choice,
			mark          : define.option.mark
		}))
		body.append( define.append_to )
		return {}
	},

	define_state : function ( define ) {
		return { 
			value : define.with.option.value || define.with.option.choice[0]
		}
	},

	define_event : function ( define ) {
		return [
			{
				called       : "toggle dropdown",
				that_happens : [
					{
						on : define.with.body,
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
						on : define.with.body,
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
		return [
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
					option_state         = heard.state.option[name]
					wrap.style.display   = "none"
					notation.textContent = wrap.previousSibling.getAttribute("data-mark-closed")
					text.textContent     = value
					option_state.value   = value
					return heard
				},
			}
		]
	},

	define_body : function ( define ) {
		return { 
			"class" : define.class_name.main,
			child   : [
				{
					"class"            : define.class_name.option_selected_wrap,
					"data-dropdown"    : "true",
					"data-mark-closed" : define.with.option.mark.closed,
					"data-mark-open"   : define.with.option.mark.open,
					child              : [
						{
							"class" : define.class_name.option_selected,
							"text"  : define.with.option.default_value
						},
						{
							"class"            : define.class_name.option_selector,
							"text"             : define.with.option.mark.closed
						},
					]
				},
				{
					"display"             : "none",
					"class"               : define.class_name.option_wrap,
					"child"               : this.library.morphism.index_loop({
						array   : define.with.option.choice,
						else_do : function ( loop ) {
							return loop.into.concat({
								"class"               : define.class_name.option,
								"data-dropdown-name"  : define.name,
								"data-dropdown-value" : loop.indexed,
								"text"                : loop.indexed
							})
						}
					})
				}
			]
		}
	}
	
})
// could create a context finder that is fed a definiton and then finds what he needs based upon it
// accepts definition, 
// node that is meant to represent it, 
// what he needs to find, 
// returns the node needing to be found

// should also have a more concrete way of assignign events to certain thigns so that hter eare no conflicts
// in the case of using only if checkers. 
// perhaps a context assigner as opsoded to the finder. 