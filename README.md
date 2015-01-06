Dropdown
========

Not the most creative name now is it? 

A ui package component for replacing dropdowns.

```javascript
dropdown.make({
    class_name : {
        "main"                 : "package_main_dropdown",
        "label"                : "package_main_dropdown_label",
        "select_wrap"          : "package_main_dropdown_select_wrap",
        "option_selected_wrap" : "package_main_dropdown_option_selected_wrap",
        "option_selected"      : "package_main_dropdown_option_selected",
        "option_selector"      : "package_main_dropdown_option_selector",
        "option_wrap"          : "package_main_dropdown_option_wrap",
        "option"               : "package_main_dropdown_option",
    },
    with         : {
        label : {
            text : String
        },
        option : {
            choice : {
                url  : String,
                do   : String,
                flat : Boolean,
                with : Object,
                when : {
                    finished : function ( given ) {
                        // console.log( given )
                        // {
                        //      event  : XMLHttpRequest,
                        //      result : Infinity,
                        //      with   : Object,
                        // }
                        return Infinity
                    }
                }
            },
            mark : {
                open   : String,
                closed : String
            }
        }
    }
})
```