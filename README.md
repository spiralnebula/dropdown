Dropdown
========

Not the most creative name now is it? 

A ui package component for replacing dropdowns.

```javascript
dropdown.make({
    class_name : {
        "main"                 : String,
        "label"                : String,
        "select_wrap"          : String,
        "option_selected_wrap" : String,
        "option_selected"      : String,
        "option_selector"      : String,
        "option_wrap"          : String,
        "option"               : String,
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