define({
	// style: "",
	name    : "dropdown",
	main    : "dropdown",
	start   : { 
		test     : { 
			with : {
				append_to : document.body,
				option    : {
					default_value : "Documentation",
					mark          : {
						open   : "+",
						closed : "-"
					},
					choice        : [
						"Documentation",
						"Cancellations",
						"Claims",
						"Policy Queries",
						"Administration",
						"Customer Service",
						"New Business",
						"Renewals",
						"Finance",
						"Other",
					]
				},
				class_name : { 
					"main"                 : "main",
					"option_selected_wrap" : "option_selected_wrap",
					"option_selected"      : "option_selected",
					"option_selector"      : "option_selector",
					"option_wrap"          : "option_wrap",
					"option"               : "option",
				},
			}
		}
	},
	module  : [
		"library/morphism",
		"library/event_master",
	],
	package : [
		"library/transistor"
	]
})