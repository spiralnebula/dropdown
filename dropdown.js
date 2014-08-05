define({

	define : {
		allow   : "*",
		require : [
			"morphism",
			"node_maker",
			"event_master",
		],
	},

	make : function ( define ) { 
		
		var body, event_circle

		body         = this.library.node_maker.make_node( this.define_body( define ) )
		event_circle = this.library.event_master.make({
			state  : {
				body   : { 
					selected : body.node.firstChild,
					choice   : body.node.children[1]
				},
				open   : false,
				chosen : { 
					value : ""
				}
			},
			events : [
				{
					called       : "toggle_dropdown",
					that_happens : [
						{
							on : body.node.firstChild,
							is : [ "click" ]
						}
					],
					only_if      : function ( heard ) { 
						return true
					}
				},
				{
					called       : "option_select",
					that_happens : [
						{
							on : body.node.children[1],
							is : [ "click" ]
						}
					],
					only_if : function ( heard ) {
						return ( heard.event.target.getAttribute("data-value") )
					}
				}
			]
		})
		event_circle.add_listener([
			{
				for       : "option_select",
				that_does : function ( heard ) {
					heard.state.chosen.value                         = heard.event.target.getAttribute("data-value")
					heard.state.body.selected.firstChild.textContent = heard.state.chosen.value
					return {
						event : heard.state.event,
						state : event_circle.stage_event({
							called : "toggle_dropdown"
						}).get_state(),
					}
				},
			},
			{
				for       : "toggle_dropdown",
				that_does : function ( heard ) {
					
					if ( heard.state.open ) {
						heard.state.open                      = false
						heard.state.body.choice.style.display = "none"
					} else { 
						heard.state.open                      = true
						heard.state.body.choice.style.display = "block"
					}

					return heard
				}
			}
		])

		return body
	},

	define_body : function ( define ) {
		return { 
			type      : "div",
			attribute : {
				"class" : define.class_name.main,
			},
			children : [
				{
					type      : "div",
					attribute : {
						"class" : define.class_name.option_selected_wrap
					},
					children : [
						{
							type      : "div",
							attribute : {
								"class" : define.class_name.option_selected
							},
							property  : {
								textContent : define.option.default_option
							}
						},
						{
							type      : "div",
							attribute : {
								"class" : define.class_name.option_selector
							},
							property : { 
								textContent : "+"
							}
						},
					]
				},
				{
					type      : "div",
					style     : { 
						display : "none"
					},
					attribute : { 
						"class" : define.class_name.option_wrap
					},
					children  : this.library.morphism.index_loop({
						array   : define.option.choices,
						else_do : function ( loop ) {
							return loop.into.concat({ 
								type      : "div",
								attribute : {
									"class"      : define.class_name.option,
									"data-value" : loop.indexed
								},
								property : { 
									textContent : loop.indexed
								}
							})
						}
					})
				}
			]
		}
	}
	
})