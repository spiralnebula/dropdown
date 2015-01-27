define({

	define : {
		allow   : "*",
		require : [
			"morph",
			"transistor",
			"event_master",
			"transit",
			"body",
			"listener",
			"event",
			"piero",
		],
	},

	make : function ( define ) {
		console.log( this.library )
		var event_circle, dropdown_body, option_name

		define.with.option.default_value = define.with.option.default_value || define.with.option.choice[0]
		dropdown_body                    = this.library.transistor.make( 
			this.define_body(
				define
			)
		)
		event_circle                     = this.library.event_master.make({
			state  : this.define_state({
				body : dropdown_body,
				with : define.with,
			}),
			events : this.define_event({
				body : dropdown_body,
				with : define.with
			}),
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
								state.choice = choice
								return { 
									state : state,
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
		return this.library.event.define_state( define )
	},

	define_body : function ( define ) { 
		return this.library.body.define_body( define )
	},

	define_event : function ( define ) { 
		return this.library.event.define_event( define )
	},

	define_listener : function ( define ) {
		return this.library.listener.define_listener( define )
	},

	define_body_map : function ( define ) { 
		return this.library.body.define_body_map( define )
	},
})