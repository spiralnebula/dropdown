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
		return {}
	},

	define_event : function ( define ) {
		return [
			{
				called       : "toggle_dropdown",
				that_happens : [
					{
						on : define.body,
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
				called       : "option_select",
				that_happens : [
					{
						on : define.body,
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
				for       : "option_select",
				that_does : function ( heard ) {
					var wrap, name, value
					wrap                                        = heard.event.target.parentElement
					name                                        = heard.event.target.getAttribute("data-dropdown-name")
					value                                       = heard.event.target.getAttribute("data-dropdown-value")
					wrap.style.display                          = "none"
					wrap.previousSibling.firstChild.textContent = value
					heard.state.option[name]                    = value
					return heard
				},
			},
			{
				for       : "toggle_dropdown",
				that_does : function ( heard ) {
					var dropdown_body
					dropdown_body  = ( 
						heard.event.target.getAttribute("data-dropdown") ? 
							heard.event.target : 
							heard.event.target.parentElement 
					)
					if ( dropdown_body.nextSibling.style.display === "none" ) { 
						dropdown_body.nextSibling.style.display = "block"
						dropdown_body.lastChild.textContent     = "+"
					} else { 
						dropdown_body.nextSibling.style.display = "none"
						dropdown_body.lastChild.textContent     = "-"
					}

					return heard
				}
			}
		]
	},

	define_body : function ( define ) {
		return { 
			"class" : define.class_name.main,
			child   : [
				{
					"class"         : define.class_name.option_selected_wrap,
					"data-dropdown" : "true",
					child           : [
						{
							"class" : define.class_name.option_selected,
							"text"  : define.option.default_option
						},
						{
							"class" : define.class_name.option_selector,
							"text"  : "-"
						},
					]
				},
				{
					"display"             : "none",
					"class"               : define.class_name.option_wrap,
					"child"               : this.library.morphism.index_loop({
						array   : define.option.choices,
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