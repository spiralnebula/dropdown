(function ( window, module ) {

	"use strict";

	if ( window.define && window.define.amd ) {
		window.define( module )
	} else { 

		var current_scripts, this_script, module_name

		current_scripts     = window.document.getElementsByTagName("script")
		this_script         = current_scripts[current_scripts.length-1]
		module_name         = this_script.getAttribute("data-module-name") || "body"
		window[module_name] = module
	}
})( 
	window,
	{
		define : {
			allow   : "*",
			require : [ 
				"morph" 
			],
		},

		define_body_map : function () { 
			return {
				dropdown    : "last",
				head        : "last:first",
				text        : "last:first:first",
				mark        : "last:first:last",
				option_wrap : "last:last",
				// label       : "first",
			}
		},
			
		define_body : function ( define ) {

			var self, content

			self    = this
			content = []

			if ( define.with.label && define.with.label.text ) {

				content = content.concat({
					"class" : define.class_name.label,
					"text"  : define.with.label.text
				})
			}

			content = content.concat({
				"class" : define.class_name.select_wrap,
				"child" : [
					self.define_option_face({
						class_name : define.class_name,
						with       : define.with
					}),
					self.define_option_box({
						class_name : define.class_name,
						with       : define.with
					})
				]
			})

			return { 
				"class" : define.class_name.main,
				"child" : content
			}
		},

		define_option_face : function ( define ) {

			var selected_text
			
			if ( define.with.option.choice.constructor === Object ) {
				selected_text = "Loading..."
			}

			if ( define.with.option.choice.constructor === Array ) {
				selected_text = define.with.option.value || define.with.option.choice[0]
			}

			return {
				"class"            : define.class_name.option_selected_wrap,
				"data-dropdown"    : "true",
				"data-mark-closed" : define.with.option.mark.closed,
				"data-mark-open"   : define.with.option.mark.open,
				"child"            : [
					{
						"class" : define.class_name.option_selected,
						"text"  : selected_text
					},
					{
						"class" : define.class_name.option_selector,
						"text"  : define.with.option.mark.closed
					},
				]
			}
		}, 

		define_option_box : function ( define ) {

			var definition

			definition = {
				"display" : "none",
				"class"   : define.class_name.option_wrap,
				"child"   : this.define_option_box_items({
					class_name : define.class_name,
					with       : define.with,
				})
			}

			if ( define.with.option.style.option_box_over_content ) {
				definition.position = "absolute"
			}

			return definition
		},

		define_option_box_items : function ( define ) {

			var self = this

			if ( define.with.option.choice.constructor === Object ) {

				return this.define_loading_option({ 
					class_name : define.class_name
				})
			}

			if ( define.with.option.choice.constructor === Array ) {

				return this.library.morph.index_loop({
					subject : define.with.option.choice,
					else_do : function ( loop ) {
						return loop.into.concat( self.define_option({
							class_name : define.class_name,
							option     : loop.indexed
						}))
					}
				})
			}
		},

		define_loading_option : function () { 
			return []
		},

		define_option : function ( define ) {

			var definition

			definition = {
				"class"               : define.class_name.option,
				"data-dropdown-name"  : define.name,
			}

			if ( define.option.value && define.option.text ) {
				definition["data-dropdown-value"] = define.option.value
				definition["data-dropdown-text"]  = define.option.text
				definition.text                   = define.option.text
			} else { 
				definition["data-dropdown-value"] = define.option
				definition["data-dropdown-text"]  = define.option
				definition.text                   = define.option
			}

			return definition
		}
	}
)