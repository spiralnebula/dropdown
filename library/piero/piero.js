(function ( window, module ) {
	
	"use strict"

	if ( window.define && window.define.amd ) {
		window.define(module)
	} else { 

		var current_scripts, this_script, module_name

		current_scripts     = document.getElementsByTagName("script")
		this_script         = current_scripts[current_scripts.length-1]
		module_name         = this_script.getAttribute("data-module-name") || "piero"
		window[module_name] = module
	}
})( 
	window,
	{

		define : {
			require : [
				"morph"
			],
			allow : "*"
		},

		make : function (circle) {

			var event_circle, self

			self         = this
			event_circle = {

				state     : circle.state,

				event     : {
					listeners : {}
				},

				get_state : function () {
					return self.library.morph.copy_value({ 
						value : this.state 
					})
				},

				set_state : function ( new_state ) {

					this.state = new_state

					return this
				},

				get_event_group  : function ( group_name ) {

					return this.event.listeners[group_name]
				},

				add_event : function ( event ) {

					var self, circle_self

					circle_self = this
					event       = (
						event.constructor === Object ? 
							[event] : 
							event 
					)
					this.event.listeners = self.library.morph.index_loop({
						"subject"  : event,
						"into"     : this.event.listeners,
						"else_do"  : function ( loop ) {

							if ( !loop.into.hasOwnProperty(loop.indexed.called ) ) {

								return self.add_event({
									event            : loop.indexed,
									event_list       : self.library.morph.copy_value({ 
										what : loop.into 
									}),
									get_event_group  : function ( group_name ) {
										return circle_self.get_event_group( group_name )
									},
									with_given_state : function () {
										return circle_self.get_state()
									},
									set_state        : function ( new_state ) {
										return circle_self.set_state( new_state )
									}
								})
							} else {
								return loop.into
							}
						}
					})

					return this
				},

				add_listener : function ( add ) {
					
					this.event.listeners = self.add_listeners({
						listeners  : ( 
							add.constructor === Object ? 
								[].concat( add ) :
								add 
						),
						event_list : self.library.morph.copy_value({
							value : this.event.listeners 
						})
					})

					return this
				},

				stage_event : function ( event ) {

					this.set_state(
						self.stage_event({
							event_group : this.get_event_group(
								event.called 
							),
							state : ( 
								event.as ? 
									event.as( this.get_state() ) :
									{ 
										state : this.get_state()
									}
							)
						})
					)

					return this
				},
			}

			event_circle.event.listeners = this.library.morph.index_loop({
				"subject" : circle.events,
				"into"    : {},
				"else_do" : function ( loop ) {
					console.log( loop.indexed )
					return self.add_event({
						event            : loop.indexed,
						event_list       : self.library.morph.copy_value({
							value : loop.into 
						}),
						get_event_group  : function ( group_name ) {
							return event_circle.get_event_group( group_name)
						},
						with_given_state : function () {
							return event_circle.get_state()
						},
						set_state        : function ( new_state ) {
							return event_circle.set_state( new_state )
						}
					})
				}
			})

			return event_circle
		},

		add_listeners : function ( add ) {

			var self = this
			return this.library.morphism.index_loop({
				array    : add.listeners,
				into     : add.event_list,
				else_do  : function ( loop ) {
					return self.add_listener({
						for        : loop.indexed.for,
						that_does  : loop.indexed.that_does,
						event_list : self.library.morphism.copy({ what : loop.into }),
					})
				}
			})
		},

		add_listener : function ( add ) {
			add.event_list[add.for].listeners = add.event_list[add.for].listeners.concat(add.that_does)
			return add.event_list
		},

		add_event : function ( add ) {

			if ( add.event.that_happens ) {

				this.add_event_listener_to_element({
					to          : add.event.that_happens[0].on,
					for         : add.event.that_happens[0].is,
					only_if     : add.event.only_if,
					which_calls : function () {
						return add.get_event_group( 
							add.event.called 
						)
					},
					with_given_state : add.with_given_state,
					set_state        : add.set_state
				})
			}

			add.event_list[add.event.called] = {
				listeners   : [],
				description : add.event
			}

			return add.event_list
		},

		add_event_listener_to_element : function (add) {

			var self
			self = this

			add.to.addEventListener( 
				add.for,
				function ( event ) {
					add.set_state( 
						self.handle_dom_event({
							state    : add.with_given_state(),
							event    : event,
							listener : add.which_calls()
						})
					)
				}
			)
		},

		handle_dom_event : function ( make ) {

			var event_object = {
				state : make.state,
				event : make.event
			}

			return ( 
				make.listener.description.only_if.call({}, event_object ) ?
					this.call_all_event_listeners({
						listeners    : make.listener.listeners,
						event_object : event_object,
					}) :
					make.state
			)
		},

		stage_event : function (stage) {

			return this.call_all_event_listeners({
				listeners    : stage.event_group.listeners,
				event_object : stage.state,
			})
		},

		call_all_event_listeners : function ( call ) {

			var self = this

			return this.library.morph.index_loop({
				subject : call.listeners,
				into    : call.event_object,
				if_done : function ( loop ) {
					return loop.into.state
				},
				else_do : function ( loop ) {
					return loop.indexed.call({}, {
						state : self.library.morph.copy_value({
							value : loop.into.state
						}),
						event : loop.into.event
					})
				}
			})
		}
	}
)